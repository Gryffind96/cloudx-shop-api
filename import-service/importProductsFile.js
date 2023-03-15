
const AWS = require('aws-sdk')
const s3 = new AWS.S3({ region: 'us-east-1' });
module.exports.handler = async (event) => {
  const { name } = event.queryStringParameters;
  const bucket = process.env.BUCKET_NAME

  const params = {
    Bucket: bucket,
    Key: `uploaded/${name}`,
    Expires: 3600,
    ContentType: 'text/csv'
  }

  try {
    const url = await s3.getSignedUrlPromise('putObject', params)
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: `${name}`,
          url,
        }
      )
    }

  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify('An error has occurred: \t ' + error?.message),
    };
  }
}