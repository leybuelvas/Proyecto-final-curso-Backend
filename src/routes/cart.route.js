const express = require('express');
const authMiddlewares = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {cartValidation} = require('../validations');
const cartController = require('../controllers/cart.controller');

const router = express.Router();

router
    .route('/')
    .get(authMiddlewares.auth(), validate(cartValidation.getCart), cartController.getCart);

router
    .route('/addProduct')
    .post(authMiddlewares.auth(), validate(cartValidation.addProductToCart), cartController.addProductToCart);
    
router
    .route('/removeProduct')
    .post(authMiddlewares.auth(), validate(cartValidation.removeProductFromCart), cartController.removeProductFromCart);


module.exports = router;