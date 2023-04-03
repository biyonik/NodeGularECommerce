const { Schema, model } = require('mongoose')
const { variantSchema } = require('./variant.schema')

const productSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  richDescription: {
    type: String,
    default: '',
  },
  images: [
    {
      type: Schema.Types.ObjectId,
      ref: 'ProductImage',
    },
  ],
  mainImage: {
    type: Schema.Types.ObjectId,
    ref: 'ProductImage',
  },
  brand: {
    type: Schema.Types.ObjectId,
    ref: 'Brand',
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  price: {
    type: Number,
    default: 0.0,
    min: 0.0,
  },
  variants: {
    type: [variantSchema],
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
})

const Product = model('Product', productSchema)

module.exports = Product
