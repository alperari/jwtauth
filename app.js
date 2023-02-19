require('dotenv').config();

const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const PORT = process.env['PORT'] | 3000;
const MONGO_URI = process.env['MONGO_URI'];

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    app.listen(PORT);
    console.log('mongoose connected succesfully');
    console.log('listening on port:', PORT);

    // Base
    app.get('/', (req, res) => {
      res.render('home', {
        title: 'Home Page',
      });
    });

    // Routes Here
    const authRouter = require('./routes/auth-routes');

    app.use(authRouter);
  })
  .catch((error) => {
    console.log(error);
    console.log('mongoose connection failed');
  });
