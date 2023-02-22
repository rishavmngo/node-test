const joi = require('joi')

const schema = {}

schema.loginSchema = joi.object({
  email: joi.string().required(),
  password: joi.string().required().min(8),
})

schema.registerSchema = joi.object({
  email: joi.string().required(),
  password: joi.string().required().min(8),
  name: joi.string().required(),
})

module.exports = schema
