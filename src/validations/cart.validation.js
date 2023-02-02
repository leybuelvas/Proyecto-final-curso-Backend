const Joi = require('joi');
const { objectId, password } = require('./custom.validation');

const getCart = {
    params: Joi.object().keys({
        cartId: Joi.string().custom(objectId),
    }),
};

const addProductToCart = {
    body: Joi.object()
        .keys({
            product: Joi.required().custom(objectId),
            amount: Joi.number()
        })
        .max(2),
};

const removeProductFromCart = {
    body: Joi.object()
        .keys({
            product: Joi.required().custom(objectId),
            amount: Joi.number()
        })
        .max(2),
}

module.exports = {
    getCart,
    addProductToCart,
    removeProductFromCart
};