
const { S3 } = require('aws-sdk')

module.exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: 'Hello world'
  }
}