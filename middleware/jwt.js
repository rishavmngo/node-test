const jwt = require('jsonwebtoken')
const config = require('../config/config')
const token = {}

token.createAccessToken = (uid) => {
  return jwt.sign({ id: uid }, config.jwtSecret)
}

module.exports = token
