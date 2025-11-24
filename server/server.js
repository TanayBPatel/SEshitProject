const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { User, Transaction, Loan, KYCDocument, Beneficiary, Bill, Notification, ScheduledTransfer } = require('./database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || 'supersecretkey'; // In production, use env var

app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Middleware to authenticate admin
const authenticateAdmin = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, async (err, user) => {
        if (err) return res.sendStatus(403);

        try {
            const dbUser = await User.findById(user.id);
            if (!dbUser || dbUser.role !== 'admin') {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        } catch (error) {
            return res.sendStatus(403);
        }
    });
};

// Multer setup for KYC uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// --- AUTH ROUTES ---

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 8);
        const accountNumber = 'ACC' + Math.floor(1000000000 + Math.random() * 9000000000);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            account_number: accountNumber,
            balance: 1000
        });

        await user.save();
        res.json({ message: 'User registered successfully', userId: user._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) return res.status(404).json({ error: 'User not found' });

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).json({ token: null, error: 'Invalid password' });

        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: 86400 });
        res.json({ 
            auth: true, 
            token: token, 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                accountNumber: user.account_number, 
                kyc_status: user.kyc_status, 
                role: user.role 
            } 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- USER ROUTES ---

// Get User Profile & Balance
app.get('/api/user/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('id name email balance account_number kyc_status');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Upload KYC
app.post('/api/user/kyc', authenticateToken, upload.single('document'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const kycDoc = new KYCDocument({
            user_id: req.user.id,
            filename: req.file.filename,
            path: req.file.path
        });

        await kycDoc.save();
        await User.findByIdAndUpdate(req.user.id, { kyc_status: 'approved' });

        res.json({ message: 'KYC document uploaded successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- TRANSACTION ROUTES ---

// Transfer Funds
app.post('/api/transactions/transfer', authenticateToken, async (req, res) => {
    try {
        const { recipientAccount, amount, description } = req.body;
        const senderId = req.user.id;

        if (amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

        const sender = await User.findById(senderId);
        if (!sender) return res.status(404).json({ error: 'Sender not found' });
        if (sender.balance < amount) return res.status(400).json({ error: 'Insufficient funds' });

        const recipient = await User.findOne({ account_number: recipientAccount });
        if (!recipient) return res.status(404).json({ error: 'Recipient not found' });
        if (recipient._id.toString() === senderId) return res.status(400).json({ error: 'Cannot transfer to self' });

        // Update balances
        sender.balance -= amount;
        recipient.balance += amount;
        await sender.save();
        await recipient.save();

        // Record transactions
        await Transaction.create([
            {
                user_id: senderId,
                type: 'debit',
                amount: amount,
                description: `Transfer to ${recipient.name} (${description})`
            },
            {
                user_id: recipient._id,
                type: 'credit',
                amount: amount,
                description: `Transfer from ${sender.name} (${description})`
            }
        ]);

        res.json({ message: 'Transfer successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Transactions (Statement)
app.get('/api/transactions/history', authenticateToken, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user_id: req.user.id }).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- LOAN ROUTES ---

// Apply Loan
app.post('/api/loans/apply', authenticateToken, async (req, res) => {
    try {
        const { amount, reason } = req.body;
        const loan = new Loan({
            user_id: req.user.id,
            amount,
            reason,
            status: 'pending'
        });
        await loan.save();
        res.json({ message: 'Loan application submitted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Loans
app.get('/api/loans/my-loans', authenticateToken, async (req, res) => {
    try {
        const loans = await Loan.find({ user_id: req.user.id }).sort({ date: -1 });
        res.json(loans);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- NEW FEATURES ROUTES ---

// 1. Beneficiaries
app.get('/api/beneficiaries', authenticateToken, async (req, res) => {
    try {
        const beneficiaries = await Beneficiary.find({ user_id: req.user.id });
        res.json(beneficiaries);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/beneficiaries', authenticateToken, async (req, res) => {
    try {
        const { name, account_number, bank_name, ifsc } = req.body;
        const beneficiary = new Beneficiary({
            user_id: req.user.id,
            name,
            account_number,
            bank_name,
            ifsc
        });
        await beneficiary.save();
        res.json({ id: beneficiary._id, message: 'Beneficiary added' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Bills
app.get('/api/bills', authenticateToken, async (req, res) => {
    try {
        const bills = await Bill.find({ user_id: req.user.id }).sort({ due_date: 1 });
        res.json(bills);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/bills', authenticateToken, async (req, res) => {
    try {
        const { biller_name, amount, due_date, category } = req.body;
        const bill = new Bill({
            user_id: req.user.id,
            biller_name,
            amount: parseFloat(amount),
            due_date,
            category: category || 'Utilities',
            status: 'unpaid'
        });
        await bill.save();
        res.json({ id: bill._id, message: 'Bill added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/bills/pay/:id', authenticateToken, async (req, res) => {
    try {
        const billId = req.params.id;
        const userId = req.user.id;

        const bill = await Bill.findOne({ _id: billId, user_id: userId });
        if (!bill) return res.status(404).json({ error: 'Bill not found' });
        if (bill.status === 'paid') return res.status(400).json({ error: 'Bill already paid' });

        const user = await User.findById(userId);
        if (user.balance < bill.amount) return res.status(400).json({ error: 'Insufficient funds' });

        user.balance -= bill.amount;
        await user.save();

        bill.status = 'paid';
        await bill.save();

        await Transaction.create({
            user_id: userId,
            type: 'debit',
            amount: bill.amount,
            description: `Bill Payment: ${bill.biller_name}`,
            category: bill.category
        });

        res.json({ message: 'Bill paid successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Notifications
app.get('/api/notifications', authenticateToken, async (req, res) => {
    try {
        const notifications = await Notification.find({ user_id: req.user.id }).sort({ date: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/notifications/read/:id', authenticateToken, async (req, res) => {
    try {
        await Notification.findOneAndUpdate(
            { _id: req.params.id, user_id: req.user.id },
            { is_read: true }
        );
        res.json({ message: 'Marked as read' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Analytics (Spending by Category)
app.get('/api/analytics/spending', authenticateToken, async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const spending = await Transaction.aggregate([
            { $match: { user_id: new mongoose.Types.ObjectId(req.user.id), type: 'debit' } },
            { $group: { _id: '$category', total: { $sum: '$amount' } } },
            { $project: { category: '$_id', total: 1, _id: 0 } }
        ]);
        res.json(spending);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Scheduled Transfers (Mock Execution Logic would go here in a real app)
app.post('/api/transfers/schedule', authenticateToken, async (req, res) => {
    try {
        const { recipient_account, amount, frequency, next_execution_date } = req.body;
        const scheduledTransfer = new ScheduledTransfer({
            user_id: req.user.id,
            recipient_account,
            amount,
            frequency,
            next_execution_date
        });
        await scheduledTransfer.save();
        res.json({ message: 'Transfer scheduled successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. OTP (Mock)
app.post('/api/auth/otp/generate', authenticateToken, (req, res) => {
    // In a real app, send SMS. Here, just return it.
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(`GENERATED OTP FOR USER ${req.user.id}: ${otp}`);
    res.json({ message: 'OTP sent', otp: otp }); // Returning OTP for demo purposes
});

app.post('/api/auth/otp/verify', authenticateToken, (req, res) => {
    const { otp } = req.body;
    // Mock verification
    if (otp) {
        res.json({ message: 'OTP verified' });
    } else {
        res.status(400).json({ error: 'Invalid OTP' });
    }
});

// 7. International Transfer (Mock)
app.post('/api/transactions/international', authenticateToken, async (req, res) => {
    try {
        const { recipientAccount, amount, currency, swiftCode } = req.body;
        // Mock currency conversion (e.g., 1 USD = 80 INR)
        const exchangeRate = 80;
        const inrAmount = amount * exchangeRate;

        const user = await User.findById(req.user.id);
        if (user.balance < inrAmount) return res.status(400).json({ error: 'Insufficient funds' });

        user.balance -= inrAmount;
        await user.save();

        await Transaction.create({
            user_id: req.user.id,
            type: 'debit',
            amount: inrAmount,
            description: `Intl Transfer to ${recipientAccount} (${currency})`,
            category: 'International'
        });

        res.json({ message: 'International transfer successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// --- ADMIN ROUTES ---

// Admin Stats
app.get('/api/admin/stats', authenticateAdmin, async (req, res) => {
    try {
        const stats = {};
        stats.totalUsers = await User.countDocuments();
        const totalDepositsResult = await User.aggregate([
            { $group: { _id: null, total: { $sum: '$balance' } } }
        ]);
        stats.totalDeposits = totalDepositsResult.length > 0 ? totalDepositsResult[0].total : 0;
        stats.totalTransactions = await Transaction.countDocuments();
        stats.activeLoans = await Loan.countDocuments({ status: { $in: ['pending', 'approved'] } });
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Users List
app.get('/api/admin/users', authenticateAdmin, async (req, res) => {
    try {
        const users = await User.find().select('id name email account_number balance role kyc_status');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Transactions List
app.get('/api/admin/transactions', authenticateAdmin, async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate('user_id', 'name')
            .sort({ date: -1 })
            .limit(100);
        
        const formattedTransactions = transactions.map(t => ({
            ...t.toObject(),
            user_name: t.user_id ? t.user_id.name : 'Unknown'
        }));
        
        res.json(formattedTransactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Loans List
app.get('/api/admin/loans', authenticateAdmin, async (req, res) => {
    try {
        const loans = await Loan.find()
            .populate('user_id', 'name credit_score balance')
            .sort({ date: -1 });
        
        const formattedLoans = loans.map(l => ({
            ...l.toObject(),
            user_name: l.user_id ? l.user_id.name : 'Unknown',
            credit_score: l.user_id ? l.user_id.credit_score : 0,
            user_balance: l.user_id ? l.user_id.balance : 0
        }));
        
        res.json(formattedLoans);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Approve Loan
app.post('/api/admin/loans/approve/:id', authenticateAdmin, async (req, res) => {
    try {
        const loanId = req.params.id;

        const loan = await Loan.findById(loanId).populate('user_id');
        if (!loan) return res.status(404).json({ error: 'Loan not found' });
        if (loan.status !== 'pending') return res.status(400).json({ error: 'Loan is not pending' });

        const user = loan.user_id;
        const creditScore = user.credit_score || 700;
        
        if (creditScore < 450) {
            return res.status(400).json({ error: `Credit score too low (${creditScore}). Minimum 450 required.` });
        }

        if (user.balance < 0) {
            return res.status(400).json({ error: 'User has negative balance. Cannot approve loan.' });
        }

        loan.status = 'approved';
        await loan.save();

        user.balance += loan.amount;
        await user.save();

        await Transaction.create({
            user_id: user._id,
            type: 'credit',
            amount: loan.amount,
            description: `Loan Disbursed (ID: ${loanId})`,
            category: 'Loan'
        });

        res.json({ message: 'Loan approved and disbursed successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Collect Loan
app.post('/api/admin/loans/collect/:id', authenticateAdmin, async (req, res) => {
    try {
        const loanId = req.params.id;
        const INTEREST_RATE = 0.05; // 5% Interest

        const loan = await Loan.findById(loanId).populate('user_id');
        if (!loan) return res.status(404).json({ error: 'Loan not found' });
        if (loan.status !== 'approved') return res.status(400).json({ error: 'Loan is not active' });

        const totalAmount = loan.amount * (1 + INTEREST_RATE);
        const user = loan.user_id;

        if (user.balance < totalAmount) {
            return res.status(400).json({ error: `Insufficient user balance. Required: $${totalAmount.toFixed(2)}` });
        }

        loan.status = 'paid';
        await loan.save();

        user.balance -= totalAmount;
        await user.save();

        await Transaction.create({
            user_id: user._id,
            type: 'debit',
            amount: totalAmount,
            description: `Loan Repayment (ID: ${loanId}) + 5% Interest`,
            category: 'Loan Repayment'
        });

        res.json({ message: `Loan collected successfully. Amount: $${totalAmount.toFixed(2)}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
