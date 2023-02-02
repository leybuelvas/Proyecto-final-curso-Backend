const httpStatus = require('http-status');
const { Order } = require('../models');
const ApiError = require('../utils/ApiError');
const { cartService, productService } = require('.');

/**
 * Confirm an order
 * @param {Object} user
 * @param {Object} cart
 * @returns {Promise<Order>}
 */
const confirmOrder = async (user, cart) => {
    let orderProducts = [];
    for (let item of cart.products) {
        const product = await productService.getProductById(item.product);
        if (!product) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Could not retrieve all products');
        } else {
            const orderProduct = {
                product: {
                    name: product.name,
                    price: product.price,
                    description: product.description
                },
                amount: item.amount
            }
            debugger;
            orderProducts.push(orderProduct);
        }
    }
    const _order = {
        cart: cart._doc._id,
        userEmail: user._doc.email,
        products: orderProducts
    }
    const order = await Order.create(_order);
    if (order) {
        await cartService.confirmCart(user);
    } else {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Order could not be created');
    }
    return order;
};

/**
 * Query for orders
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryOrders = async (filter, options) => {
    const orders = await Order.paginate(filter, options);
    return orders;
};

module.exports = {
    confirmOrder,
    queryOrders
};
