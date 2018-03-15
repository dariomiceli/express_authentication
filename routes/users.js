const
  express = require('express'),
  usersRouter = new express.Router(),
  passport = require('passport')

usersRouter.get('/login', (req, res) => {
  res.render('login', {message: req.flash('passwordMessage')})
})

usersRouter.post('/login', passport.authenticate('local-login', {
  successRedirect: '/users/profile',
  failureRedirect: '/users/login'
}))

usersRouter.get('/signup', (req, res) => {
  res.render('signup', {message: req.flash('creationMessage')})
})

usersRouter.post('/signup', passport.authenticate('local-signup', {     // local strategy is doing all this work...
  successRedirect: '/users/profile',
  failureRedirect: '/users/signup'
}))

usersRouter.get('/profile', isLoggedIn, (req, res) => {     // uses isLoggedIn function to see if user is logged in
  res.render('profile', {user: req.user, message: req.flash('welcomeMessage')})
})

usersRouter.get('/logout', (req, res) => {                  // delete cookie and redirect when logging out
  req.logout()
  res.redirect('/')
})

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) return next()
  res.redirect('/users/login')
}

module.exports = usersRouter