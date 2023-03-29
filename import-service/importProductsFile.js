
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
module.exports.handler = async (event) => {
  const { name } = event.queryStringParameters;
  const bucket = process.env.BUCKET_NAME

  if (!name) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Required param 'name' is not found" })
    }
  }

  const s3Client = new S3Client({ region: 'us-east-1' });
  const uploadedKey = `uploaded/${name}`;
  const putCommand = new PutObjectCommand({ Bucket: bucket, Key: uploadedKey });
  try {
    const url = await getSignedUrl(s3Client, putCommand, { expiresIn: 3600 });
    return {
      statusCode: 200,
      body: JSON.stringify({ url })
    };

  } catch (error) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Failure occurred during creation signed url' })
    };
  }
}