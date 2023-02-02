const express = require('express');
const authMiddlewares = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const userValidation = require('../validations/user.validation');
const userController = require('../controllers/user.controller');

const router = express.Router();

router
  .route('/')
  .post(authMiddlewares.auth(), validate(userValidation.createUser), userController.createUser)
  .get(authMiddlewares.auth(), validate(userValidation.getUsers), userController.getUsers);

router
  .route('/:userId')
  .get(authMiddlewares.auth(), validate(userValidation.getUser), userController.getUser)
  .patch(authMiddlewares.auth(), validate(userValidation.updateUser), userController.updateUser)
  .delete(authMiddlewares.auth(), validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;
