// Starting point of the application
const express = require('express');
require('express-async-errors');
require('dotenv').config();
const logger = require('./middleware/logger');
const app = express();
const passportSetup = require('./config/passport');
const passport = require('passport');

// logging setup 
require('./startup/logging')();
// DB setup
require('./startup/db')();
//--------------OAuth----------------
app.use(passport.initialize());

// routes setup
require('./startup/routes')(app);

const port = process.env.PORT
const server = app.listen(port , ()=>{
    logger.info(`Listening to port ${port}...`);
});

module.exports = server;
