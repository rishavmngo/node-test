const jwt = require('jsonwebtoken')
const token = {}

token.createAccessToken = (uid) => {
  return jwt.sign({ id: uid }, 'rishavraj')
}

module.exports = token
