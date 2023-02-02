const express = require('express');
const authMiddlewares = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const productValidation = require('../validations/product.validation');
const productController = require('../controllers/product.controller');

const router = express.Router();

router
  .route('/')
  .post(authMiddlewares.auth(), validate(productValidation.createProduct), productController.createProduct)
  .get(authMiddlewares.auth(),validate(productValidation.getProducts), productController.getProducts);

router
  .route('/:productId')
  .get(authMiddlewares.auth(), validate(productValidation.getProduct), productController.getProduct)
  .patch(authMiddlewares.auth(), validate(productValidation.updateProduct), productController.updateProduct)
  .delete(authMiddlewares.auth(), validate(productValidation.deleteProduct), productController.deleteProduct);

module.exports = router;
