const asyncHandler = require('express-async-handler')
const { StatusCodes } = require('http-status-codes')
const createBrandDto = require('../dto/brand/create-brand.dto')
const updateBrandDto = require('../dto/brand/update-brand.dto')
const Brand = require('../schemas/brand.schema')

/**
 * @description Create a new brand
 * @route POST /api/1.0/brands
 * @access Private
 * @param requestObject
 * @param responseObject
 * @returns {Promise<*>}
 * @throws {Error}
 * @throws {ValidationError}
 * @throws {CastError}
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
const create = asyncHandler(async (requestObject, responseObject) => {
  try {
    const { error, value } = createBrandDto.validate(requestObject.body)
    if (error) {
      responseObject.status(StatusCodes.BAD_REQUEST).json({ message: error.details[0].message })
      throw new Error('Invalid brand data')
    }
    const brand = new Brand(value)
    await brand.save()
    responseObject.status(StatusCodes.CREATED).json({ message: 'Brand created', data: brand })
  } catch (err) {
    responseObject.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: err.message,
    })
    throw new Error('Invalid brand data')
  }
})

/**
 * @description Update a brand
 * @route PUT /api/1.0/brands/:id
 * @access Private
 * @param requestObject
 * @param responseObject
 * @returns {Promise<*>}
 * @throws {Error}
 * @throws {ValidationError}
 * @throws {CastError}
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
const update = asyncHandler(async (requestObject, responseObject) => {
  try {
    const { id } = requestObject.params
    const brand = await Brand.findById(id)
    if (!brand) {
      return responseObject.status(StatusCodes.NOT_FOUND).json({ message: 'Brand not found' })
    }

    const validationOptions = { abortEarly: false, allowUnknown: true }
    const { error, value } = updateBrandDto.validate(requestObject.body, validationOptions)
    if (error) {
      return responseObject.status(StatusCodes.BAD_REQUEST).json({ message: error.details.map((err) => err.message) })
    }

    const updatedBrand = await Brand.findByIdAndUpdate(id, value, { new: true })
    return responseObject.status(StatusCodes.OK).json({ message: 'Brand updated', data: updatedBrand })
  } catch (err) {
    responseObject.status(StatusCodes.BAD_REQUEST).json({ message: err.message })
    throw new Error('Invalid brand data')
  }
})

/**
 * @description Delete a brand
 * @route DELETE /api/1.0/brands/:id
 * @access Private
 * @param requestObject
 * @param responseObject
 * @returns {Promise<*>}
 * @throws {Error}
 * @throws {ValidationError}
 * @throws {CastError}
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
const remove = asyncHandler(async (requestObject, responseObject) => {
  try {
    const { id } = requestObject.params
    const brand = Brand.findById(id)
    if (!brand) {
      return responseObject.status(StatusCodes.NOT_FOUND).json({ message: 'Brand not found' })
    }
    await Brand.findByIdAndDelete(id)
    return responseObject
      .status(StatusCodes.OK)
      .json({ message: 'Brand deleted', operation: 'Remove', status: 'Success' })
  } catch (error) {
    responseObject.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
    throw new Error('Invalid brand data')
  }
})

/**
 * @description Get all brands
 * @route GET /api/1.0/brands
 * @access Private
 * @param requestObject
 * @param responseObject
 * @returns {Promise<*>}
 * @throws {Error}
 * @throws {CastError}
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
const getAll = asyncHandler(async (requestObject, responseObject) => {
  try {
    const brands = await Brand.find().populate('products', 'id name')
    if (brands.length < 1 || !brands) {
      return responseObject.status(StatusCodes.NOT_FOUND).json({ message: 'Any brands not found', count: 0 })
    }

    const brandsDto = brands.map((brand) => {
      const productsDto = brand.products.map((product) => ({
        id: product.id,
        name: product.name,
      }))

      return {
        id: brand.id,
        name: brand.name,
        products: productsDto,
      }
    })

    const totalCount = brandsDto.length

    return responseObject.status(StatusCodes.OK).json({ message: 'Brands fetched', rows: brandsDto, count: totalCount })
  } catch (error) {
    responseObject.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
    throw new Error('Invalid brand data')
  }
})

/**
 * @description Get a brand by id
 * @route GET /api/1.0/brands/:id
 * @access Private
 * @param requestObject
 * @param responseObject
 * @returns {Promise<*>}
 * @throws {Error}
 * @throws {CastError}
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
const getById = asyncHandler(async (requestObject, responseObject) => {
  try {
    const { id } = requestObject.params
    const brand = await Brand.findById(id).populate('products', 'id name')
    if (!brand) {
      return responseObject.status(StatusCodes.NOT_FOUND).json({ message: 'Brand not found' })
    }

    const productsDto = brand.products.map((product) => ({
      id: product.id,
      name: product.name,
    }))

    const brandDto = {
      id: brand.id,
      name: brand.name,
      products: productsDto,
    }

    return responseObject.status(StatusCodes.OK).json({ message: 'Brand fetched', data: brandDto })
  } catch (error) {
    responseObject.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
    throw new Error('Invalid brand data')
  }
})

module.exports = {
  create,
  update,
  remove,
  getAll,
  getById,
}
