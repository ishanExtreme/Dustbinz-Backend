const { join } = require('lodash');
const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcrypt');

/** Defining user schema
 * name-> user's name for website display
 * email-> user's email for identity verification, must be unique
 * password-> user's password
*/
const UserSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50
        },
        email: {
            type: String,
            unique: true,
            required: true,
            minlength: 5,
            maxlength: 255
        },
        password: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 1024 
        },
        googleId: {
            type: String,
            required: false
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        imageKey: {
            type: String,
            //TODO: remove hardcode
            default: 'UserImages/Default/icons8-male-user-96.png'
        }
});

// virtual property that returns url from the imageKey
UserSchema.virtual('ImageUrl').get(function() {
    return `https://dustbinz.s3.amazonaws.com/${this.imageKey}`;
});

/**
 *Method
 *generate signed jwt token
 *payload=> id and isVerfied
**/
UserSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        {_id: this._id, 
        isVerified: this.isVerified, 
        isAdmin: this.isAdmin,
        name:this.name,
        email:this.email,
        imageKey:this.imageKey}, 
        process.env.JWT_SECRET);
    
    return token;
    
}

/**
 * returns a promise
 * Compares the given password with original password
 */
UserSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
}

// User model
const User =  mongoose.model('User', UserSchema);
/**
 *Verifying the request before sending to database 
 *name , email, pass is required
 *email should be a valid one 
 */
const validateUser = (user)=>{

    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required(),
    });

    return schema.validate(user);
}

const validatePassword = (password)=>{

    const schema = Joi.object({
        currentPassword: Joi.string().min(5).max(1024).required(),
        password: Joi.string().min(5).max(1024).required(),
    });

    return schema.validate(password);
}

const validateName = (user)=>{
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
    });

    return schema.validate(user);
}


exports.User = User;
exports.validate = validateUser;
exports.validatePassword = validatePassword;
exports.validateUser = validateName;