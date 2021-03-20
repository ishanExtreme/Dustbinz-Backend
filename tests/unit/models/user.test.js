const {User} = require('../../../models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const mongoose = require('mongoose');

describe('user.generateAuthToken', ()=>{
    it('should return a valid json web token', ()=>{
        const payload = {_id: new mongoose.Types.ObjectId().toHexString(), 
            isAdmin:true, isVerified:true}
        const user = new User(payload);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        expect(decoded).toMatchObject(payload)
    })
})