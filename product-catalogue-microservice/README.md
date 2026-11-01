# Product Catalogue Microservice

A JavaScript/Node.js Product Catalogue REST API with CRUD, filtering, model tests, route tests, and BDD examples.

## Setup
```bash
npm install
npm test
npm start
```
The API runs at `http://localhost:3000` and uses SQLite (`products.sqlite`) for local development.

## API
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

List filters: `?name=`, `?category=`, and `?available=true|false`.
