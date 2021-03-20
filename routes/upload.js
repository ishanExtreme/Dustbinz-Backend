const express = require('express');
const router = express.Router();
const multer = require('multer');
const { S3Client, PutObjectCommand,
    DeleteObjectCommand } = require("@aws-sdk/client-s3");
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const {User} = require('../models/user');

const bucketName = process.env.BUCKET_NAME;
const Region = process.env.REGION;
//TODO: configuring bucket cors to limit upload size
// and file type

// storing buffer in memory
const storage = multer.memoryStorage({
    destination: function(req, file, cb) {
        cb(null, '');
    }
})

// middleware, provides file in request object
const upload = multer({storage}).single('image');

// s3 config
const s3 = new S3Client({region: Region});

/**
 * Upload user image
 * delete prevvious image if found
 * Method-> post
 * auth required
 */
router.post('/user-image', auth, upload ,async (req, res)=> {
    console.log("in");
    // Bad Request
    if(!req.file) return res.status(400).send({error: 'Image not selected'});
    console.log(req.file);
    // get Image extension
    let file = req.file.originalname.split(".");
    const fileType = file[file.length - 1];
    const key = `UserImages/${uuidv4()}.${fileType}`;
    const params = {
        Bucket: bucketName,
        // generate image name
        Key: key,
        Body: req.file.buffer,
        ACL: "public-read"
    };

    const data = await s3.send(new PutObjectCommand(params));
    let user = await User.findById(req.user._id);

    if(data.$metadata.httpStatusCode === 200){

        // if default image is present as user image
        if(user.imageKey === 'UserImages/Default/icons8-male-user-96.png')
            user = await User.findByIdAndUpdate(req.user._id, 
                {imageKey: key}, {new: true});
        // if image already uploaded bu user, delete previous image and update with new
        else{
            const delParams = {
                Bucket: bucketName,
                Key: user.imageKey
            }
            await s3.send(new DeleteObjectCommand(delParams));
            
            user = await User.findByIdAndUpdate(req.user._id, 
                {imageKey: key}, {new: true});
            
           
        }
        const token = user.generateAuthToken();
        return res.send({token:token});
    } 
    else return res.status(data.$metadata.httpStatusCode).send({error: 'Error in uploading image, try again later'}); 

});



module.exports = router;