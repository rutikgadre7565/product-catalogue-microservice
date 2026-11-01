const { sequelize, Product } = require('../../src/models');
const { ProductFactory } = require('../factories');

beforeEach(async () => {
  await sequelize.sync({ force: true });
});
afterAll(async () => {
  await sequelize.close();
});

test('should read a product', async () => {
  const productData = ProductFactory.build();
  delete productData.id;
  const savedProduct = await Product.create(productData);
  expect(savedProduct.id).toBeDefined();
  const foundProduct = await Product.findByPk(savedProduct.id);
  expect(foundProduct.id).toBe(savedProduct.id);
  expect(foundProduct.name).toBe(productData.name);
  expect(foundProduct.description).toBe(productData.description);
  expect(parseFloat(foundProduct.price)).toBe(productData.price);
});

test('should update a product', async () => {
  const productData = ProductFactory.build();
  delete productData.id;
  const savedProduct = await Product.create(productData);
  savedProduct.description = 'testing';
  const originalId = savedProduct.id;
  await savedProduct.save();
  expect(savedProduct.id).toBe(originalId);
  expect(savedProduct.description).toBe('testing');
  const products = await Product.findAll();
  expect(products.length).toBe(1);
  expect(products[0].id).toBe(originalId);
  expect(products[0].description).toBe('testing');
});

test('should delete a product', async () => {
  const productData = ProductFactory.build();
  delete productData.id;
  const savedProduct = await Product.create(productData);
  let products = await Product.findAll();
  expect(products.length).toBe(1);
  await savedProduct.destroy();
  products = await Product.findAll();
  expect(products.length).toBe(0);
});

test('should list all products', async () => {
  let products = await Product.findAll();
  expect(products.length).toBe(0);
  for (let i = 0; i < 3; i++) {
    const productData = ProductFactory.build();
    delete productData.id;
    await Product.create(productData);
  }
  products = await Product.findAll();
  expect(products.length).toBe(3);
});

test('should find products by name', async () => {
  const products = [];
  for (let i = 0; i < 5; i++) {
    const data = ProductFactory.build({ name: i < 2 ? 'Shared Product' : `Product ${i}` });
    delete data.id;
    products.push(await Product.create(data));
  }
  const name = products[0].name;
  const count = products.filter(p => p.name === name).length;
  const found = await Product.findByName(name);
  expect(found.length).toBe(count);
  for (const product of found) expect(product.name).toBe(name);
});

test('should find products by category', async () => {
  const products = [];
  for (let i = 0; i < 10; i++) {
    const data = ProductFactory.build({ category: i < 4 ? 'TOOLS' : 'FOOD' });
    delete data.id;
    products.push(await Product.create(data));
  }
  const category = products[0].category;
  const count = products.filter(p => p.category === category).length;
  const found = await Product.findByCategory(category);
  expect(found.length).toBe(count);
  for (const product of found) expect(product.category).toBe(category);
});

test('should find products by availability', async () => {
  const products = [];
  for (let i = 0; i < 10; i++) {
    const data = ProductFactory.build({ available: i < 6 });
    delete data.id;
    products.push(await Product.create(data));
  }
  const available = products[0].available;
  const count = products.filter(p => p.available === available).length;
  const found = await Product.findByAvailability(available);
  expect(found.length).toBe(count);
  for (const product of found) expect(product.available).toBe(available);
});
