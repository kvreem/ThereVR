const aws = require('aws-sdk');

// Configures AWS with proper keys
function awsConfig() {
  aws.config.update({
    accessKeyId: process.env.AWS_ACCESSID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });
}

module.exports = awsConfig;
