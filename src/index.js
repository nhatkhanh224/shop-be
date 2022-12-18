const express = require('express')
const path = require('path');
const route = require("./routes");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const dbSetup = require('./config/db/db-setup')
dbSetup();
const app = express()
const port = 3000
app.set('views', path.join(__dirname, 'resources/views'));
app.set('layout', 'layouts/layout');
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static( path.join(__dirname, './public/admin')))
app.use(express.static( path.join(__dirname, './public/images')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port} at http://localhost:${port}/`)
})