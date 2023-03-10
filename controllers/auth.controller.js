const auth = {}
const users = require('../models/users.model.js')
const jwt = require('../middleware/jwt.js')
const { loginSchema, registerSchema } = require('../models/users.schema.js')
const bcrypt = require('bcrypt')
const config = require('../config/config.js')

auth.login = async (req, res) => {
  const { email, password } = req.body

  //validation of data from request
  try {
    await loginSchema.validateAsync({ email, password })
  } catch (err) {
    return res.send({ error: true, message: err.details[0].message })
  }

  try {
    const { data, error } = await users.getByEmail(email)
    console.log(data)
    if (!data)
      return res
        .status(error.code)
        .send({ error: true, message: error.message })
    const isPasswordMatched = await bcrypt.compare(password, data.password)
    if (!isPasswordMatched)
      return res.status(403).send({ error: true, message: 'wrong password' })
    const token = jwt.createAccessToken(data.uid)
    res.send({ error: false, data: token })
  } catch (err) {
    return res.status(400).send({ error: true, message: err })
  }
}

auth.register = async (req, res) => {
  const { email, password, name } = req.body
  let hashedPassword

  //validate request
  try {
    await registerSchema.validateAsync(req.body)
  } catch (err) {
    return res.send({ error: true, message: err.details[0].message })
  }
  try {
    const { data: isUserExist } = await users.getByEmail(email)

    if (!!isUserExist)
      return res
        .status(409)
        .send({ error: true, message: 'Email already exist' })

    try {
      hashedPassword = await bcrypt.hash(password, config.bcryptSaltRounds)
    } catch (err) {
      return res
        .status(500)
        .send({ error: true, message: 'internal server error' })
    }

    const { data: user } = await users.addUser(name, email, hashedPassword)

    user.accessToken = jwt.createAccessToken(user.uid)
    res.send({ error: false, data: user })
  } catch (err) {
    console.error(err)
    res.status(500).send({ error: true, message: 'Internal server error' })
  }
}

auth.google = async (req, res) => {
  const { name, email } = req.user._json

  try {
    const { data: user } = await users.getByEmail(email)

    if (!user) {
      const { data } = await users.addUser(name, email)
      user.uid = data.uid
    }
    user.accessToken = jwt.createAccessToken(user.uid)

    res.cookie('cookieName', user, { maxAge: 900000, httpOnly: false })
    res.redirect(config.clientAddress)
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: 'Internal server error' })
  }
}

module.exports = auth
