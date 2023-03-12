const jwt = require('jsonwebtoken')
const config = require('../config/config')
const token = {}

token.createAccessToken = (uid) => {
  return jwt.sign({ id: uid }, config.jwtSecret)
}

token.verify = (req, res, next) => {
  const header = req.header('Authorization')
  const token = header && header.split(' ')[1]

  // if (!token) {
  //   req.id = null
  //   next()
  // }

  if (!token) return res.send({ error: true, message: 'token not provided' })

  try {
    const { id } = jwt.verify(token, config.jwtSecret)
    req.id = id
  } catch (error) {
    req.id = null
  }
  next()
}

module.exports = token
