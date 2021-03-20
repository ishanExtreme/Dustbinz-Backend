const winston = require('winston');
require('dotenv').config();
const logdnaWinston = require('logdna-winston');

const logger = winston.createLogger({
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      //
      // - Write all logs with level `error` and below to `error.log`
      // - Write all logs with level `info` and below to `combined.log`
      //
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });

//   logging to console for development enviroment
if(process.env.NODE_ENV!='production')
    logger.add(new winston.transports.Console({
        format: winston.format.colorize(),
}));

// logdna options
const options = {
    hostname:'DustBinz-App',
    app: 'Dustbinz',
    indexMeta: true,
    level:'error',
    key: process.env.LOG_KEY,
}
options.handleExceptions = true;

// logging to logdna for production enviroment
if(process.env.NODE_ENV=='production')
    logger.add(new logdnaWinston(options));



module.exports = logger;