
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const generateInvoice = require('../utils/invoiceGenerator');

// We'll need to create an orderController, but for now let's add basic functionality
const Order = require('../model/orderModel');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.getAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.getById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const orderId = await Order.create(req.body);
    const order = await Order.getById(orderId);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    const updated = await Order.updateStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Download invoice
router.get('/:id/invoice', async (req, res) => {
  try {
    const order = await Order.getById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const invoicePath = await generateInvoice(order);
    
    // Send the file
    res.download(invoicePath, `invoice_${order.id}.pdf`, err => {
      if (err) {
        console.error('Error sending invoice:', err);
      }
      
      // Delete the file after sending (optional)
      setTimeout(() => {
        fs.unlink(invoicePath, err => {
          if (err) console.error('Error deleting invoice file:', err);
        });
      }, 5000);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;