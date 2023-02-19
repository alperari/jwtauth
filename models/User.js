const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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

// Hooks
userSchema.pre('save', async function (next) {
  console.log('saving user:', this.email);

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.post('save', function (doc, next) {
  console.log('saved user:', doc.email);
  next();
});

const User = mongoose.model('user', userSchema);

module.exports = User;
