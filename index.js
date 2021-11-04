const express = require('express');
const app = express();

const getPosition = require('./geolocation')

const position = getPosition()
console.log(position)

app.use(express.static('public'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('index', position)
})


const hostname = '127.0.0.1';
const port = 4010;
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});