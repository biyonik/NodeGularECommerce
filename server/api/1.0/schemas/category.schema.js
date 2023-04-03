const { Schema, model } = require('mongoose')

const categorySchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
    },
    color: {
      type: String,
    },
    image: {
      type: String,
      default: '',
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

categorySchema.pre('save', function (next) {
  if (!this.color || this.color.trim() === '') {
    this.color = '#' + Math.floor(Math.random() * 16777259).toString(16)
  }
  next()
})

const Category = model('Category', categorySchema)
module.exports = Category
