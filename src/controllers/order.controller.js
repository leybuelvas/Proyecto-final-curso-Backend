const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { orderService, cartService } = require('../services');

const confirmOrder = catchAsync(async (req, res) => {
    const cart = await cartService.getCurrentUnconfirmedCartByUser(req.user);
    if (!cart) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Cart not found');
    }
    const order = await orderService.confirmOrder(req.user, cart);
    res.status(httpStatus.CREATED).send(order);
});

const getOrders = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['name']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await orderService.queryOrders(filter, options);
    res.send(result);
  });

module.exports = {
    confirmOrder,
    getOrders
};
