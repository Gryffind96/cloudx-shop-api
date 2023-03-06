'use strict';

const { products } = require("./products");
const dynamoInstance = require('./db')
module.exports.handler = async (event) => {

  const response = await dynamoInstance.scan({ TableName: process.env.PRODUCTS_TABLE }).promise();
  return response.Items;
  return {
    statusCode: 200,
    body: JSON.stringify(products),
  };
};