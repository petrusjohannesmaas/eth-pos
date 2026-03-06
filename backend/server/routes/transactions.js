const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// GET all transactions
router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.find({}).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST new transaction
router.post('/', async (req, res) => {
    try {
        const { items, subtotal, total, cashReceived, change, cashierId, cashierName } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in transaction' });
        }

        const transaction = await Transaction.create({
            items,
            subtotal,
            total,
            cashReceived,
            change,
            cashierId,
            cashierName
        });

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
