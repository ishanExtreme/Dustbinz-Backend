const express = require('express');
const router = express.Router();
const {User, 
    validate, 
    validatePassword, 
    validateUser} = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const passport = require('passport');
global.redirectUrl = '';

/**
 * Register User
 * JOI validation-> check for email in databse-> save the new user-> 
 * generate jwt-token->send token to the client
 */
router.post('/', async (req, res)=> {


    const {error} = validate(req.body);
    // Bad Request error by JOI
    if(error) return res.status(400).send({error:error.details[0].message});

    let user = await User.findOne({email: req.body.email});
    // Bad Request email already in database
    if(user) return res.status(400).send({error:"User already registered"});

    user = new User(_.pick(req.body, ['name', 'email', 'password']));

    // hash the password
    const salt = await bcrypt.genSalt(10);
    user.password =  await bcrypt.hash(user.password, salt);

    await user.save();

    // generate auth-token
    const token = user.generateAuthToken();
    // Send the generated token to the client
    res.send({token:token});
});
// google
router.get('/google/*',
    (req, res, next)=>{
        redirectUrl = req.params[0];
        next();
    },
    passport.authenticate('google',{
    scope:[
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
    ]
},{ session: false }));

// router.get('/google', (req, res)=>{
//     res.send("Hello");
// })


/**
 * Get Current user's data
 * User must be logged in
 */
router.get('/me', auth ,async (req, res)=> {

    // exclude password from user model
    const user = await User.findById(req.user._id).select('-password');
    // send user model
    res.send(user);
});

/**
 * Update Password
 * Takes the current and new password if current matches
 * the original password, changes the password to new one
 */
router.put('/change-pass', auth, async(req, res)=> {
    
    const {error} = validatePassword(req.body);

    // Bad Request error by JOI
    if(error) return res.status(400).send({error:error.details[0].message});

    // get the user
    const user = await User.findById(req.user._id);
    // validate password
    const validPassword = await user.validatePassword(req.body.currentPassword);
    // check new password equals to old one
    const samePassword = await user.validatePassword(req.body.password);
    // Current password doesnot matches new password bad request
    if(!validPassword) return res.status(400).send({error:"Invalid Current Password"});

    // Old and new passwords are same bad request
    if(samePassword) return res.status(400).send({error:"New Password must be different from the current one"});
    // update the password
    user.password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    user.password =  await bcrypt.hash(user.password, salt);
    await user.save();
    // 200 ok
    return res.status(200).send("Success");
});

/**
 * Update the user properties
 */
router.put('/update', auth, async (req, res)=>{
    
    const {error} = validateUser(req.body);

    // Bad Request error by JOI
    if(error) return res.status(400).send({error:error.details[0].message});

    // ********ToDo: add image***********
    const user = await User.findByIdAndUpdate(req.user._id, 
        {name: req.body.name, email: req.body.email},
        {new: true});

    const token = user.generateAuthToken();
    return res.send({token:token});
});



module.exports = router;