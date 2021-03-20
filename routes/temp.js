const express = require('express');
const router = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const bucketName = 'dustbinz';

const storage = multer.memoryStorage({
    destination: function(req, file, cb) {
        cb(null, '');
    }
})

const upload = multer({storage}).single('image');

const s3 = new AWS.S3({
    accessKeyId: "ASIAZEKUZJIEDWYN7BXM",
    secretAccessKey: "jzb8Ncg/3RXgxCI2wy91VfoTo7b/hG6yEaKL1lHG",
    sessionToken: "FwoGZXIvYXdzEND//////////wEaDPQHii15CC47IxSXtiLJAXcgPbeB+N3dfSqXZXd/T+zjnYKMlYk53pOyi4F4BOyF4LpNjOKP4CIM6Hq/8v0/JZG2rPtTQhEf9mwuUzexp5OGe3N9sCoPUQIeCvlg27q8QLwCUk9ODgWIdqFcjNBxI2gNRCosiSDIlGNP5tNzhUNPf1jmLsts5jGtHPFqKOolTPUSlKfae+T03R0clY5Ida33eZDwjW2m3DNkuI2Iy6yDHLITkTeMA/L3gA+7pafKPNGfxer8lZM3D4i6sqNvvFhgDxJr6hv1Eyjp/ruCBjItPWusYv3QWVpCrZve8YSpJ1YorARrprlfGKWbsPf7GFp1AskRDCZyr5PSepRK"
});

router.post('/', upload ,async (req, res)=> {

    let file = req.file.originalname.split(".");
    const fileType = file[file.length - 1];

    const params = {
        Bucket: bucketName,
        Key: `${uuidv4()}.${fileType}`,
        Body: req.file.buffer,
        ACL: "public-read"
    };

    s3.upload(params, (error, data)=>{
        if(error){
            res.status(500).send(error);
        }
        res.status(200).send(data);
    })
})



module.exports = router;