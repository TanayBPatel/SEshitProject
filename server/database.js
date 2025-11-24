const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:admin@clustercontact.tcgcpbt.mongodb.net/?appName=clustercontact';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Schemas
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    account_number: { type: String, unique: true },
    kyc_status: { type: String, default: 'pending' },
    credit_score: { type: Number, default: 700 },
    phone: String,
    role: { type: String, default: 'user' },
    transaction_password: String
});

const transactionSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    description: String,
    category: { type: String, default: 'General' },
    date: { type: Date, default: Date.now }
});

const loanSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    reason: String,
    status: { type: String, default: 'pending' },
    date: { type: Date, default: Date.now }
});

const kycDocumentSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    filename: String,
    path: String,
    uploaded_at: { type: Date, default: Date.now }
});

const beneficiarySchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    account_number: { type: String, required: true },
    bank_name: String,
    ifsc: String
});

const billSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    biller_name: { type: String, required: true },
    amount: { type: Number, required: true },
    due_date: { type: Date, required: true },
    status: { type: String, default: 'unpaid' },
    category: String
});

const notificationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    is_read: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
});

const scheduledTransferSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient_account: { type: String, required: true },
    amount: { type: Number, required: true },
    frequency: { type: String, required: true },
    next_execution_date: { type: Date, required: true },
    active: { type: Boolean, default: true }
});

// Create Models
const User = mongoose.model('User', userSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);
const Loan = mongoose.model('Loan', loanSchema);
const KYCDocument = mongoose.model('KYCDocument', kycDocumentSchema);
const Beneficiary = mongoose.model('Beneficiary', beneficiarySchema);
const Bill = mongoose.model('Bill', billSchema);
const Notification = mongoose.model('Notification', notificationSchema);
const ScheduledTransfer = mongoose.model('ScheduledTransfer', scheduledTransferSchema);

module.exports = {
    mongoose,
    User,
    Transaction,
    Loan,
    KYCDocument,
    Beneficiary,
    Bill,
    Notification,
    ScheduledTransfer
};

