const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const seedUsers = require('./seed');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const transactionRoutes = require('./routes/transactions');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
    await seedUsers();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
