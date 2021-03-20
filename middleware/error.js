const logger = require('./logger');

module.exports = (err, req, res, next)=>{
    // Log Exception
    logger.error(err.message, err);
    const redirect = redirectUrl.substring(redirectUrl.indexOf('/')+1);
    res.set({
        error:"Something Failed, Try again later"
    })
    return res.status(500).redirect(`exp://${redirect}?error=Something Failed, Try again later`); 
}