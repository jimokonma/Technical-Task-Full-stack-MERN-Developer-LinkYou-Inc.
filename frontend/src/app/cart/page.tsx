'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { formatPrice } from '@/lib/utils';
import { productAPI } from '@/lib/api';
import { Product } from '@/types';
import { Trash2, Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { cart, loading, updateCartItem, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  const router = useRouter();
  const [productDetails, setProductDetails] = useState<{ [key: string]: Product }>({});
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Load product details for cart items
  useEffect(() => {
    if (cart && cart.items.length > 0) {
      loadProductDetails();
    }
  }, [cart]);

  const loadProductDetails = async () => {
    if (!cart || cart.items.length === 0) return;

    // Debug: Log cart items to see the structure
    console.log('Cart items:', cart.items);
    console.log('First item productId:', cart.items[0]?.productId, typeof cart.items[0]?.productId);

    try {
      setLoadingProducts(true);
      const productIds = cart.items.map(item => {
        // Ensure productId is a string
        const productId = item.productId;
        if (typeof productId === 'string') {
          return productId;
        } else if (typeof productId === 'object' && productId && '_id' in productId) {
          return (productId as any)._id;
        } else {
          return String(productId);
        }
      });
      const details: { [key: string]: Product } = {};

      // Load each product detail
      for (const productId of productIds) {
        if (!productId || productId === 'undefined' || productId === 'null') {
          console.warn('Skipping invalid product ID:', productId);
          continue;
        }
        
        try {
          const response = await productAPI.getProduct(productId);
          details[productId] = response.data.product;
        } catch (error) {
          console.error(`Failed to load product ${productId}:`, error);
          showError('Product Load Failed', `Could not load details for one or more products`);
        }
      }

      setProductDetails(details);
      if (Object.keys(details).length > 0) {
        showSuccess('Cart Loaded', 'Product details loaded successfully');
      }
    } catch (error) {
      console.error('Failed to load product details:', error);
      showError('Load Failed', 'Failed to load product details');
    } finally {
      setLoadingProducts(false);
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading cart...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    try {
      await updateCartItem(productId, newQuantity);
      showSuccess('Cart Updated', 'Item quantity updated successfully');
    } catch (error: any) {
      console.error('Failed to update quantity:', error);
      showError('Update Failed', error.message || 'Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart(productId);
      showSuccess('Item Removed', 'Item removed from cart');
    } catch (error: any) {
      console.error('Failed to remove item:', error);
      showError('Remove Failed', error.message || 'Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
        showSuccess('Cart Cleared', 'All items removed from cart');
      } catch (error: any) {
        console.error('Failed to clear cart:', error);
        showError('Clear Failed', error.message || 'Failed to clear cart');
      }
    }
  };

  const handleCheckout = () => {
    showInfo('Coming Soon', 'Checkout functionality coming as soon as I am hired!');
  };

  return (
    <div>
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <Link
            href="/products"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        </div>

        {!cart || cart.items.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link
              href="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : loadingProducts ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product details...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Cart Items ({cart.uniqueItemCount})
                    </h2>
                    <button
                      onClick={handleClearCart}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {cart.items.map((item) => {
                    // Ensure productId is a string for lookup
                    const productId = typeof item.productId === 'string' ? item.productId : 
                                     typeof item.productId === 'object' && item.productId && '_id' in item.productId ? 
                                     (item.productId as any)._id : String(item.productId);
                    const product = productDetails[productId];
                    return (
                      <div key={productId} className="p-6">
                        <div className="flex items-center space-x-4">
                          {/* Product Image */}
                          <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                            {product?.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                {loadingProducts ? 'Loading...' : 'No Image'}
                              </div>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {product?.name || 'Product Unavailable'}
                            </h3>
                            <p className="text-sm text-gray-500 truncate">
                              {product?.description || 'Product details could not be loaded'}
                            </p>
                            <p className="text-sm text-gray-500">
                              Price: {formatPrice(item.priceAtAdd)}
                            </p>
                            {product && (
                              <p className="text-xs text-gray-400">
                                Category: {product.category}
                              </p>
                            )}
                            {!product && (
                              <p className="text-xs text-red-400">
                                Product may have been removed
                              </p>
                            )}
                          </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4 text-gray-800" />
                          </button>
                          <span className="w-12 text-center font-medium text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(productId, item.quantity + 1)}
                            disabled={item.quantity >= (product?.stock || 0)}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4 text-gray-800" />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            {formatPrice(item.priceAtAdd * item.quantity)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(productId)}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items ({cart.itemCount})</span>
                    <span className="text-gray-900">{formatPrice(cart.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-900">$0.00</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(cart.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Proceed to Checkout
                </button>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    Secure checkout powered by Stripe
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 