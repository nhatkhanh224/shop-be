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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port} at http://localhost:${port}/`)
})