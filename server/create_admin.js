const { User } = require('./database');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
    const name = 'Bank Admin';
    const email = 'admin@bank.com';
    const password = 'admin'; // Simple password for demo
    const hashedPassword = bcrypt.hashSync(password, 8);
    const accountNumber = 'ADMIN001';

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            // Update existing to admin
            existingUser.role = 'admin';
            existingUser.password = hashedPassword;
            await existingUser.save();
            console.log('Existing user updated to Admin. Login: admin@bank.com / admin');
        } else {
            // Create new admin
            const admin = new User({
                name,
                email,
                password: hashedPassword,
                account_number: accountNumber,
                balance: 1000000,
                role: 'admin',
                kyc_status: 'approved'
            });
            await admin.save();
            console.log('Admin user created. Login: admin@bank.com / admin');
        }
        
        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err.message);
        process.exit(1);
    }
};

// Wait for DB to initialize
setTimeout(createAdmin, 2000);
