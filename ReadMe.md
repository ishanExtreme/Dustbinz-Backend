# Hosted At-> https://dustbinz-backend.herokuapp.com/

# To run _npm start_

# Test Files _npm run test_

# Deployed Version is having problem with S3 bucket and google OAuth

# To test locally following enviroment variable must be set in .env file

PORT //Port Number
DB_URL //mongodb URL
DB_URL_TEST //For test files
JWT_SECRET //Secret Key
NODE_ENV = development
LOG_KEY //logDNA -> optional
CLIENT_ID_GOOGLE //OAUth
CLIENT_SECRET_GOOGLE //OAuth
BUCKET_NAME //AWS s3 bucket name
REGION // AWS region
AWS_ACCESS_KEY_ID //AWS access key
AWS_SECRET_ACCESS_KEY //AWS secert key
CALLBACK_GOOGLE// Callback url(note->use localtunnel for example)
