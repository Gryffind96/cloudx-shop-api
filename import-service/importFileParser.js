let csvParser = require('csv-parser')
const AWS = require('aws-sdk')
module.exports.handler = async (event) => {
  try {
    const s3 = new AWS.S3({ region: 'us-east-1' })
    const records = event.Records;
    const recordsLength = records.length;
    console.log('Import file parser lambda was triggered with records: ', records);
    const BUCKET = process.env.BUCKET_NAME
    if (recordsLength === 0) {
      console.log('No records to process')
      throw new Error();
    }
    for (const record of records) {
      console.log(`Processing Record: ${record.s3.object.key}...`)
      const params = {
        Bucket: BUCKET,
        Key: record.s3.object.key,
      }

      const s3Stream = s3
        .getObject(params)
        .createReadStream()

      s3Stream
        .pipe(csvParser())
        .on('data', (data) => {
          console.log(data)
        })
        .on('end', async () => {
          console.log(`Copy from ${BUCKET}/${record.s3.object.key}`)
          await s3
            .copyObject({
              Bucket: BUCKET,
              CopySource: `${BUCKET}/${record.s3.object.key}`,
              Key: record.s3.object.key.replace('uploaded', 'parsed')
            })
            .promise()
          console.log(
            `Copied into ${BUCKET}/${record.s3.object.key.replace(
              'uploaded',
              'parsed'
            )}`
          )

          await s3.deleteObject(params)
          console.log('object deleted successfully')
        })
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