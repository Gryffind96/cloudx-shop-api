const { GetObjectCommand, S3Client, CopyObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs')
const csv = require('csv-parser')

module.exports.handler = async (event) => {
  const queueUrl = process.env.QUEUE_URL
  const s3Bucket = process.env.BUCKET_NAME;
  const s3Client = new S3Client({ region: 'us-east-1' });
  const sqsClient = new SQSClient({ region: 'us-east-1' })
  try {
    for await (const record of event.Records) {
      const getObjectCommand = new GetObjectCommand({
        Bucket: s3Bucket,
        Key: record.s3.object.key
      });

      const response = await s3Client.send(getObjectCommand);
      const productsData = await new Promise((resolve, reject) => {
        const resultData = [];
        response.Body
          .pipe(csv())
          .on('data', (data) => {
            resultData.push(data);
          })
          .on('end', () => {
            console.log('csv parsed successfully', resultData);
            console.log(`Copy from ${BUCKET}/${record.s3.object.key}`)

            const copyObjectCmd = new CopyObjectCommand({
              Bucket: s3Bucket,
              CopySource: `${s3Bucket}/${record.s3.object.key}`,
              Key: record.s3.object.key.replace('uploaded', 'parsed')
            })

            await client.send(copyObjectCmd);
            console.log('importFileParser moved csv to parsed location');

            const deleteCmd = new DeleteObjectCommand({
              Bucket: s3Bucket,
              Key: record.s3.object.key
            })
            await client.send(deleteCmd);
            console.log('importFileParser deleted from uploaded location');
            resolve(resultData)
          })
          .on('error', (err) => {
            reject(err);
          });
      });
      const sendMessage = new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(productsData),
      });
      const response = await sqsClient.send(sendMessage);
      console.log('SQS response', response)
      return {
        statusCode: 200,
      };
    }
  } catch (error) {
    console.log('ERROR', error)
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Failure occurred during processing data' })
    };
  }
}