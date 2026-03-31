import { describe, it, expect, jest, beforeEach } from '@jest/globals';

jest.unstable_mockModule('../repositories/userRepository.js', () => ({
  findByEmail: jest.fn(),
  findByEmailWithPassword: jest.fn(),
  createUser: jest.fn(),
  findByResetToken: jest.fn(),
  updateById: jest.fn(),
  isEmailTaken: jest.fn(),
  findHelpers: jest.fn(),
  findAllUsers: jest.fn(),
  countUsers: jest.fn(),
  banUser: jest.fn(),
  findById: jest.fn(),
}));

jest.unstable_mockModule('../utils/generateToken.js', () => ({
  generateToken: jest.fn().mockReturnValue('mock-jwt-token'),
}));

jest.unstable_mockModule('../utils/sendEmail.js', () => ({
  default: jest.fn().mockResolvedValue(true),
}));

jest.unstable_mockModule('../utils/emailTemplates.js', () => ({
  forgotPasswordEmail: jest.fn().mockReturnValue('<html>Reset email</html>'),
  testScoreEmail: jest.fn().mockReturnValue('<html>Score email</html>'),
}));

const userRepo = await import('../repositories/userRepository.js');
const { signup, login } = await import('../services/authService.js');

describe('authService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('signup()', () => {
    it('throws 400 if email already exists', async () => {
      userRepo.findByEmail.mockResolvedValue({ _id: 'existing-id' });
      await expect(signup({ fullName: 'Test', email: 'test@test.com', password: 'pass123' }))
        .rejects.toMatchObject({ statusCode: 400 });
    });

    it('creates user and returns token when email is unique', async () => {
      userRepo.findByEmail.mockResolvedValue(null);
      userRepo.createUser.mockResolvedValue({
        _id: 'new-id',
        fullName: 'New User',
        email: 'new@test.com',
        createdAt: new Date(),
      });

      const result = await signup({ fullName: 'New User', email: 'new@test.com', password: 'pass123' });
      expect(result.token).toBe('mock-jwt-token');
      expect(result.user.email).toBe('new@test.com');
    });
  });

  describe('login()', () => {
    it('throws 401 if user not found', async () => {
      userRepo.findByEmailWithPassword.mockResolvedValue(null);
      await expect(login({ email: 'bad@test.com', password: 'pass' }))
        .rejects.toMatchObject({ statusCode: 401 });
    });

    it('throws 401 if password does not match', async () => {
      userRepo.findByEmailWithPassword.mockResolvedValue({
        matchPassword: jest.fn().mockResolvedValue(false),
      });
      await expect(login({ email: 'ok@test.com', password: 'wrong' }))
        .rejects.toMatchObject({ statusCode: 401 });
    });

    it('returns token on successful login', async () => {
      const mockSave = jest.fn().mockResolvedValue(true);
      userRepo.findByEmailWithPassword.mockResolvedValue({
        _id: 'uid',
        fullName: 'User',
        email: 'ok@test.com',
        lastLogin: null,
        matchPassword: jest.fn().mockResolvedValue(true),
        save: mockSave,
      });

      const result = await login({ email: 'ok@test.com', password: 'correct' });
      expect(result.token).toBe('mock-jwt-token');
      expect(mockSave).toHaveBeenCalled();
    });
  });
});
