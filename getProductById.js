'use strict';

const { products } = require("./products");

module.exports.handler = async (event) => {
  const { productId } = event.pathParameters;
  try {
    const product = products.find(product => product.id === productId)   
    if (!product) {
      throw Error('Product not found!')
    }
    return {
      statusCode: 200,
      body: JSON.stringify(product)
    };
  } catch (error) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Product not found' })
    };
  }
};