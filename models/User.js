const mongoose = require('mongoose');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide email!'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please provide a valid email!'],
  },
  password: {
    type: String,
    required: [true, 'Please provide password!'],
    minLength: [6, 'Password length cannot be less than 6!'],
  },
});

const User = mongoose.model('user', userSchema);

module.exports = User;
