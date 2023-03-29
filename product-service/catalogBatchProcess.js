const { v4: uuidv4 } = require('uuid')
const db = require('./db')
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns')

module.exports.handler = async (event) => {
  const snsTopicArn = process.env.SNS_TOPIC_ARN

  const snsClient = new SNSClient({ region: 'us-east-1' })
  try {
    for (const record of event.Records) {
      const productData = JSON.parse(record.body)
      const productObj = { id: uuidv4(), ...productData }
      await db.put({
        TableName: process.env.PRODUCTS_TABLE,
        Item: productObj
      }).promise()
      
      const snsPublishCommand = new PublishCommand({
        TopicArn: snsTopicArn,
        Subject: 'ProductDB updated',
        Message: JSON.stringify(productData)
      })
      await snsClient.send(snsPublishCommand)
    }
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Create product failure', error: JSON.stringify(error) })
    }
  }
}
