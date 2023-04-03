const asyncHandler = require('express-async-handler')
const { StatusCodes } = require('http-status-codes')
const Category = require('../schemas/category.schema')
const createCategoryDto = require('../dto/category/create-category.dto')
const updateCategoryDto = require('../dto/category/update-category.dto')

/**
 * @description Create a new category
 * @param requestObject
 * @param responseObject
 * @returns {Promise<*>}
 * @constructor
 * @access private
 * @route POST /api/1.0/categories
 * @throws {Error}
 * @throws {ValidationError}
 * @throws {CastError}
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
const create = asyncHandler(async (requestObject, responseObject) => {
  try {
    const { error, value } = await createCategoryDto.validate(requestObject.body)
    if (error) {
      responseObject.status(StatusCodes.BAD_REQUEST).json({ message: error.details[0].message })
      throw new Error('Invalid category data')
    }
    const category = new Category(value)
    await category.save()
    responseObject.status(StatusCodes.CREATED).json({ message: 'Category created', data: category })
  } catch (err) {
    responseObject.status(StatusCodes.BAD_REQUEST).json({ message: err.message })
    throw new Error('Invalid category data')
  }
})

/**
 * @description Update a category by id
 * @param requestObject
 * @param responseObject
 * @returns {Promise<*>}
 * @access private
 * @route PUT /api/1.0/categories/:id
 * @constructor
 * @throws {Error}
 * @throws {ValidationError}
 * @throws {CastError}
 * @throws {DocumentNotFoundError}
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
const update = asyncHandler(async (requestObject, responseObject) => {
  try {
    const { id } = requestObject.params
    const category = await Category.findById(id)
    if (!category) {
      return responseObject.status(StatusCodes.NOT_FOUND).json({ message: 'Category not found' })
    }

    const validationOptions = { abortEarly: false, allowUnknown: true }
    const { error, value } = updateCategoryDto.validate(requestObject.body, validationOptions)
    if (error) {
      return responseObject.status(StatusCodes.BAD_REQUEST).json({ message: error.details.map((err) => err.message) })
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, value, { new: true })
    return responseObject.status(StatusCodes.OK).json({ message: 'Category updated', data: updatedCategory })
  } catch (err) {
    responseObject.status(StatusCodes.BAD_REQUEST).json({ message: err.message })
    throw new Error('Invalid category data')
  }
})

/**
 * @description Delete a category by id
 * @param requestObject
 * @param responseObject
 * @returns {Promise<*>}
 * @access private
 * @route DELETE /api/1.0/categories/:id
 * @constructor
 * @throws {Error}
 * @throws {ValidationError}
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
const remove = asyncHandler(async (requestObject, responseObject) => {
  try {
    const { id } = requestObject.params
    const category = await Category.findById(id)
    if (!category) {
      return responseObject.status(StatusCodes.NOT_FOUND).json({ message: 'Category not found' })
    }
    await Category.findByIdAndDelete(id)
    return responseObject.status(StatusCodes.OK).json({ message: 'Category deleted' })
  } catch (error) {
    responseObject.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
    throw new Error('Invalid category data')
  }
})

/**
 * @Description Get all categories with products id and name
 * @param requestObject
 * @param responseObject
 * @returns {Promise<*>}
 * @access private
 * @route GET /api/1.0/categories
 * @constructor
 * @throws {Error}
 * @throws {ValidationError}
 * @throws {CastError}
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
const getAll = asyncHandler(async (requestObject, responseObject) => {
  try {
    const categories = await Category.find().populate('products', 'id name')
    if (categories.length < 1 || !categories) {
      return responseObject.status(StatusCodes.NOT_FOUND).json({ message: 'Any categories not found', count: 0 })
    }

    const categoriesDto = categories.map((category) => {
      const productsDto = category.products.map((product) => ({
        id: product.id,
        name: product.name,
      }))

      return {
        id: category.id,
        name: category.name,
        icon: category.icon,
        color: category.color,
        image: category.image,
        products: productsDto,
      }
    })

    const totalCount = categoriesDto.length

    return responseObject
      .status(StatusCodes.OK)
      .json({ message: 'Categories fetched', rows: categoriesDto, count: totalCount })
  } catch (error) {
    console.error(error)
    return responseObject.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' })
  }
})

/**
 * @description Get a category by id with products id and name
 * @param requestObject
 * @param responseObject
 * @returns {Promise<*>}
 * @access private
 * @route GET /api/1.0/categories/:id
 * @constructor
 * @throws {Error}
 * @throws {ValidationError}
 * @throws {CastError}
 * @throws {DocumentNotFoundError}
 * @type {*|express.RequestHandler<core.ParamsDictionary, any, any, core.Query>}
 */
const getById = asyncHandler(async (requestObject, responseObject) => {
  try {
    const category = await Category.findById(requestObject.params.id).populate('products')

    if (!category) {
      return responseObject.status(StatusCodes.NOT_FOUND).json({ message: 'Category not found' })
    }

    const categoryDto = {
      id: category.id,
      name: category.name,
      icon: category.icon,
      color: category.color,
      image: category.image,
      products: category.products.map((product) => ({
        id: product.id,
        name: product.name,
      })),
    }

    return responseObject.status(StatusCodes.OK).json({ message: 'Category fetched', data: categoryDto })
  } catch (error) {
    console.error(error)
    return responseObject.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' })
  }
})

module.exports = {
  create,
  update,
  remove,
  getAll,
  getById,
}
