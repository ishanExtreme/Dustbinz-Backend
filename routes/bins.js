const express = require('express');
const router = express.Router();
const {Bin, validate} = require('../models/bin');
const _ = require('lodash');
const auth = require('../middleware/auth');
const { User } = require('../models/user');

/**
 * Post type
 * only authenticated users allowed
 * Creates a new bin collection
 */
router.post('/', auth, async (req, res)=>{

    const {error} = validate(req.body);
    // Bad Request error by JOI
    if(error) return res.status(400).send({error:error.details[0].message});
    
    const bin = new Bin(_.pick(req.body, ['name', 'latitude', 'longitude', 'rating']))

    const user = await User.findById(req.user._id);
    bin.contributor = user;

    user.binsRef.push(bin);
    user.binsProp.push({
        name: bin.name,
        isAccepted: bin.isAccepted
    });

    await Promise.all([user.save(), bin.save()]);

    return res.send("Success");
});


module.exports = router;