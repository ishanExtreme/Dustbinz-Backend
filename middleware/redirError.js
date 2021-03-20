module.exports = (err, req, res, next)=>{
    // Redirect to app
    if(redirectUrl)
    {
        const redirect = redirectUrl.substring(redirectUrl.indexOf('/')+1);
        return res.status(500).redirect(`exp://${redirect}?error=Something Failed`); 
    }
    return res.status(500);
}