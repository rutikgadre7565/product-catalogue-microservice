const express = require('express');
const { Product, Op } = require('../models');

const router = express.Router();

function checkContentType(type) {
  return (req, res, next) => {
    if (!req.is(type)) return res.status(415).json({ error: 'Content-Type must be application/json' });
    next();
  };
}

router.post('/', checkContentType('application/json'), async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json(product.serialize());
  } catch (error) {
    return res.status(400).json({ error: 'Bad Request', message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.set('Content-Type', 'application/json');
    return res.status(200).json(product.serialize());
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', checkContentType('application/json'), async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await product.update(req.body);
    res.set('Content-Type', 'application/json');
    return res.status(200).json(product.serialize());
  } catch (error) {
    return res.status(400).json({ error: 'Bad Request', message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await product.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/', async (req, res) => {
  try {
    let products;
    if (req.query.name) {
      products = await Product.findAll({ where: { name: { [Op.like]: `%${req.query.name}%` } } });
    } else if (req.query.category) {
      products = await Product.findAll({ where: { category: req.query.category.toUpperCase() } });
    } else if (req.query.available !== undefined || req.query.availability !== undefined) {
      const value = req.query.available ?? req.query.availability;
      products = await Product.findAll({ where: { available: String(value).toLowerCase() === 'true' } });
    } else {
      products = await Product.findAll();
    }
    return res.status(200).json(products.map(p => p.serialize()));
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = { router, checkContentType };
