'use strict'

const dynamoInstance = require('./db')
module.exports.handler = async (event, context) => {
  console.info('EVENT\n' + JSON.stringify(event, null, 2))
  console.log(context.logStreamName)
  try {
    const products = await dynamoInstance.scan({ TableName: process.env.PRODUCTS_TABLE }).promise()
    const productsResponse = []
    for (let i = 0; i < products.Items.length; i++) {
      const stock = await dynamoInstance.get({
        TableName: process.env.STOCKS_TABLE,
        Key: {
          product_id: products.Items[i].id
        }
      }).promise()

      productsResponse.push({
        ...products.Items[i],
        count: stock.Item?.count || 0
      })
    }
    return {
      statusCode: 200,
      body: JSON.stringify(productsResponse)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: error
    }
  }
}
