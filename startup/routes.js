const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');
const uploads = require('../routes/upload');
const express = require('express');

module.exports = (app)=>{
    app.use(express.json());
    // routes
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use('/api/uploads', uploads)
    app.use(error);
}
