'use strict'

const dynamoInstance = require('./db')
module.exports.handler = async (event, context) => {
  console.info('EVENT\n' + JSON.stringify(event, null, 2))
  console.log(context.logStreamName)
  const { productId } = event.pathParameters
  try {
    const product = await dynamoInstance.get({
      TableName: process.env.PRODUCTS_TABLE,
      Key: {
        id: productId
      }
    }).promise()
    if (!product.Item) {
      throw new Error('Product not found')
    }
    return {
      statusCode: 200,
      body: JSON.stringify(product.Item)
    }
  } catch (error) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: error.message })
    }
  }
}
