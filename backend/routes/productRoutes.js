const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const jwt = require('jsonwebtoken');

router.get('/', productController.getAllProducts);
router.get('/low-stock', productController.getLowStockProducts);
router.get('/:id', productController.getProductById);
router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;
    req.body.user_id = user_id;
    await productController.createProduct(req, res);
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
});
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;