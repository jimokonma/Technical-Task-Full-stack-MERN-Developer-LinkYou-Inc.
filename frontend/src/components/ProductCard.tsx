'use client';

import { Product } from '@/types';
import { formatPrice, getStockStatus, truncateText } from '@/lib/utils';
import { ShoppingCart, Star, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showQuantity, setShowQuantity] = useState(false);

  const stockStatus = getStockStatus(product.stock);
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = async () => {
    if (!user) {
      showError('Authentication Required', 'Please login to add items to cart');
      return;
    }

    if (isOutOfStock) return;

    const productId = product._id || product.id;
    if (!productId) {
      showError('Error', 'Product ID not found');
      return;
    }

    try {
      setIsAdding(true);
      await addToCart(productId, quantity);
      setShowQuantity(false);
      setQuantity(1);
      showSuccess('Added to Cart', `${quantity} ${quantity === 1 ? 'item' : 'items'} added to your cart`);
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to add item to cart';
      showError('Error', errorMessage);
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-200 flex-shrink-0">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        
        {/* Stock Status Badge */}
        <div className="absolute top-2 right-2">
          <span className={cn(
            "px-2 py-1 text-xs font-medium rounded-full",
            stockStatus.color,
            "bg-white/90 backdrop-blur-sm"
          )}>
            {stockStatus.label}
          </span>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-2 left-2">
          <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium text-gray-700">4.5</span>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category */}
        <div className="text-xs text-blue-600 font-medium mb-1">
          {product.category}
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
          {truncateText(product.description, 100)}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.stock > 0 && (
            <span className="text-sm text-gray-500">
              {product.stock} in stock
            </span>
          )}
        </div>

        {/* Add to Cart Section */}
        <div className="space-y-2 mt-auto">
          {!showQuantity ? (
            <button
              onClick={() => setShowQuantity(true)}
              disabled={isOutOfStock}
              className={cn(
                "w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-colors",
                isOutOfStock
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              )}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </span>
            </button>
          ) : (
            <div className="space-y-2">
              {/* Quantity Selector */}
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Minus className="w-4 h-4 text-gray-800" />
                </button>
                <span className="w-12 text-center font-medium text-gray-900">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                  className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 text-gray-800" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAdding ? 'Adding...' : `Add ${quantity} to Cart`}
              </button>

              {/* Cancel Button */}
              <button
                onClick={() => {
                  setShowQuantity(false);
                  setQuantity(1);
                }}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 