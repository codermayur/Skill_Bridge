import { describe, it, expect } from '@jest/globals';
import { categorize } from '../services/categorizationService.js';

describe('categorizationService', () => {
  describe('categorize()', () => {
    it('detects Programming category', () => {
      const result = categorize(
        'Help me fix a JavaScript bug in my React app',
        'I have an error in my useEffect hook. The code is crashing when the component mounts.'
      );
      expect(result.category).toBe('Programming');
    });

    it('detects Design category', () => {
      const result = categorize(
        'Need a logo designed in Figma',
        'I need a minimalist logo design for my startup. Looking for someone skilled in Figma and Illustrator.'
      );
      expect(result.category).toBe('Design');
    });

    it('detects Writing category', () => {
      const result = categorize(
        'Need a blog article written about SEO',
        'I need a well-written blog article about content marketing and SEO strategies. Good grammar is essential.'
      );
      expect(result.category).toBe('Writing');
    });

    it('extracts skill tags', () => {
      const result = categorize(
        'React and Node.js project help',
        'I need help with a full-stack application using React, Node.js, MongoDB, and Docker.'
      );
      expect(result.skills).toContain('react');
      expect(result.skills).toContain('node');
      expect(result.skills).toContain('mongodb');
      expect(result.skills).toContain('docker');
    });

    it('falls back to Other for ambiguous text', () => {
      const result = categorize('General question', 'I need some assistance with a task.');
      expect(result.category).toBe('Other');
    });

    it('returns confidence score >= 0', () => {
      const result = categorize('Python pandas data analysis', 'Need help cleaning a large dataset using pandas and numpy.');
      expect(result.confidence).toBeGreaterThanOrEqual(0);
    });
  });
});
