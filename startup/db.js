const mongoose = require('mongoose');
require('dotenv').config();
const logger = require('../middleware/logger');

module.exports = ()=>{
    let db;
    if(process.env.NODE_ENV == 'test')  db = process.env.DB_URL_TEST;
    else  db = process.env.DB_URL;
    mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(()=> logger.info(`Connected to ${db}`))
        .catch(()=> logger.error('Error connecting to mongodb'))
}