const { Schema, model } = require('mongoose')

const variantSchema = new Schema({
  optionName: {
    type: String,
    required: true,
  },
  optionValue: {
    type: String,
    required: true,
  },
  priceModifier: {
    type: Number,
    default: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
    default: 0,
  },
})

const Variant = model('Variant', variantSchema)

module.exports = {
  variantSchema,
  Variant,
}
