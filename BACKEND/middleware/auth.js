const { verifyAccessToken } = require('../utils/jwt');

function requireAuth(req, res, next) {
  const sessionUserId = req.session?.userId;
  const sessionRoles = req.session?.roles;
  const sessionLegacyId = req.session?.legacyId;

  const useSessionAuth = () => {
    if (!sessionUserId) return false;
    req.user = {
      sub: String(sessionUserId),
      id: Number(sessionLegacyId || 0),
      roles: Array.isArray(sessionRoles) ? sessionRoles : []
    };
    return true;
  };

  const header = req.headers.authorization || '';
  const [, token] = header.split(' ');

  if (!token) {
    if (useSessionAuth()) return next();
    const err = new Error('Missing Authorization Bearer token');
    err.statusCode = 401;
    return next(err);
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    return next();
  } catch (err) {
    // Graceful fallback: if JWT expired/invalid but session is active, allow request.
    if (useSessionAuth()) return next();
    err.statusCode = 401;
    err.message =
      err.name === 'TokenExpiredError' ? 'Access token expired' : 'Invalid access token';
    return next(err);
  }
}

function requireRole(...roles) {
  return function roleMiddleware(req, res, next) {
    const userRoles = req.user?.roles || [];
    const ok = roles.some((r) => userRoles.includes(r));
    if (!ok) {
      const err = new Error('Forbidden: insufficient role');
      err.statusCode = 403;
      return next(err);
    }
    return next();
  };
}

module.exports = { requireAuth, requireRole };

