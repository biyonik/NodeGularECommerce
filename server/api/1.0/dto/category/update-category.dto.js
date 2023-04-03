const Joi = require('joi')

const updateCategoryDto = Joi.object({
  name: Joi.string().min(3).max(64).required().messages({
    'string.base': `Kategori ismi metin tipinde olmalıdır.`,
    'string.empty': `Kategori ismi boş bırakılamaz.`,
    'string.min': `Kategori ismi en az {#limit} karakter uzunluğunda olmalıdır.`,
    'string.max': `Kategori ismi en fazla {#limit} karakter uzunluğunda olmalıdır.`,
    'any.required': `Kategori ismi zorunludur.`,
  }),
  icon: Joi.string().optional().allow(''),
  color: Joi.string().optional().allow(''),
  image: Joi.string().optional().allow(''),
})
  .min(1)
  .messages({
    'object.min': `En az bir alan güncellenmelidir.`,
  })

module.exports = updateCategoryDto
