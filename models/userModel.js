const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user writing a review must have a name!'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'A user writing a review must have an email addresse!'],
    unique: true,
    lowercase: true,
    // validate: [validator.isEmail, 'Please provide a valid email!'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your  password'],
    minLength: 8,
    // validate: {
    //   //Works only on CREATE or SAVE and not UPDATING
    //   validator: function (el) {
    //     return el === this.password;
    //   },
    //   message: 'Passwords are not the same!',
    // },
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
