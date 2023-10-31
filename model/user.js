const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  otp:{
    type:String
  },
  profileImage: String,
  instagramLink: String,
  linkedinLink: String,
  facebookLink: String
});

const User = mongoose.model('users', userSchema);

module.exports = User;
