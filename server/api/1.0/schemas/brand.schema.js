const { Schema, model } = require('mongoose')

const brandSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    versionKey: false,
  }
)

const Brand = model('Brand', brandSchema)
module.exports = Brand
