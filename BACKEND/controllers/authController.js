const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sha256 } = require('../utils/crypto');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');

async function getNextLegacyId() {
  const last = await User.findOne({}, { legacyId: 1 }).sort({ legacyId: -1 }).lean().exec();
  return (last?.legacyId || 0) + 1;
}

function publicUser(u) {
  return {
    id: u.legacyId,
    _id: u._id,
    username: u.username,
    email: u.email,
    roles: u.roles
  };
}

function setAuthCookies(res, refreshToken) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
    path: '/auth/refresh',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

async function register(req, res, next) {
  try {
    const { username, email, password, roles } = req.body || {};
    if (!username || !email || !password) {
      const err = new Error('Username, email and password are required');
      err.statusCode = 400;
      return next(err);
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const legacyId = await getNextLegacyId();

    const allowedRoles = ['student', 'teacher', 'admin', 'moderator', 'user'];
    const safeRoles =
      Array.isArray(roles) && roles.length
        ? roles.filter((role) => allowedRoles.includes(role))
        : ['student'];

    const user = await User.create({
      legacyId,
      username,
      email,
      passwordHash,
      roles: safeRoles
    });

    return res.status(201).json(publicUser(user));
  } catch (err) {
    if (err.code === 11000) {
      err.statusCode = 400;
      err.message = 'Username or email already exists';
    }
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { username, email, password } = req.body || {};
    const identity = username || email;
    if (!identity || !password) {
      const err = new Error('Username/email and password are required');
      err.statusCode = 400;
      return next(err);
    }

    const user = await User.findOne(
      username ? { username } : { email: String(email).toLowerCase() }
    ).exec();

    if (!user) {
      const err = new Error('Invalid username or password');
      err.statusCode = 401;
      return next(err);
    }

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) {
      const err = new Error('Invalid username or password');
      err.statusCode = 401;
      return next(err);
    }

    // Session auth (stateful)
    if (req.session) {
      req.session.userId = user._id.toString();
      req.session.legacyId = user.legacyId;
      req.session.roles = user.roles;
    }

    // Regular cookie demo (non-session cookie)
    res.cookie('lastLoginAt', new Date().toISOString(), { sameSite: 'lax' });

    // JWT auth (stateless)
    const accessToken = signAccessToken({
      sub: user._id.toString(),
      id: user.legacyId,
      roles: user.roles
    });

    const refreshToken = signRefreshToken({
      sub: user._id.toString(),
      id: user.legacyId
    });

    const refreshHash = sha256(refreshToken);
    user.refreshTokenHashes = Array.from(new Set([...(user.refreshTokenHashes || []), refreshHash]));
    await user.save();

    setAuthCookies(res, refreshToken);

    return res.json({ user: publicUser(user), accessToken });
  } catch (err) {
    return next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      const err = new Error('Missing refresh token cookie');
      err.statusCode = 401;
      return next(err);
    }

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.sub).exec();
    if (!user) {
      const err = new Error('Invalid refresh token');
      err.statusCode = 401;
      return next(err);
    }

    const tokenHash = sha256(token);
    if (!(user.refreshTokenHashes || []).includes(tokenHash)) {
      const err = new Error('Refresh token revoked');
      err.statusCode = 401;
      return next(err);
    }

    const accessToken = signAccessToken({
      sub: user._id.toString(),
      id: user.legacyId,
      roles: user.roles
    });

    return res.json({ accessToken });
  } catch (err) {
    err.statusCode = 401;
    err.message = err.name === 'TokenExpiredError' ? 'Refresh token expired' : 'Invalid refresh token';
    return next(err);
  }
}

async function logout(req, res, next) {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      try {
        const decoded = verifyRefreshToken(token);
        const user = await User.findById(decoded.sub).exec();
        if (user) {
          const tokenHash = sha256(token);
          user.refreshTokenHashes = (user.refreshTokenHashes || []).filter((h) => h !== tokenHash);
          await user.save();
        }
      } catch (_) {
        // ignore invalid token
      }
    }

    if (req.session) {
      req.session.destroy(() => {});
    }

    res.clearCookie('refreshToken', { path: '/auth/refresh' });
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login, refresh, logout };

