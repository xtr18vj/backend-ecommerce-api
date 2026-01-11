const express = require('express');
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

/**
 * API Routes - Add routes here
 */
// router.use('/auth', require('./authRoutes'));
// router.use('/users', require('./userRoutes'));
// router.use('/products', require('./productRoutes'));
// router.use('/orders', require('./orderRoutes'));

module.exports = router;
