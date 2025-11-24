import React, { useState, useEffect } from 'react';
import axios from 'axios';


const TransferHub = () => {
    const [activeTab, setActiveTab] = useState('quick'); // quick, beneficiary, international, scheduled
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [message, setMessage] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [pendingTransaction, setPendingTransaction] = useState(null);

    // Form States
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [desc, setDesc] = useState('');

    // Beneficiary Form
    const [benName, setBenName] = useState('');
    const [benAccount, setBenAccount] = useState('');
    const [benBank, setBenBank] = useState('');
    const [benIfsc, setBenIfsc] = useState('');

    useEffect(() => {
        if (activeTab === 'beneficiary') fetchBeneficiaries();
    }, [activeTab]);

    const fetchBeneficiaries = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/beneficiaries', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBeneficiaries(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        setPendingTransaction({ type: 'transfer', data: { recipientAccount: recipient, amount, description: desc } });
        initiateOtp();
    };

    const handleInternationalTransfer = async (e) => {
        e.preventDefault();
        setPendingTransaction({ type: 'international', data: { recipientAccount: recipient, amount, currency: 'USD', swiftCode: 'MOCKSWIFT' } });
        initiateOtp();
    };

    const handleAddBeneficiary = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/beneficiaries', {
                name: benName, account_number: benAccount, bank_name: benBank, ifsc: benIfsc
            }, { headers: { Authorization: `Bearer ${token}` } });
            setMessage('Beneficiary added successfully');
            setBenName(''); setBenAccount(''); setBenBank(''); setBenIfsc('');
            fetchBeneficiaries();
        } catch (err) {
            setMessage('Failed to add beneficiary');
        }
    };

    const initiateOtp = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/auth/otp/generate', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // In a real app, we wouldn't alert the OTP.
            alert(`OTP Sent: ${res.data.otp}`);
            setShowOtpModal(true);
        } catch (err) {
            setMessage('Failed to generate OTP');
        }
    };

    const verifyOtpAndExecute = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/auth/otp/verify', { otp }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Execute Transaction
            let endpoint = '';
            let payload = {};

            if (pendingTransaction.type === 'transfer') {
                endpoint = '/api/transactions/transfer';
                payload = pendingTransaction.data;
            } else if (pendingTransaction.type === 'international') {
                endpoint = '/api/transactions/international';
                payload = pendingTransaction.data;
            }

            const res = await axios.post(endpoint, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage(res.data.message);
            setShowOtpModal(false);
            setOtp('');
            setPendingTransaction(null);
            setAmount(''); setRecipient(''); setDesc('');

        } catch (err) {
            alert('Invalid OTP or Transaction Failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-300">

            <div className="max-w-4xl mx-auto p-6">
                <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Transfer Hub</h2>

                {message && <div className="p-4 mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-800">{message}</div>}

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden transition-colors duration-300">
                    <div className="flex border-b dark:border-slate-700">
                        {['quick', 'beneficiary', 'international'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-4 text-center font-medium capitalize transition-colors ${activeTab === tab ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'}`}
                            >
                                {tab} Transfer
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {activeTab === 'quick' && (
                            <form onSubmit={handleTransfer} className="space-y-4 max-w-md mx-auto">
                                <h3 className="text-lg font-semibold mb-4 dark:text-white">Quick Transfer</h3>
                                <input type="text" placeholder="Recipient Account" value={recipient} onChange={e => setRecipient(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" required />
                                <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" required />
                                <input type="text" placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" />
                                <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors">Proceed</button>
                            </form>
                        )}

                        {activeTab === 'beneficiary' && (
                            <div>
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold mb-4 dark:text-white">Add New Beneficiary</h3>
                                    <form onSubmit={handleAddBeneficiary} className="grid grid-cols-2 gap-4">
                                        <input type="text" placeholder="Name" value={benName} onChange={e => setBenName(e.target.value)} className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" required />
                                        <input type="text" placeholder="Account Number" value={benAccount} onChange={e => setBenAccount(e.target.value)} className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" required />
                                        <input type="text" placeholder="Bank Name" value={benBank} onChange={e => setBenBank(e.target.value)} className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" required />
                                        <input type="text" placeholder="IFSC Code" value={benIfsc} onChange={e => setBenIfsc(e.target.value)} className="p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" required />
                                        <button type="submit" className="col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors">Save Beneficiary</button>
                                    </form>
                                </div>

                                <h3 className="text-lg font-semibold mb-4 dark:text-white">Saved Beneficiaries</h3>
                                <div className="space-y-2">
                                    {beneficiaries.map(ben => (
                                        <div key={ben._id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50 dark:hover:bg-slate-700/50 dark:border-slate-700 transition-colors">
                                            <div>
                                                <p className="font-bold dark:text-white">{ben.name}</p>
                                                <p className="text-sm text-gray-500 dark:text-slate-400">{ben.bank_name} - {ben.account_number}</p>
                                            </div>
                                            <button
                                                onClick={() => { setRecipient(ben.account_number); setActiveTab('quick'); }}
                                                className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline"
                                            >
                                                Transfer
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'international' && (
                            <form onSubmit={handleInternationalTransfer} className="space-y-4 max-w-md mx-auto">
                                <h3 className="text-lg font-semibold mb-4 dark:text-white">International Transfer (USD)</h3>
                                <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Exchange Rate: 1 USD = 80 INR</p>
                                <input type="text" placeholder="Recipient Account" value={recipient} onChange={e => setRecipient(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" required />
                                <input type="number" placeholder="Amount (USD)" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" required />
                                <input type="text" placeholder="SWIFT Code" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" defaultValue="MOCKSWIFT" disabled />
                                <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition-colors">Transfer USD</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* OTP Modal */}
            {showOtpModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-96 transition-colors">
                        <h3 className="text-xl font-bold mb-4 dark:text-white">Enter OTP</h3>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Please enter the OTP sent to your mobile.</p>
                        <input
                            type="text"
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            className="w-full p-2 border rounded mb-4 text-center text-2xl tracking-widest dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                            maxLength="6"
                        />
                        <div className="flex space-x-3">
                            <button onClick={() => setShowOtpModal(false)} className="flex-1 py-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors">Cancel</button>
                            <button onClick={verifyOtpAndExecute} className="flex-1 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">Verify</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransferHub;
