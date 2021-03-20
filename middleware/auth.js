// Middle ware to protect routes, so that only authenticated users can access
// it
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) =>{
    const token = req.header('x-auth-token');
    // 401-> Unauthorized
    if(!token) return res.status(401).send({error:'Access Denied. No token provided'});

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        
        // 400-> Bad Request
        res.status(400).send({error:'Invalid Token'});
    }
}
