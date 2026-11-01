const { Factory } = require('factory-girl');
const { faker } = require('@faker-js/faker');
const { Product } = require('../src/models');

const ProductFactory = Factory.define('Product', Product, {
  id: () => faker.string.uuid(),
  name: () => faker.commerce.productName(),
  description: () => faker.commerce.productDescription(),
  price: () => parseFloat(faker.commerce.price()),
  available: () => faker.datatype.boolean(),
  category: () => faker.helpers.arrayElement(['FOOD', 'TOOLS', 'ELECTRONICS', 'CLOTHS'])
});

module.exports = { ProductFactory };
