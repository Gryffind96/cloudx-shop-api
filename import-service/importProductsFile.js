
const AWS = require('aws-sdk')
const s3 = new AWS.S3({ region: 'us-east-1' });
module.exports.handler = async (event) => {
  const { name } = event.queryStringParameters;
  const bucket = process.env.BUCKET_NAME

  const params = {
    Bucket: bucket,
    Key: `uploaded/${name}.csv`,
    Expires: 60,
  }

  try {
    const url = await s3.getSignedUrlPromise('getObject', params)
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          url,
        }
      )
    }

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify('An error has occurred: \t ' + error?.message),
    };
  }
}