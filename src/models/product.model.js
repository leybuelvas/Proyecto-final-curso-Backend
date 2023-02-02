const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const productSchema = mongoose.Schema(
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
);

// add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

/**
 * Check if name is taken
 */
productSchema.statics.isNameTaken = async function (name, excludeProductId) {
  const product = await this.findOne({ name, _id: { $ne: excludeProductId } });
  return !!product;
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
