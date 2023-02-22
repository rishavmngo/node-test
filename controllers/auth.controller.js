const auth = {}
const users = require('../models/users.model.js')
const jwt = require('../middleware/jwt.js')
const { loginSchema, registerSchema } = require('../models/users.schema.js')

auth.login = async (req, res) => {
  const { email, password } = req.body

  //validation of data from request
  try {
    await loginSchema.validateAsync({ email, password })
  } catch (err) {
    return res.send(err.details[0].message)
  }

  try {
    const { data } = await users.getByEmail(email)
    if (!data) return res.status(404).send({ message: "User doesn't exist" })
    if (data.password !== password)
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

    const { data: user } = await users.addUser(name, email, password)

    //user exist or not
    if (!user) return res.send('error occured while creating user')
    data.accessToken = jwt.createAccessToken(user.uid)
    res.send(user)
  } catch (err) {
    res.send(err)
  }
}

module.exports = auth
