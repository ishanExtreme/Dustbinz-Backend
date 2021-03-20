const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const _ = require('lodash');
const Joi = require('joi');
const passport = require('passport');

router.post('/', async (req, res)=> {

    const {error} = validate(req.body);
    if(error) return res.status(400).send({error:error.details[0].message});

    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send({error:"Invalid Email or Password"});

    const validPassword = await user.validatePassword(req.body.password);
    if(!validPassword) return res.status(400).send({error:"Invalid Email or Password"});

    const token = user.generateAuthToken();
    res.send({token:token});
})

// google
router.get('/google/redirect', 
passport.authenticate('google', { session: false }), 
(req, res)=>{
    // take out ip of the app
    const redirect = redirectUrl.substring(redirectUrl.indexOf('/')+1);
    // Bad request on creating database
    if(req.error) res.status(500).redirect(`exp://${redirect}?error=Something Failed`)
    const token = req.user.generateAuthToken();
    // console.log(`exp://${redirect}`);
    res.redirect(`exp://${redirect}?token=${token}`);
})

const validate = (req)=>{

    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required(),
    });

    return schema.validate(req);
}

module.exports = router;