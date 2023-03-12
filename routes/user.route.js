const express = require('express')
const user = require('../controllers/user.controllers.js')
const { verify } = require('../middleware/jwt.js')

const router = express.Router()

router.get('/getById', verify, user.getById)

module.exports = router
