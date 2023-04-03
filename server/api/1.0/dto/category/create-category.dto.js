const Joi = require('joi')

const createCategoryDto = Joi.object({
  name: Joi.string().min(3).max(64).required().messages({
    'string.base': `Kategori ismi metin tipinde olmalıdır.`,
    'string.empty': `Kategori ismi boş bırakılamaz.`,
    'string.min': `Kategori ismi en az {#limit} karakter uzunluğunda olmalıdır.`,
    'string.max': `Kategori ismi en fazla {#limit} karakter uzunluğunda olmalıdır.`,
    'any.required': `Kategori ismi zorunludur.`,
  }),
  icon: Joi.string(),
  color: Joi.string(),
  image: Joi.string().default(''),
})
  .min(1)
  .messages({
    'object.min': `En az bir kategori özelliği belirtilmelidir.`,
  })

module.exports = createCategoryDto
