const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/access-code', async (req, res) => {
    try {
        const { accessCode } = req.body;
        const user = await User.findOne({ accessCode });
        if (!user) {
            return res.status(401).json({ message: 'Invalid access code' });
        }
        res.json({
            _id: user._id,
            name: user.name,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
