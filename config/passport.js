const
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy
    User = require('../models/User.js')

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, thatUser) => {
        done(err, thatUser)
    })
})

passport.use('local-signup', new LocalStrategy({                        // the following executes when "sign-up" button is pressed
    usernameField: 'email',                                             // tell passport email and password field names in our DB
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({ email: email}, (err, user) => {                      // makes sure email is unique, check to see if it already exists
        if(err) return done(err)
        if(user) return done(null, false, req.flash('creationMessage', "user already exists")) // return false value to prevent creation of new account with non-uniqueness

        if(!req.body.name || !req.body.password) return done(null, false, req.flash('signupMessage', "All fields required!"))

        var newUser = new User()
        newUser.name = req.body.name
        newUser.email = req.body.email
        newUser.password = newUser.generateHash(req.body.password)      // encrypt password
        newUser.save((err, savedUser) => {
            return done(null, newUser, req.flash('loginMessage', "account created"))
        })
    })                                         
}))

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',                                             // map field to schema
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({ email: email }, (err, user) =>{                                                                      // find user with email provided
        if(err) return done(err)                                                                                        // if error, return done w/ error (allows us to console.log)
        if(!user) return done(null, false, req.flash('loginMessage', "email not found"))                                // if 'user' if falsey, there is no user with that email
        if(!user.validPassword(req.body.password)) return done(null,false, req.flash('passwordMessage', "wrong password")) // if passowrd is wrong
        return done(null, user, req.flash('welcomeMessage', "welcome back!"))                                                                                         // if they make it passed the above filters, they are who they say they are, return user
    })                               
}))

module.exports = passport
