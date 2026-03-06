const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET product by barcode
router.get('/barcode/:barcode', async (req, res) => {
    try {
        const product = await Product.findOne({ barcode: req.params.barcode });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST new product
router.post('/', async (req, res) => {
    try {
        const { name, barcode, price } = req.body;

        const productExists = await Product.findOne({ barcode });
        if (productExists) {
            return res.status(400).json({ message: 'Product with this barcode already exists' });
        }

        const product = await Product.create({
            name,
            barcode,
            price
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
