/**
 * AI Feature 1: Skill Matching System
 *
 * Pure JS TF-IDF + cosine similarity — no external API needed.
 * Extracts skills from request text, compares with helper skill profiles,
 * and returns ranked top-N helpers.
 */

import * as userRepo from '../repositories/userRepository.js';

// --- Keyword extraction ---

const STOP_WORDS = new Set([
  'i', 'me', 'my', 'we', 'you', 'he', 'she', 'it', 'they', 'this', 'that',
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
  'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
  'would', 'can', 'could', 'should', 'may', 'might', 'need', 'want',
  'help', 'please', 'thank', 'thanks',
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

function buildTermFrequency(tokens) {
  const tf = {};
  tokens.forEach((t) => { tf[t] = (tf[t] || 0) + 1; });
  const max = Math.max(...Object.values(tf), 1);
  Object.keys(tf).forEach((k) => { tf[k] /= max; });
  return tf;
}

function cosineSimilarity(vecA, vecB) {
  const keys = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
  let dot = 0, magA = 0, magB = 0;
  keys.forEach((k) => {
    const a = vecA[k] || 0;
    const b = vecB[k] || 0;
    dot += a * b;
    magA += a * a;
    magB += b * b;
  });
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

// --- Public API ---

/**
 * Find top helpers for a given request.
 * @param {Object} request - Request document with title, description, skills
 * @param {number} topN - How many helpers to return
 */
export const findMatchingHelpers = async (request, topN = 5) => {
  const requestText = `${request.title} ${request.description} ${(request.skills || []).join(' ')}`;
  const requestTokens = tokenize(requestText);
  const requestTF = buildTermFrequency(requestTokens);

  // Fetch users who have declared skills and are not banned
  const helpers = await userRepo.findHelpers();

  const scored = helpers.map((helper) => {
    const helperText = [
      ...(helper.skills || []),
      helper.bio || '',
      helper.fullName,
    ].join(' ');
    const helperTokens = tokenize(helperText);
    const helperTF = buildTermFrequency(helperTokens);

    // Bonus: direct skill tag overlap
    const requestSkillSet = new Set((request.skills || []).map((s) => s.toLowerCase()));
    const helperSkillSet = new Set((helper.skills || []).map((s) => s.toLowerCase()));
    const overlap = [...requestSkillSet].filter((s) => helperSkillSet.has(s)).length;
    const tagBonus = overlap * 0.2;

    const similarity = cosineSimilarity(requestTF, helperTF) + tagBonus;

    return {
      helper: {
        id: helper._id,
        fullName: helper.fullName,
        email: helper.email,
        skills: helper.skills,
        bio: helper.bio,
        reputation: helper.reputation,
      },
      score: Math.min(1, Math.round(similarity * 100) / 100),
      skillOverlap: overlap,
    };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
};
