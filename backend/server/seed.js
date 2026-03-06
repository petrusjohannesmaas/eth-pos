const User = require('./models/User');

const seedUsers = async () => {
    try {
        const defaultUsers = [
            { name: 'Alice', accessCode: '1111', role: 'cashier' },
            { name: 'Bob', accessCode: '2222', role: 'cashier' },
            { name: 'Eve', accessCode: '3333', role: 'admin' },
        ];

        for (let u of defaultUsers) {
            const exists = await User.findOne({ accessCode: u.accessCode });
            if (!exists) {
                await User.create(u);
                console.log(`Seeded user ${u.name}`);
            }
        }
        console.log('Seeding complete');
    } catch (error) {
        console.error('Seeding error:', error);
    }
};

module.exports = seedUsers;
