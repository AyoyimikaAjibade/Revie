/**
 * @file This file defines the User schema, creates method, middlewares,
 * instances available on the User model
 *  functions and expprts it as a model
 * @author Ayoyimika <ajibadeayoyimika@gmail.com> <16/03/2021 10:02pm>
 * @since 0.1.0
 * Last Modified: Ayoyimika <ajibadeayoyimika@gmail.com> <30/12/2020 10:02pm>
 */

const crypto = require('crypto');

// mongodb framework
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

/**
 * @param {Object} User - Schema that will be used to create the User collection
 * @param {String} User.name - The name of the User
 * @param {String} User.email - The email of the User
 * @param {String} User.role - The role of the User
 * @param {String} User.password - The password of the User
 * @param {String} User.passwordConfirm - The password confirm of the User
 * @param {String} User.photo - The profile picture of the User
 */

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A User writing a review must have a name!'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'A User writing a review must have an email addresse!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email!'],
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'guestUser'],
    default: 'user',
    message: 'The role of user is either an admin, user or a guest user',
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
    validate: {
      //Works only on CREATE or SAVE and not UPDATING
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  photo: {
    type: String,
    default:
      'https://f0.pngfuel.com/png/340/956/profile-user-icon-png-clip-art-thumbnail.png',
  },
});

/**
 * DOCUMENT MIDDLEWARES
 * middleware that can act on the currently processed documents or run a function upon certain event
 * that deals directly with the document e.g before saving or after saving the particular
 * documents NOTE: this documents middleware runs only on .save() and .create() and not .insertMany()
 * 'this' refers to the currently processed documents
 */
UserSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // hash the password with a cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //Delete password confirm fields
  this.passwordConfirm = undefined;
  next();
});

UserSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.password = Date.now() - 1000;
  next();
});

/**
 * INSTANCES METHOD
 * Creating an instances method is a method that will be available
 *  on all document in a collection
 */
UserSchema.methods.correctPassword = async function (
  candidatePassword,
  UserPassword
) {
  return await bcrypt.compare(candidatePassword, UserPassword);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
