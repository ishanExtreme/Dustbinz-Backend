<h1 align="center">
  Dustbinz-Backend
</h1>

### Basic Idea:
This repo contains the code for the backend of dustbinz APP, this whole backend is API based, these API's are called at frontend side.

### [Frontend Repo](https://github.com/ishanExtreme/DustBinz-App-Frontend)

### Hosting:
Node server is hosted on heroku. Link is [here](https://dustbinz-backend.herokuapp.com/)

### Running the code:
Code is already hosted at [heroku](https://dustbinz-backend.herokuapp.com/), and can be tested using postman(say), to run on local system, start node server by *npm start*,  following enviroment variables must be declared in *.env* file at the root directory:

* PORT //Port Number
* DB_URL //mongodb URL
* DB_URL_TEST //For test files
* JWT_SECRET //Secret Key
* NODE_ENV = development
* LOG_KEY //logDNA -> optional
* CLIENT_ID_GOOGLE //OAUth
* CLIENT_SECRET_GOOGLE //OAuth
* BUCKET_NAME //AWS s3 bucket name
* REGION // AWS region
* AWS_ACCESS_KEY_ID //AWS access key
* AWS_SECRET_ACCESS_KEY //AWS secert key

### Overview of some Tech stack/Frameworks/Libraries used:

* Node.js
* express
* Google Cloud: For OAuth
* MongoDB database
* mongoose
* aws-sdk: for managing S3 buckets
* Aws S3 storage
* jest: for testing purpose
* passport: for OAuth(only google OAuth is implemented at this time)
* winston: for logging purposes
* logdna: for logging errors and crash reports

### Testing:
To run tests run the following command *npm run test*

* [auth.test.js](https://github.com/ishanExtreme/Dustbinz-Backend/blob/main/tests/integration/auth.test.js): Tests [auth](https://github.com/ishanExtreme/Dustbinz-Backend/blob/main/middleware/auth.js) middleware
* [bins.test.js](https://github.com/ishanExtreme/Dustbinz-Backend/blob/main/tests/integration/bins.test.js): Tests [bins](https://github.com/ishanExtreme/Dustbinz-Backend/blob/main/routes/bins.js) route
* [user.test.js](https://github.com/ishanExtreme/Dustbinz-Backend/blob/main/tests/unit/models/user.test.js): Tests generated auth token

### API Referece:

### Route [users](https://github.com/ishanExtreme/Dustbinz-Backend/blob/main/routes/users.js)
* **POST**: "/users/" *Registers a new user* <br> req.body: {"name", "email", "password"} <br> response: generated JWT auth token, 400: bad request
* **GET**: "users/google/*" *Google OAuth* <br> req.params: redirecting url
* **PUT**: "users/change-pass" *Change the password of signed in user* **User must be authenticated to use this route** <br> req.body: {"currentPassword"} <br> response: 200: OK, 400: Bad Request
* **PUT**: "users/update/" *Updates user fieilds*  **User must be authenticated to use this route** <br> req.body: {"name", "email"} <br> response: generated auth token, 400: bad requuest

### Route [auth](https://github.com/ishanExtreme/Dustbinz-Backend/blob/main/routes/auth.js)
* **POST**: "/auth/" *Logging in existing user* <br> req.body:{"email", "password"} <br> response: auth token, 400: bad request
* **GET**: "/auth/google/redirect" *Google OAuth sign in* <br> response: generated auth token, 400: bad request

### Route [uploads](https://github.com/ishanExtreme/Dustbinz-Backend/blob/main/routes/upload.js)
* **POST**: "/uploads/user-image" *Uploads user profile image to S3 bucket* **User must be authenticated to use this route** <br> req.file: image data <br> response: auth token, 400: bad request

### Route [bins](https://github.com/ishanExtreme/Dustbinz-Backend/blob/main/routes/bins.js)
* **POST**: "/bins/" *Uploads bin data to databse* **User must be authenticated to use this route** <br> **Under Development...**

  


