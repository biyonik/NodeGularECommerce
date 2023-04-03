const asyncHandler = require('express-async-handler')
const Product = require('../schemas/product.schema')
const { StatusCodes } = require('http-status-codes')

const create = asyncHandler(async (requestObject, responseObject) => {})

const update = asyncHandler(async (requestObject, responseObject) => {})

const remove = asyncHandler(async (requestObject, responseObject) => {})

const getAll = asyncHandler(async (requestObject, responseObject) => {
  const products = await Product.find()
  if (products.length < 1 || !products) {
    return responseObject.status(StatusCodes.NOT_FOUND).json({
      message: 'Any products not found',
      count: 0,
    })
  }
  return responseObject.status(StatusCodes.OK).json({
    message: 'Products',
    rows: [...products],
    count: 10,
  })
})

const getById = asyncHandler(async (requestObject, responseObject) => {
  const product = await Product.findById(requestObject.params.id)
  if (!product) {
    return responseObject.status(StatusCodes.NOT_FOUND).json({
      message: 'Product not found',
    })
  }
  return responseObject.status(StatusCodes.OK).json({
    message: 'Product',
    row: {},
  })
})

module.exports = {
  create,
  update,
  remove,
  getAll,
  getById,
}
