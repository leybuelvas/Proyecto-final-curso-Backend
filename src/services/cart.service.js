const httpStatus = require('http-status');
const { Cart } = require('../models');
const ApiError = require('../utils/ApiError');
const productService = require('./product.service');

/**
 * Create a cart
 * @param {Object} user
 * @returns {Promise<Cart>}
 */
const createCart = async (user) => {
    if (await Cart.isAlreadyCreated(user)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Cart already created');
    }
    return Cart.create({ products: [], user: user._doc._id });
};

/**
 * Query for carts
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCarts = async (filter, options) => {
    const carts = await Cart.paginate(filter, options);
    return carts;
};

/**
 * Get cart by id
 * @param {ObjectId} id
 * @returns {Promise<Cart>}
 */
const getCartById = async (id) => {
    return Cart.findById(id);
};

/**
 * Get cart by userId
 * @param {string} user
 * @returns {Promise<Cart>}
 */
const getCartByUser = async (user) => {
    return Cart.findOne({ user: user._doc._id });
};

const getCurrentUnconfirmedCartByUser = async (user) => {
    return Cart.findOne({ user: user._doc._id, datetimeConfirmed: null })
}

/**
 * Update cart by id
 * @param {ObjectId} cartId
 * @param {Object} updateBody
 * @returns {Promise<Cart>}
 */
const updateCartById = async (cartId, updateBody) => {
    const cart = await getCartById(cartId);
    if (!cart) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
    }
    Object.assign(cart, updateBody);
    await cart.save();
    return cart;
};

/**
 * Delete cart by id
 * @param {ObjectId} cartId
 * @returns {Promise<Cart>}
 */
const deleteCartById = async (cartId) => {
    const cart = await getCartById(cartId);
    if (!cart) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
    }
    await cart.remove();
    return cart;
};

/**
 * Add product to cart
 * @param {ObjectId} userId
 * @param {ObjectId} productId
 * @param {Number} amount
 * @returns {Promise<Cart>}
 */
const addProductToCart = async (user, productId, amount) => {
    const _product = await productService.getProductById(productId);
    if (!_product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    let cart = await Cart.findOne({ user: user._doc._id, datetimeConfirmed: null });
    if (!cart) {
        cart = await createCart(user)
    }
    alreadyExists = cart.products.find(item => item.product == productId);
    if (alreadyExists) {
        alreadyExists.amount += amount;
    } else {
        cart.products.push({
            product: _product._doc._id,
            amount: amount
        });
    }
    await cart.save();
    return cart;
}

/**
 * Remove product from cart
 * @param {ObjectId} userId
 * @param {ObjectId} productId
 * @param {Number} amount
 * @returns {Promise<Cart>}
 */
const removeProductFromCart = async (user, productId, amount) => {
    const _product = await productService.getProductById(productId);
    if (!_product) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    const cart = await Cart.findOne({ user: user._doc._id, datetimeConfirmed: null });
    if (!cart) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
    }
    alreadyExists = cart.products.find(item => item.product._id == productId);
    if (alreadyExists) {
        if (alreadyExists.amount >= amount) {
            alreadyExists.amount -= amount;
        } else {
            throw new ApiError(httpStatus.BAD_REQUEST, "Amount is bigger than cart's amount");
        }
    } else {
        throw new ApiError(httpStatus.NOT_FOUND, 'Product is not in cart');
    }
    await cart.save();
    return cart;
}

confirmCart = async (user) => {
    const cart = await Cart.findOne({ user: user._doc._id, datetimeConfirmed: null });
    if (!cart) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Cart not found');
    }
    Object.assign(cart, { datetimeConfirmed: new Date() });
    await cart.save();
    return cart;
}

module.exports = {
    createCart,
    queryCarts,
    getCartById,
    getCartByUser,
    updateCartById,
    deleteCartById,
    addProductToCart,
    removeProductFromCart,
    confirmCart,
    getCurrentUnconfirmedCartByUser
};
