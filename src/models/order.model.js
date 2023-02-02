const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const Cart = require('./cart.model');
const autoIncrement = require('mongoose-auto-increment');

productInOrderSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        price: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: false,
        }
    },
    {}
)

orderCartSchema = mongoose.Schema(
    {
        product: productInOrderSchema,
        amount: {
            type: Number,
            required: true
        }
    },
    {}
);

const orderSchema = mongoose.Schema(
    {
        cart: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Cart',
            required: true,
        },
        number: {
            type: Number,
        },
        state: {
            type: String,
            default: 'Sent'
        },
        userEmail: {
            type: String,
        },
        products: {
            type: [orderCartSchema]
        }
    },
    {
        timestamps: true
    }
);

orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

/**
 * Check if name is taken
 */
orderSchema.statics.isNameTaken = async function (name, excludeOrderId) {
    const order = await this.findOne({ name, _id: { $ne: excludeOrderId } });
    return !!order;
};

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;

autoIncrement.initialize(mongoose.connection);
orderSchema.plugin(autoIncrement.plugin, {
    model: 'Order',
    field: 'number',
    startAt: 1,
    incrementBy: 1
});

