import React, { useState, useEffect } from 'react';
import axios from 'axios';


const BillPayments = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [billerName, setBillerName] = useState('');
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/bills', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBills(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const payBill = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`/api/bills/pay/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(res.data.message);
            fetchBills(); // Refresh list
        } catch (err) {
            setMessage(err.response?.data?.error || 'Payment failed');
        }
    };

    const handleAddBiller = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/bills', {
                biller_name: billerName,
                amount: parseFloat(amount),
                due_date: dueDate,
                category: 'Utilities'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Biller added successfully');
            setBillerName('');
            setAmount('');
            setDueDate('');
            fetchBills();
        } catch (err) {
            setMessage('Failed to add biller');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-300">

            <div className="max-w-4xl mx-auto p-6">
                <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Bill Payments</h2>

                {message && <div className="p-4 mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-800">{message}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Upcoming Bills */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md transition-colors duration-300">
                        <h3 className="text-xl font-bold mb-4 dark:text-white">Upcoming Bills</h3>
                        <div className="space-y-4">
                            {bills.map(bill => (
                                <div key={bill._id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/50 dark:border-slate-700 transition-colors">
                                    <div>
                                        <p className="font-semibold dark:text-white">{bill.biller_name}</p>
                                        <p className="text-sm text-gray-500 dark:text-slate-400">Due: {new Date(bill.due_date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg dark:text-white">${bill.amount}</p>
                                        <button
                                            onClick={() => payBill(bill._id)}
                                            className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                                        >
                                            Pay Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {bills.length === 0 && <p className="text-gray-500 dark:text-slate-400">No upcoming bills.</p>}
                        </div>
                    </div>

                    {/* Add New Biller */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md transition-colors duration-300">
                        <h3 className="text-xl font-bold mb-4 dark:text-white">Add New Biller</h3>
                        <form onSubmit={handleAddBiller} className="space-y-4">
                            <input type="text" placeholder="Biller Name" value={billerName} onChange={e => setBillerName(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" required />
                            <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400" required />
                            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white" required />
                            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors">Add Biller</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillPayments;
