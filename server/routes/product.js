const express = require('express');
const { auth } = require('../middleware/auth');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  searchProducts
} = require('../controllers/productController');

const router = express.Router();

// Public routes - order matters for Express routing
router.get('/categories', getCategories);
router.get('/search', searchProducts);
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes (Admin only)
router.post('/', auth, createProduct);
router.put('/:id', auth, updateProduct);
router.delete('/:id', auth, deleteProduct);

module.exports = router; 