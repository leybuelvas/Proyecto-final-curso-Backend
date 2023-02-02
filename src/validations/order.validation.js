const Joi = require('joi');
const { objectId, password } = require('./custom.validation');

const confirmOrder = {
    body: Joi.object()
        .keys({})
};

const getOrders = {
    query: Joi.object().keys({
        name: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer()
    })
}

module.exports = {
    confirmOrder,
    getOrders
};