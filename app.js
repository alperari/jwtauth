require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

const PORT = process.env['PORT'] | 3000;

app.listen(PORT);
console.log('listening on port:', PORT);

app.get('/', (req, res) => {
  return res.json('OK');
});
