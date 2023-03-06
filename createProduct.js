
const dynamoInstance = require('./db')
const { v4: uuidv4 } = require('uuid');

module.exports.handler = async (event) => {
  try {
    // TODO: VALIDATE PRODUCT JSON SCHEMA
    const productData = JSON.parse(event.body);
    const productDTO = {id: uuidv4(),...productData}
    const product = await dynamoInstance.put({ 
      TableName: process.env.PRODUCTS_TABLE,
      Item: productDTO
    }).promise();

    return product;
  } catch (error) {
    throw Error(error)
  }
};