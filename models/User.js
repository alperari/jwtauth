const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');

// Check out validation basics https://mongoosejs.com/docs/validation.html

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
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
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
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    const isMatched = await bcrypt.compare(password, user.password);
    if (isMatched) {
      return user;
    } else {
      // Wrong password
      throw Error('Wrong password!');
    }
  } else {
    // Email is not registered
    throw Error('There is no such registered user!');
  }
};

const User = mongoose.model('user', userSchema);

module.exports = User;
