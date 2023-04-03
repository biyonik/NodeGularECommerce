const Joi = require('joi')

const updateBrandDto = Joi.object({
  name: Joi.string().min(3).max(64).required().messages({
    'string.base': `Marka ismi metin tipinde olmalıdır.`,
    'string.empty': `Marka ismi boş bırakılamaz.`,
    'string.min': `Marka ismi en az {#limit} karakter uzunluğunda olmalıdır.`,
    'string.max': `Marka ismi en fazla {#limit} karakter uzunluğunda olmalıdır.`,
    'any.required': `Marka ismi zorunludur.`,
  }),
})
  .min(1)
  .messages({
    'object.min': `En az bir alan güncellenmelidir.`,
  })

module.exports = updateBrandDto
