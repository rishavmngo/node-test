const express = require('express')
const auth = require('../controllers/auth.controller.js')
const passport = require('passport')

const router = express.Router()
const googleAuth = require('./auth_google.route.js')

router.post('/login', auth.login)

router.post('/register', auth.register)

router.use('/google', googleAuth)

router.get('/logout', (req, res) => {
  // req.logout()
  res.clearCookie('connect.sid')
  res.clearCookie('passport')
  res.clearCookie('__Host-GAPS')
  res.redirect('http://localhost:3001')
})
module.exports = router
