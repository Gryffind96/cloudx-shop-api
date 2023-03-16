const {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} = require('@aws-sdk/client-s3')
const { Readable } = require('stream')
const client = new S3Client({ region: 'us-east-1' })
const csv = require('csv-parser')
module.exports.handler = async (event) => {
  try {
    const records = event.Records;
    const recordsLength = records.length;
    console.log('Import file parser lambda was triggered with records: ', records);

    if (recordsLength === 0) {
      throw new Error();
    }

    const asyncRecords = records.map(async (record, index) => {
      const RECORD_INFO = `[RECORD ${index + 1} of ${recordsLength}]`;
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: record.s3.object.key,
      }

      const streamBody = (
        await s3Client.send(
          new GetObjectCommand(params)
        )
      ).Body;

      if (!(streamBody instanceof Readable)) {
        throw new Error(`${RECORD_INFO} is not readable stream`);
      }
      return new Promise((resolve, reject) => {
        streamBody
          .pipe(csv())
          .on('data', (data) => {
            console.log(RECORD_INFO, `Parsing product import CSV data: `, data);
          })
          .on('error', (error) => {
            console.error(RECORD_INFO, `Parsing error for product import CSV data: `, error);
            reject(new Error(`${RECORD_INFO} error processing the file`));
          })
          .on('end', async () => {
            console.log(
              RECORD_INFO,
              `Product data parsed. Moving to "/parsed" folder has started.`
            );
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

            console.log(RECORD_INFO, 'Uploaded record deleted successfully!');
            resolve('ok')
          });
      })
    })

    await Promise.all(asyncRecords);

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