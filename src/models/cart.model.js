const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const Product = require('./product.model');

const cartProductsSchema = mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Product',
            required: true,
        },
        amount: {
            type: Number,
            default: 0
        }
    },
    {}
);

const cartSchema = mongoose.Schema(
    {
        products: {
            type: [cartProductsSchema],
            default: []
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        email: {
            type: String
        },
        deliveryAddress: {
            type: String
        },
        datetimeConfirmed: {
            type: Date
        }
    },
    {}
);

// add plugin that converts mongoose to json
cartSchema.plugin(toJSON);
// productSchema.plugin(paginate);

/**
 * Check if cart is already created for the user
 */
cartSchema.statics.isAlreadyCreated = async function (user) {
    const cart = await this.findOne({ user: user._doc._id });
    return !!cart;
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
