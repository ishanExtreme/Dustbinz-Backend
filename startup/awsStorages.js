const AWS = require('aws-sdk');
require('dotenv').config();

const bucketName = 'dustbinz';
const createBucket = async ()=>{
    const s3Bucket = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    const params = {
        Bucket: bucketName,
        CreateBucketConfiguration: {
            LocationConstraint: 'us-east-1'
        }
    };

    s3Bucket.createBucket(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else console.log('Bucket Created Successfully', data.Location);
    });
}

createBucket();