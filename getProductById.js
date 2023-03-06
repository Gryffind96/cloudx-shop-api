'use strict';

const dynamoInstance = require('./db')
module.exports.handler = async (event) => {
  const { productId } = event.pathParameters;
  try {
    const product = await dynamoInstance.get({ 
      TableName: process.env.PRODUCTS_TABLE,
      Key: {
        id: productId
      }
    }).promise();
    if (!product.Item) throw Error('Product not found');
    return product.Item;
  } catch (error) {
    throw Error(error)
  }
};