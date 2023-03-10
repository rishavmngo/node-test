const express = require('express')
const user = require('../controllers/user.controllers.js')

const router = express.Router()

router.post('/getById', user.getById)

module.exports = router
