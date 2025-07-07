const express = require('express');
const router = express.Router();
const Product = require('../model/productModel');
const Order = require('../model/orderModel');
const Customer = require('../model/customerModel');

router.get('/stats', async (req, res) => {
  try {
    const [products, orders, customers, lowStock, categories] = await Promise.all([
      Product.getAll(),
      Order.getAll(),
      Customer.getAll(),
      Product.getLowStock(),
      require('../model/categoryModel').getAll()
    ]);
    res.json({
      products: products.length,
      orders: orders.length,
      customers: customers.length,
      lowStock: lowStock.length,
      categories: categories.length // Add this line
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;