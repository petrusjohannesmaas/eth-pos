const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find({}).select('-accessCode'); // don't return access codes just in case
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST new user
router.post('/', async (req, res) => {
    try {
        const { name, accessCode, role } = req.body;

        const userExists = await User.findOne({ accessCode });
        if (userExists) {
            return res.status(400).json({ message: 'Access code already in use' });
        }

        const user = await User.create({
            name,
            accessCode,
            role: role || 'cashier',
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
