const request = require('supertest');
const app = require('../../src/app');
const { sequelize, Product } = require('../../src/models');
const { ProductFactory } = require('../factories');

const BASE_URL = '/api/products';
async function createProducts(count) {
  const rows = [];
  for (let i = 0; i < count; i++) {
    const data = ProductFactory.build();
    delete data.id;
    rows.push(await Product.create(data));
  }
  return rows;
}
async function getProductCount() {
  return Product.count();
}

beforeEach(async () => sequelize.sync({ force: true }));
afterAll(async () => sequelize.close());

test('should read a product', async () => {
  const data = ProductFactory.build();
  delete data.id;
  const product = await Product.create(data);
  const response = await request(app).get(`${BASE_URL}/${product.id}`).expect(200);
  expect(response.body.id).toBe(product.id);
  expect(response.body.name).toBe(product.name);
});

test('should update an existing product', async () => {
  const productData = ProductFactory.build();
  delete productData.id;
  let response = await request(app).post(BASE_URL).send(productData).expect(201);
  const newProduct = response.body;
  newProduct.description = 'unknown';
  response = await request(app).put(`${BASE_URL}/${newProduct.id}`).send(newProduct).expect(200);
  expect(response.body.description).toBe('unknown');
});

test('should delete a product', async () => {
  const products = await createProducts(5);
  const initialCount = await getProductCount();
  const product = products[0];
  const deleteResponse = await request(app).delete(`${BASE_URL}/${product.id}`).expect(204);
  expect(deleteResponse.text).toBe('');
  await request(app).get(`${BASE_URL}/${product.id}`).expect(404);
  const newCount = await getProductCount();
  expect(newCount).toBe(initialCount - 1);
});

test('should list all products', async () => {
  await createProducts(2);
  const response = await request(app).get(BASE_URL).expect(200);
  expect(response.body.length).toBe(2);
});

test('should filter products by name', async () => {
  await createProducts(2);
  const data = ProductFactory.build({ name: 'My Special Laptop' });
  delete data.id;
  await request(app).post(BASE_URL).send(data).expect(201);
  await createProducts(2);
  const response = await request(app).get(`${BASE_URL}?name=Special%20Laptop`).expect(200);
  expect(response.body.length).toBe(1);
  expect(response.body[0].name).toBe('My Special Laptop');
});

test('should filter products by category', async () => {
  const food = ProductFactory.build({ category: 'FOOD' });
  const tools = ProductFactory.build({ category: 'TOOLS' });
  delete food.id; delete tools.id;
  await request(app).post(BASE_URL).send(food).expect(201);
  await request(app).post(BASE_URL).send(tools).expect(201);
  const response = await request(app).get(`${BASE_URL}?category=TOOLS`).expect(200);
  expect(response.body.length).toBe(1);
  expect(response.body[0].category).toBe('TOOLS');
});

test('should filter products by availability', async () => {
  const yes = ProductFactory.build({ available: true });
  const no = ProductFactory.build({ available: false });
  delete yes.id; delete no.id;
  await request(app).post(BASE_URL).send(yes).expect(201);
  await request(app).post(BASE_URL).send(no).expect(201);
  const response = await request(app).get(`${BASE_URL}?available=true`).expect(200);
  expect(response.body.length).toBe(1);
  expect(response.body[0].available).toBe(true);
});
