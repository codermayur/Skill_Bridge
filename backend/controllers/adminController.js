import * as userRepo from '../repositories/userRepository.js';
import * as requestRepo from '../repositories/requestRepository.js';

export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const [users, total] = await Promise.all([
      userRepo.findAllUsers(page, limit),
      userRepo.countUsers(),
    ]);

    res.status(200).json({
      success: true,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await userRepo.findById(req.params.id);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const banUser = async (req, res, next) => {
  try {
    const { isBanned } = req.body;
    if (typeof isBanned !== 'boolean') {
      const err = new Error('isBanned must be a boolean');
      err.statusCode = 400;
      throw err;
    }

    // Prevent admin from banning themselves
    if (req.params.id === req.user._id.toString()) {
      const err = new Error('You cannot ban your own account');
      err.statusCode = 400;
      throw err;
    }

    const user = await userRepo.banUser(req.params.id, isBanned);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      success: true,
      message: isBanned ? 'User banned' : 'User unbanned',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export const getPlatformStats = async (req, res, next) => {
  try {
    const [totalUsers, totalRequests, pendingRequests, completedRequests] = await Promise.all([
      userRepo.countUsers(),
      requestRepo.countAll(),
      requestRepo.countAll({ status: 'pending' }),
      requestRepo.countAll({ status: 'completed' }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: { total: totalUsers },
        requests: {
          total: totalRequests,
          pending: pendingRequests,
          completed: completedRequests,
          completionRate:
            totalRequests > 0
              ? Math.round((completedRequests / totalRequests) * 100)
              : 0,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
