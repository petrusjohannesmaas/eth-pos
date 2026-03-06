const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    accessCode: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['cashier', 'admin'],
        default: 'cashier',
    },
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
