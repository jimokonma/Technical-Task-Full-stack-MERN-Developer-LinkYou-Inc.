const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
    price: 89.99,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'
    ],
    category: 'Electronics',
    stock: 25,
    tags: ['wireless', 'bluetooth', 'headphones', 'audio'],
    sku: 'WH-001',
    weight: 0.3,
    dimensions: { length: 18, width: 8, height: 4 }
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracker with heart rate monitoring, GPS, and water resistance. Track your workouts and health metrics.',
    price: 199.99,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500'
    ],
    category: 'Electronics',
    stock: 15,
    tags: ['fitness', 'smartwatch', 'health', 'tracker'],
    sku: 'SW-002',
    weight: 0.05,
    dimensions: { length: 4, width: 4, height: 1 }
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and sustainable organic cotton t-shirt. Available in multiple colors and sizes. Perfect for everyday wear.',
    price: 24.99,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500'
    ],
    category: 'Clothing',
    stock: 50,
    tags: ['organic', 'cotton', 't-shirt', 'sustainable'],
    sku: 'TS-003',
    weight: 0.2,
    dimensions: { length: 30, width: 25, height: 2 }
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Eco-friendly stainless steel water bottle with insulation. Keeps drinks cold for 24 hours or hot for 12 hours.',
    price: 34.99,
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500'
    ],
    category: 'Home & Garden',
    stock: 30,
    tags: ['water bottle', 'stainless steel', 'insulated', 'eco-friendly'],
    sku: 'WB-004',
    weight: 0.4,
    dimensions: { length: 25, width: 8, height: 8 }
  },
  {
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator.',
    price: 49.99,
    images: [
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500',
      'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=500'
    ],
    category: 'Electronics',
    stock: 20,
    tags: ['wireless', 'charging', 'qi', 'fast charge'],
    sku: 'WC-005',
    weight: 0.15,
    dimensions: { length: 10, width: 10, height: 1 }
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip yoga mat made from eco-friendly materials. Perfect thickness for comfort and stability during practice.',
    price: 39.99,
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
      'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=500'
    ],
    category: 'Sports & Fitness',
    stock: 35,
    tags: ['yoga', 'mat', 'non-slip', 'eco-friendly'],
    sku: 'YM-006',
    weight: 1.2,
    dimensions: { length: 180, width: 60, height: 0.5 }
  },
  {
    name: 'Gaming Mechanical Keyboard',
    description: 'RGB mechanical gaming keyboard with customizable switches and macro keys. Perfect for gamers and programmers.',
    price: 129.99,
    images: [
      'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500',
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500'
    ],
    category: 'Electronics',
    stock: 18,
    tags: ['gaming', 'keyboard', 'mechanical', 'rgb'],
    sku: 'KB-007',
    weight: 0.8,
    dimensions: { length: 45, width: 15, height: 3 }
  },
  {
    name: 'Premium Coffee Maker',
    description: 'Programmable coffee maker with built-in grinder and thermal carafe. Brews perfect coffee every time.',
    price: 159.99,
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500'
    ],
    category: 'Home & Garden',
    stock: 12,
    tags: ['coffee', 'maker', 'programmable', 'grinder'],
    sku: 'CM-008',
    weight: 2.5,
    dimensions: { length: 35, width: 25, height: 40 }
  },
  {
    name: 'Running Shoes Pro',
    description: 'Lightweight running shoes with advanced cushioning technology. Perfect for long-distance running and training.',
    price: 119.99,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500'
    ],
    category: 'Sports & Fitness',
    stock: 28,
    tags: ['running', 'shoes', 'lightweight', 'cushioning'],
    sku: 'RS-009',
    weight: 0.3,
    dimensions: { length: 30, width: 12, height: 8 }
  },
  {
    name: 'Smart Home Security Camera',
    description: '1080p HD security camera with night vision and motion detection. Connects to your smartphone for remote monitoring.',
    price: 79.99,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500'
    ],
    category: 'Electronics',
    stock: 22,
    tags: ['security', 'camera', 'smart home', 'night vision'],
    sku: 'SC-010',
    weight: 0.2,
    dimensions: { length: 8, width: 8, height: 12 }
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    await mongoose.connect(mongoURI, {
      dbName: 'cart-system'
    });
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully inserted ${insertedProducts.length} products`);

    // Display inserted products
    console.log('\n📦 Sample Products Added:');
    insertedProducts.forEach(product => {
      console.log(`- ${product.name}: $${product.price} (${product.stock} in stock)`);
    });

    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase(); 