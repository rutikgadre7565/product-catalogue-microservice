const express = require('express');
const { router } = require('./routes/products');

const app = express();
app.use(express.json());
app.use('/api/products', router);
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

module.exports = app;
