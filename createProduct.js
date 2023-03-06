
const dynamoInstance = require('./db')
const { v4: uuidv4 } = require('uuid');
const validate = require('./utils/validate')
const schema = require('./schemas/product.schema')
module.exports.handler = async (event,context) => {
  console.info("EVENT\n" + JSON.stringify(event, null, 2))
  console.log(context.logStreamName)
  try {
    const {count, ...productInfo} = JSON.parse(event.body);
    const validateResult = validate(schema, productInfo);
    if (validateResult.errors) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: JSON.stringify(validation.errors) })
      }
    }
    const productObj = {id: uuidv4(),...productInfo}
    await dynamoInstance.put({ 
      TableName: process.env.PRODUCTS_TABLE,
      Item: productObj
    }).promise();
    return {
      statusCode: 201,
      body: JSON.stringify(productObj)
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({message: error.message})
    };
  }
};