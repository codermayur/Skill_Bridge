/**
 * Middleware that allows access only to users with role === 'admin'.
 * Must be used after the `protect` middleware (which sets req.user).
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    });
  }
  next();
};

export default requireAdmin;
