const express = require('express');
const bodyParser = require('body-parser');
const swagger = require('./swagger');
const app = express();

swagger(app)

//Configuració
app.set('port', 3000);
app.set('json spaces', 2)
app.set('view engine', 'jade')
app.use(bodyParser.json());

/* GET home page. */
app.get('/', (req, res) => {
    res.render('index', { title: 'Express' });
});
  
module.exports = app;