const csvParser = require('csv-parser');
const {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} = require('@aws-sdk/client-s3')
const { Readable } = require('stream')
const client = new S3Client({ region: 'us-east-1' })
module.exports.handler = async (event) => {
  try {
    event.Records.forEach(async (record) => {
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: record.s3.object.key,
      }
      const command = new GetObjectCommand(params)
      const res = await client.send(command)

      return new Promise((resolve, reject) => {
        if (!(res.Body instanceof Readable)) {
          throw new Error('Stream is not readable')
        }

        res.Body.pipe(csvParser())
          .on('data', (data) => console.log('DATA:', data))
          .on('error', (error) => reject(error))
          .on('end', async () => {
            console.log('successfully parsed')

            await client.send(
              new CopyObjectCommand({
                Bucket: process.env.BUCKET_NAME,
                CopySource: `${process.env.BUCKET_NAME}/${record.s3.object.key}`,
                Key: record.s3.object.key.replace('uploaded', 'parsed'),
              }),
            )
            console.log('copied successfully')

            await client.send(
              new DeleteObjectCommand({
                Bucket: process.env.BUCKET_NAME,
                Key: record.s3.object.key,
              }),
            )
            console.log('deleted successfully')

            resolve()
          })
      })
    })

    return {
      statusCode: 202,
      body: JSON.stringify({
        message: 'File parsed!',
      }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message,
      }),
    }
  }
}