/*  const express = require('express');
const router = express.Router();
*/
/**
 * Health Check Route
 */
/*router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});
*/
/**
 * API Routes - Add routes here
 */
// router.use('/auth', require('./authRoutes'));
// router.use('/users', require('./userRoutes'));
// router.use('/products', require('./productRoutes'));
// router.use('/orders', require('./orderRoutes'));

//module.exports = router;


//changess
/*

const express = require('express');
const bcrypt = require('bcryptjs');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../config/jwt');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
*/
/**
 * Health Check Route
 */
/*
/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check if API is running
 *     responses:
 *       200:
 *         description: API is healthy

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});
*/
/* -------- AUTH ROUTES -------- */
/*
// Example users (replace with MongoDB later)
const users = [
  { id: 1, email: 'user@test.com', passwordHash: bcrypt.hashSync('password123', 10), role: 'user' },
  { id: 2, email: 'vendor@test.com', passwordHash: bcrypt.hashSync('password123', 10), role: 'vendor' },
  { id: 3, email: 'admin@test.com', passwordHash: bcrypt.hashSync('password123', 10), role: 'admin' },
];

// In-memory refresh token store
const refreshStore = new Map();

// Login
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id });

  refreshStore.set(user.id, refreshToken);
  res.json({ success: true, accessToken, refreshToken });
});*/
/*
// Refresh
router.post('/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ success: false, message: 'Missing token' });

  try {
    const payload = verifyRefreshToken(refreshToken);
    const stored = refreshStore.get(payload.sub);
    if (stored !== refreshToken) return res.status(403).json({ success: false, message: 'Token mismatch' });

    const newAccessToken = signAccessToken({ sub: payload.sub, role: payload.role });
    const newRefreshToken = signRefreshToken({ sub: payload.sub });
    refreshStore.set(payload.sub, newRefreshToken);

    res.json({ success: true, accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch {
    res.status(403).json({ success: false, message: 'Invalid refresh token' });
  }
});

// Logout
router.post('/auth/logout', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ success: false, message: 'Missing token' });

  try {
    const payload = verifyRefreshToken(refreshToken);
    refreshStore.delete(payload.sub);
    res.json({ success: true, message: 'Logged out' });
  } catch {
    res.json({ success: true, message: 'Logged out' }); // idempotent
  }
});*/

/* -------- PROTECTED ROUTES -------- */
/*
// Only users can access orders
router.get('/orders', authenticate, authorize('user'), (req, res) => {
  res.json({ success: true, message: `Orders for user ${req.user.sub}` });
});

// Vendors and admins can create products
router.post('/products', authenticate, authorize('vendor', 'admin'), (req, res) => {
  res.json({ success: true, message: `Product created by ${req.user.role}` });
});

module.exports = router;
*/

const express = require('express');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../config/jwt');
const { authenticate, authorize } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

/**
 * Health Check Route
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// In-memory refresh token store (later move to DB or Redis)
const refreshStore = new Map();

/* -------- AUTH ROUTES -------- */

/**
 * LOGIN
 * POST /api/auth/login
 */
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // 2. Compare password
    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // 3. Generate tokens (FIX: role included)
    const accessToken = signAccessToken({
      sub: user._id,
      role: user.role,
    });

    const refreshToken = signRefreshToken({
      sub: user._id,
      role: user.role,
    });

    refreshStore.set(user._id.toString(), refreshToken);

    // 4. Respond
    res.json({
      success: true,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

/**
 * REFRESH TOKEN
 * POST /api/auth/refresh
 */
router.post('/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Missing token',
    });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);

    const stored = refreshStore.get(payload.sub.toString());
    if (stored !== refreshToken) {
      return res.status(403).json({
        success: false,
        message: 'Token mismatch',
      });
    }

    // FIX: role preserved
    const newAccessToken = signAccessToken({
      sub: payload.sub,
      role: payload.role,
    });

    const newRefreshToken = signRefreshToken({
      sub: payload.sub,
      role: payload.role,
    });

    refreshStore.set(payload.sub.toString(), newRefreshToken);

    res.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: 'Invalid refresh token',
    });
  }
});

/**
 * LOGOUT
 * POST /api/auth/logout
 */
router.post('/auth/logout', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: 'Missing token',
    });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    refreshStore.delete(payload.sub.toString());
  } catch {
    // ignore error (idempotent logout)
  }

  res.json({
    success: true,
    message: 'Logged out',
  });
});

/* -------- PROTECTED ROUTES -------- */

// Only users can access orders
router.get('/orders', authenticate, authorize('user'), (req, res) => {
  res.json({
    success: true,
    message: `Orders for user ${req.user.sub}`,
  });
});

// Vendors and admins can create products
router.post(
  '/products',
  authenticate,
  authorize('vendor', 'admin'),
  (req, res) => {
    res.json({
      success: true,
      message: `Product created by ${req.user.role}`,
    });
  }
);

module.exports = router;
