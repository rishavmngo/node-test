const auth = {}
const users = require('../models/users.model.js')
const jwt = require('../middleware/jwt.js')
const { loginSchema, registerSchema } = require('../models/users.schema.js')
const bcrypt = require('bcrypt')
const config = require('../config/config.js')

auth.login = async (req, res, next) => {
  const { email, password } = req.body

  //validation of data from request
  try {
    await loginSchema.validateAsync({ email, password })
  } catch (err) {
    return res.send(err.details[0].message)
  }

  try {
    const { data, error } = await users.getByEmail(email)
    if (!data) return res.status(error.code).send({ message: error.message })
    const isPasswordMatched = await bcrypt.compare(password, data.password)
    console.log(isPasswordMatched, data.password, password)
    if (!isPasswordMatched)
      return res.status(403).send({ message: 'wrong password' })
    const token = jwt.createAccessToken(data.uid)
    res.send(token)
  } catch (err) {
    console.log(err)
    return res.status(400).send(err)
  }
}

auth.register = async (req, res) => {
  const { email, password, name } = req.body
  let hashedPassword

  //validate request
  try {
    await registerSchema.validateAsync(req.body)
  } catch (err) {
    console.log(err)
    return res.send(err.details[0].message)
  }
  try {
    const { data: isUserExist } = await users.getByEmail(email)

    if (!!isUserExist) return res.status(409).send('Email already exist')

    try {
      hashedPassword = await bcrypt.hash(password, config.bcryptSaltRounds)
    } catch (err) {
      console.log('from bcrypt', err)
      return res.status(500).send({ message: 'internal server error' })
    }

    const { data: user } = await users.addUser(name, email, hashedPassword)

    user.accessToken = jwt.createAccessToken(user.uid)
    console.log(user)
    res.send(user)
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: 'Internal server error' })
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
    res.redirect('http://localhost:3001')
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: 'Internal server error' })
  }
}

module.exports = auth
