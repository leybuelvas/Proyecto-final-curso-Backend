const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const productRoute = require('./product.route');
const cartRoute = require('./cart.route');
const orderRoute = require('./order.route');
const config = require('../config/config');
const authMiddlewares = require('../middlewares/auth');

const router = express.Router();

const apiRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/products',
    route: productRoute
  },
  {
    path: '/cart',
    route: cartRoute
  },
  {
    path: '/order',
    route: orderRoute
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

router.get('/', authMiddlewares.auth(), (req, res, next) => {
  res.redirect('/api/products');
});

apiRoutes.forEach((route) => {
  router.use('/api' + route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
