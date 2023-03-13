
const { S3 } = require('aws-sdk')

// TODO: Implement its logic so it will be expecting a request with a name of CSV file with products 
// and creating a new Signed URL with the following key: uploaded/${fileName}
module.exports.handler = async (event) => {
  const {name} = event.queryStringParameters;
  return {
    statusCode: 200,
    body: 'Hello world'
  }
}