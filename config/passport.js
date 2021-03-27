const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
require('dotenv').config();
const {User} = require('../models/user');
var generator = require('generate-password');
const bcrypt = require('bcrypt');

passport.use(new GoogleStrategy({
    // options for startegy
    callbackURL:'https://tender-dragonfly-32.loca.lt/api/auth/google/redirect',
    clientID: process.env.CLIENT_ID_GOOGLE,
    clientSecret: process.env.CLIENT_SECRET_GOOGLE

},async (accessToken, refreshToken, profile, done)=>{
    // passport callback function
    try {
        
        let user = await User.findOne({googleId: profile.id})
        if(user) return done(null, user);
    } catch (error) {
        return done(error, false)
    }
    
    try {
        
        const password = generator.generate({
            length: 10,
            numbers: true
        })
        user = new User({
            name: profile.name.givenName,
            email: profile.emails[0].value,
            googleId: profile.id,
            password: password
        });
        const salt = await bcrypt.genSalt(10);
        user.password =  await bcrypt.hash(user.password, salt);
        await user.save();
        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
})
)
