
const { v4: uuidv4 } = require('uuid');
const dynamoInstance = require('./db')
const validate = require('./utils/validate')
const schema = require('./schemas/product.schema')
module.exports.handler = async (event) => {
  try {
    const productInfo = JSON.parse(event.body);
    const validateResult = validate(schema, productInfo);
    if (validateResult.errors) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: JSON.stringify(validation.errors) })
      }
    }
    const productObj = {id: uuidv4(),...productInfo}
    const product = await dynamoInstance.put({ 
      TableName: process.env.PRODUCTS_TABLE,
      Item: productObj
    }).promise();

    return product;
  } catch (error) {
    throw Error(error)
  }
};