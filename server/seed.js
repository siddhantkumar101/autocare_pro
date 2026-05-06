require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();
    console.log('Seeding data...');

    await User.deleteMany();
    await Product.deleteMany();

    const users = await User.insertMany([
      { name: 'Admin User', email: 'admin@test.com', password: 'password123', role: 'admin' },
      { name: 'Customer User', email: 'customer@test.com', password: 'password123', role: 'customer' },
      { name: 'Seller User', email: 'seller@test.com', password: 'password123', role: 'seller' },
    ]);

    const admin = users[0];
    const seller = users[2];

    const products = [
      { name: 'Premium Synthetic Motor Oil', description: '5W-30 synthetic motor oil for all weather.', category: 'Fluids & Oils', brand: 'Mobil 1', price: 1500, stock: 50, sku: 'OIL-001', sellerId: seller._id },
      { name: 'Ceramic Brake Pads', description: 'High-performance ceramic brake pads.', category: 'Brakes', brand: 'Bosch', price: 3000, stock: 20, sku: 'BRK-001', sellerId: seller._id },
      { name: 'Air Filter', description: 'Engine air filter for better fuel economy.', category: 'Filters', brand: 'K&N', price: 1200, stock: 3, sku: 'FLT-001', sellerId: seller._id }, // Low stock
      { name: 'Spark Plugs Set', description: 'Iridium spark plugs set of 4.', category: 'Engine Parts', brand: 'NGK', price: 2000, stock: 30, sku: 'ENG-001', sellerId: seller._id },
      { name: 'Car Battery 12V', description: 'Maintenance-free 12V car battery.', category: 'Electrical', brand: 'Exide', price: 6000, stock: 15, sku: 'ELE-001', sellerId: seller._id },
      { name: 'Windshield Wipers', description: 'All-season hybrid wiper blades.', category: 'Accessories', brand: 'Bosch', price: 800, stock: 100, sku: 'ACC-001', sellerId: seller._id },
      { name: 'LED Headlight Bulbs', description: 'H7 LED headlight conversion kit.', category: 'Lighting', brand: 'Philips', price: 2500, stock: 40, sku: 'LGT-001', sellerId: seller._id },
      { name: 'All-Season Tires', description: '205/55R16 all-season tires.', category: 'Tires & Wheels', brand: 'Michelin', price: 8000, stock: 2, sku: 'TIR-001', sellerId: seller._id }, // Low stock
      { name: 'Cabin Air Filter', description: 'Activated carbon cabin air filter.', category: 'Filters', brand: 'Fram', price: 900, stock: 25, sku: 'FLT-002', sellerId: seller._id },
      { name: 'Coolant/Antifreeze', description: 'Pre-mixed 50/50 engine coolant.', category: 'Fluids & Oils', brand: 'Prestone', price: 600, stock: 60, sku: 'OIL-002', sellerId: seller._id },
    ];

    await Product.insertMany(products);

    console.log('✅ Data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedData();
