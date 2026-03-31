/**
 * AI Feature 2: Request Auto-Categorization
 *
 * Keyword-dictionary approach — fast, deterministic, no API needed.
 * Returns a category + extracted skill tags from request text.
 */

const CATEGORY_KEYWORDS = {
  Programming: [
    'code', 'coding', 'programming', 'bug', 'debug', 'error', 'function',
    'javascript', 'python', 'java', 'react', 'node', 'api', 'backend',
    'frontend', 'database', 'sql', 'typescript', 'css', 'html', 'git',
    'algorithm', 'script', 'module', 'library', 'framework', 'deploy',
    'docker', 'kubernetes', 'aws', 'cloud', 'devops', 'ci', 'cd',
  ],
  Design: [
    'design', 'ui', 'ux', 'figma', 'sketch', 'photoshop', 'illustrator',
    'logo', 'branding', 'color', 'typography', 'wireframe', 'prototype',
    'mockup', 'graphic', 'banner', 'icon', 'visual', 'layout', 'canva',
  ],
  Writing: [
    'write', 'writing', 'content', 'blog', 'article', 'copy', 'copywriting',
    'essay', 'proofreading', 'editing', 'grammar', 'seo', 'resume', 'cv',
    'email', 'newsletter', 'documentation', 'technical writing',
  ],
  Marketing: [
    'marketing', 'seo', 'social media', 'campaign', 'ads', 'advertising',
    'growth', 'analytics', 'strategy', 'branding', 'email marketing',
    'instagram', 'facebook', 'twitter', 'linkedin', 'tiktok', 'influencer',
    'conversion', 'funnel', 'ctr', 'cpc',
  ],
  Tutoring: [
    'learn', 'learning', 'teach', 'teaching', 'tutor', 'tutoring', 'explain',
    'understand', 'concept', 'study', 'course', 'lesson', 'exam', 'test',
    'math', 'physics', 'chemistry', 'biology', 'history', 'english', 'calculus',
  ],
  'Tech Support': [
    'setup', 'install', 'configure', 'fix', 'broken', 'not working', 'issue',
    'problem', 'windows', 'mac', 'linux', 'wifi', 'network', 'printer',
    'hardware', 'software', 'virus', 'slow', 'crash', 'update', 'driver',
  ],
  'Data & Analytics': [
    'data', 'analytics', 'excel', 'pandas', 'numpy', 'tableau', 'power bi',
    'visualization', 'chart', 'graph', 'statistics', 'ml', 'machine learning',
    'ai', 'model', 'dataset', 'cleaning', 'analysis', 'report',
  ],
};

const SKILL_PATTERNS = [
  'javascript', 'python', 'java', 'react', 'node', 'nodejs', 'typescript',
  'html', 'css', 'sql', 'mongodb', 'postgresql', 'mysql', 'redis',
  'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'git', 'github',
  'figma', 'photoshop', 'illustrator', 'canva',
  'seo', 'wordpress', 'shopify',
  'excel', 'pandas', 'numpy', 'tableau', 'r',
  'machine learning', 'deep learning', 'tensorflow', 'pytorch',
  'c++', 'c#', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin',
];

function scoreText(text, keywords) {
  const lower = text.toLowerCase();
  let score = 0;
  keywords.forEach((kw) => {
    if (lower.includes(kw)) score++;
  });
  return score;
}

/**
 * Categorize a request and extract skill tags.
 */
export const categorize = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();

  // Score each category
  const scores = Object.entries(CATEGORY_KEYWORDS).map(([cat, kws]) => ({
    category: cat,
    score: scoreText(text, kws),
  }));

  scores.sort((a, b) => b.score - a.score);
  const topCategory = scores[0].score > 0 ? scores[0].category : 'Other';

  // Extract skill tags
  const extractedSkills = SKILL_PATTERNS.filter((skill) => text.includes(skill));

  return {
    category: topCategory,
    confidence: scores[0].score,
    skills: [...new Set(extractedSkills)].slice(0, 8),
  };
};
