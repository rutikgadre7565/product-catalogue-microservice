const { Given } = require('@cucumber/cucumber');
const axios = require('axios');
const API_URL = 'http://localhost:3000/api/products';

Given('the following products', async function (dataTable) {
  const products = dataTable.hashes();
  for (const product of products) {
    const payload = {
      name: product.name,
      description: product.description,
      price: parseFloat(product.price),
      available: product.available.toLowerCase() === 'true',
      category: product.category.toUpperCase()
    };
    await axios.post(API_URL, payload);
  }
});
