const { Schema, model } = require('mongoose')

const productImageSchema = Schema({
  url: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    default: 100,
  },
  height: {
    type: Number,
    default: 100,
  },
  alt: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
  isMain: {
    type: Boolean,
    default: false,
  },
})

productImageSchema.methods.setAsMainImage = async function () {
  this.isMain = true
  await this.save()

  const otherImages = await this.model('ProductImage').find({
    _id: { $ne: this._id },
    product: this.product,
  })

  for (let i = 0; i < otherImages.length; i++) {
    otherImages[i].isMain = false
    await otherImages[i].save()
  }

  await this.model('Product').findByIdAndUpdate(this.product, { mainImage: this._id })
}

const ProductImage = model('ProductImage', productImageSchema)
module.exports = ProductImage
