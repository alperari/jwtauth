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

// Static methods
userSchema.static.login = async function (email, password) {
  const user = await this.findOne({ email: email });

  if (user) {
    const isMatched = bcrypt.compare(email, user.email);

    if (isMatched) {
      return user;
    } else {
      // Wrong password
      // TODO
    }
  } else {
    // Email is not registered
    // TODO
  }
};

const User = mongoose.model('user', userSchema);

module.exports = User;
