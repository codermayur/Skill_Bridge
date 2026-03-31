import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock the repository so we don't need a real DB connection
jest.unstable_mockModule('../repositories/userRepository.js', () => ({
  findHelpers: jest.fn().mockResolvedValue([
    {
      _id: '1',
      fullName: 'Alice Smith',
      email: 'alice@example.com',
      skills: ['JavaScript', 'React', 'Node.js'],
      bio: 'Full-stack developer specializing in React and Node.js',
      reputation: { score: 4.8, totalReviews: 12, totalRating: 57 },
    },
    {
      _id: '2',
      fullName: 'Bob Jones',
      email: 'bob@example.com',
      skills: ['Python', 'Machine Learning', 'pandas'],
      bio: 'Data scientist with Python expertise',
      reputation: { score: 4.5, totalReviews: 8, totalRating: 36 },
    },
    {
      _id: '3',
      fullName: 'Carol White',
      email: 'carol@example.com',
      skills: ['Figma', 'UI Design', 'Photoshop'],
      bio: 'UI/UX designer with 5 years experience',
      reputation: { score: 4.9, totalReviews: 20, totalRating: 98 },
    },
  ]),
}));

const { findMatchingHelpers } = await import('../services/matchingService.js');

describe('matchingService', () => {
  it('returns helpers sorted by relevance score', async () => {
    const request = {
      title: 'Help with React bug',
      description: 'I have a bug in my React component using JavaScript and Node.js',
      skills: ['React', 'JavaScript'],
    };

    const results = await findMatchingHelpers(request, 5);

    expect(results).toBeInstanceOf(Array);
    expect(results.length).toBeGreaterThan(0);

    // Alice should score highest for a React/JS request
    expect(results[0].helper.fullName).toBe('Alice Smith');

    // Results should be sorted descending by score
    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].score).toBeGreaterThanOrEqual(results[i + 1].score);
    }
  });

  it('returns top N results', async () => {
    const request = {
      title: 'Python data analysis',
      description: 'Need help with pandas and numpy for data analysis in Python',
      skills: ['Python', 'pandas'],
    };

    const results = await findMatchingHelpers(request, 2);
    expect(results.length).toBeLessThanOrEqual(2);
  });

  it('each result has required shape', async () => {
    const request = {
      title: 'Design help',
      description: 'Need UI/UX design work in Figma',
      skills: ['Figma'],
    };

    const results = await findMatchingHelpers(request, 5);
    results.forEach((r) => {
      expect(r).toHaveProperty('helper');
      expect(r).toHaveProperty('score');
      expect(r).toHaveProperty('skillOverlap');
      expect(r.helper).toHaveProperty('fullName');
      expect(r.helper).toHaveProperty('skills');
      expect(typeof r.score).toBe('number');
    });
  });
});
