const express = require('express')
const passport = require('passport')
const auth = require('../controllers/auth.controller.js')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const router = express.Router()
passport.use(
  new GoogleStrategy(
    {
      clientID:
        '503989483804-he67tbihquhja53s8mg50tt8ng7radai.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/auth/google/success',
      // passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      done(null, profile)
    }
  )
)

router.get(
  '/',
  passport.authenticate('google', { scope: ['email', 'profile'] })
)

router.get(
  '/success',
  passport.authenticate('google', {
    session: false,
  }),
  auth.google
)

module.exports = router
