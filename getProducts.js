'use strict';

const { products } = require("./products");

module.exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(products),
  };
};