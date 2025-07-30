const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    let cart = await Cart.findOne({ userId }).populate({
      path: 'items.productId',
      select: 'name description price images category stock isActive',
      match: { isActive: true }
    });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }

    // Filter out products that are no longer active or available
    cart.items = cart.items.filter(item => item.productId && item.productId.isActive);

    // Calculate totals
    const totalAmount = cart.items.reduce((total, item) => {
      return total + (item.priceAtAdd * item.quantity);
    }, 0);

    const itemCount = cart.items.reduce((count, item) => {
      return count + item.quantity;
    }, 0);

    res.json({
      cart: {
        id: cart._id,
        items: cart.items,
        totalAmount,
        itemCount,
        uniqueItemCount: cart.items.length,
        lastUpdated: cart.lastUpdated
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      error: 'Failed to fetch cart',
      message: error.message
    });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;

    // Validate input
    if (!productId) {
      return res.status(400).json({
        error: 'Product ID is required'
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        error: 'Quantity must be at least 1'
      });
    }

    // Check if product exists and is active
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        error: 'Product not found'
      });
    }

    if (!product.isActive) {
      return res.status(400).json({
        error: 'Product is not available'
      });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({
        error: 'Insufficient stock available',
        availableStock: product.stock
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update existing item
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (product.stock < newQuantity) {
        return res.status(400).json({
          error: 'Insufficient stock available for total quantity',
          availableStock: product.stock,
          currentInCart: cart.items[existingItemIndex].quantity,
          requestedQuantity: quantity
        });
      }

      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].priceAtAdd = product.price;
    } else {
      // Add new item
      cart.items.push({
        productId,
        quantity,
        priceAtAdd: product.price,
        addedAt: new Date()
      });
    }

    cart.lastUpdated = new Date();
    await cart.save();

    // Populate product details for response
    await cart.populate({
      path: 'items.productId',
      select: 'name description price images category stock'
    });

    // Calculate totals
    const totalAmount = cart.items.reduce((total, item) => {
      return total + (item.priceAtAdd * item.quantity);
    }, 0);

    const itemCount = cart.items.reduce((count, item) => {
      return count + item.quantity;
    }, 0);

    res.json({
      message: 'Item added to cart successfully',
      cart: {
        id: cart._id,
        items: cart.items,
        totalAmount,
        itemCount,
        uniqueItemCount: cart.items.length,
        lastUpdated: cart.lastUpdated
      }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid product ID'
      });
    }
    res.status(500).json({
      error: 'Failed to add item to cart',
      message: error.message
    });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    // Validate input
    if (quantity < 0) {
      return res.status(400).json({
        error: 'Quantity cannot be negative'
      });
    }

    // Find cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        error: 'Cart not found'
      });
    }

    // Find item in cart
    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        error: 'Item not found in cart'
      });
    }

    // Check product availability if quantity > 0
    if (quantity > 0) {
      const product = await Product.findById(productId);
      if (!product || !product.isActive) {
        return res.status(400).json({
          error: 'Product is not available'
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          error: 'Insufficient stock available',
          availableStock: product.stock
        });
      }

      // Update quantity
      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].priceAtAdd = product.price;
    } else {
      // Remove item if quantity is 0
      cart.items.splice(itemIndex, 1);
    }

    cart.lastUpdated = new Date();
    await cart.save();

    // Populate product details for response
    await cart.populate({
      path: 'items.productId',
      select: 'name description price images category stock'
    });

    // Calculate totals
    const totalAmount = cart.items.reduce((total, item) => {
      return total + (item.priceAtAdd * item.quantity);
    }, 0);

    const itemCount = cart.items.reduce((count, item) => {
      return count + item.quantity;
    }, 0);

    res.json({
      message: quantity > 0 ? 'Cart item updated successfully' : 'Item removed from cart',
      cart: {
        id: cart._id,
        items: cart.items,
        totalAmount,
        itemCount,
        uniqueItemCount: cart.items.length,
        lastUpdated: cart.lastUpdated
      }
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid product ID'
      });
    }
    res.status(500).json({
      error: 'Failed to update cart item',
      message: error.message
    });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    // Find cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        error: 'Cart not found'
      });
    }

    // Find and remove item
    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        error: 'Item not found in cart'
      });
    }

    cart.items.splice(itemIndex, 1);
    cart.lastUpdated = new Date();
    await cart.save();

    // Populate product details for response
    await cart.populate({
      path: 'items.productId',
      select: 'name description price images category stock'
    });

    // Calculate totals
    const totalAmount = cart.items.reduce((total, item) => {
      return total + (item.priceAtAdd * item.quantity);
    }, 0);

    const itemCount = cart.items.reduce((count, item) => {
      return count + item.quantity;
    }, 0);

    res.json({
      message: 'Item removed from cart successfully',
      cart: {
        id: cart._id,
        items: cart.items,
        totalAmount,
        itemCount,
        uniqueItemCount: cart.items.length,
        lastUpdated: cart.lastUpdated
      }
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid product ID'
      });
    }
    res.status(500).json({
      error: 'Failed to remove item from cart',
      message: error.message
    });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        error: 'Cart not found'
      });
    }

    cart.items = [];
    cart.lastUpdated = new Date();
    await cart.save();

    res.json({
      message: 'Cart cleared successfully',
      cart: {
        id: cart._id,
        items: [],
        totalAmount: 0,
        itemCount: 0,
        uniqueItemCount: 0,
        lastUpdated: cart.lastUpdated
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      error: 'Failed to clear cart',
      message: error.message
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
}; 