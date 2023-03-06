'use strict';

const dynamoInstance = require('./db')
module.exports.handler = async (event) => {
  const response = await dynamoInstance.scan({ TableName: process.env.PRODUCTS_TABLE }).promise();
  return response.Items;
};