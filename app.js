require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.use(express.static('public'));
app.set('view engine', 'ejs');

const PORT = process.env['PORT'] | 3000;
const MONGO_URI = process.env['MONGO_URI'];

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    app.listen(PORT);
    console.log('mongoose connected succesfully.');
    console.log('listening on port:', PORT);

    app.get('/', (req, res) => {
      return res.json('OK');
    });
  })
  .catch((error) => {
    console.log(error);
  });
