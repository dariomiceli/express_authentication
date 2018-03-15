const
  mongoose = require('mongoose'),
  userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
  })

const User = mongoose.model('User', userSchema)