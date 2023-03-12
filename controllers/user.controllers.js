user = {}
const users = require('../models/users.model.js')

user.getById = async (req, res) => {
  const uid = req.id

  if (!uid)
    return res.status(400).json({ error: true, message: 'Not Authorized' })

  try {
    const { error, data } = await users.getById(uid)

    if (error) return res.send({ error: true, message: error.message })
    const { password, ...user } = data
    res.send({ error: false, data: user })
  } catch (error) {
    console.log(error)
    res.status(400).send({ error: true, message: 'internal server error' })
  }
}

module.exports = user
