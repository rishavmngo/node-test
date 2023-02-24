const db = require('./connection.js')
const { response, error } = require('../utils/utils.js')
const d = require('../debug/debug.js')

const users = {}

users.addUser = async (name, email, password) => {
  d('reached')
  const q = `INSERT INTO users(displayname,email,password) VALUES($1,$2,$3) returning *`

  try {
    const result = await db.query(q, [name, email, password])
    return response(result.rows[0], null)
  } catch (err) {
    return response(null, err.detail)
  }
}

users.getByEmail = async (email) => {
  const q = `SELECT * FROM users where email=$1`

  try {
    const result = await db.query(q, [email])
    if (result.rows.length > 0) return response(result.rows[0], null)
    else return response(null, new error('User not found', 404))
  } catch (err) {
    console.log('error', err)
    return response(null, err)
  }
}

module.exports = users
