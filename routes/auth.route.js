const express = require('express')
const auth = require('../controllers/auth.controller.js')

const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy

const router = express.Router()

router.post('/login', auth.login)

router.post('/register', auth.register)

passport.use(
  new GoogleStrategy(
    {
      clientID:
        '503989483804-he67tbihquhja53s8mg50tt8ng7radai.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/auth/google/success',
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      console.log(profile, 'reached 2')
      done(null, profile)
    }
  )
)
// passport.serializeUser((user, done) => done(null, user))
// passport.deserializeUser((user, done) => done(null, user))

router.get(
  '/google/success',
  passport.authenticate('google', {
    session: false,
  }),
  (req, res) => {
    // Fetch JWT from req.user
    // req.logout((err) => {
    //   console.log(err)
    // })
    // res.redirect('/')
    res.send('hello google')
  }
)

router.get('/google/logout', (req, res) => {
  // req.logout()
  console.log(req.logout)
  req.passport()
  res.redirect('/')
  // res.redirect('/')
})

router.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
)

module.exports = router
