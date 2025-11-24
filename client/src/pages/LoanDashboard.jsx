import React, { useState, useEffect } from 'react';
import axios from 'axios';


const LoanDashboard = () => {
    const [loans, setLoans] = useState([]);
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState('');
    const [eligibility, setEligibility] = useState(null);

    useEffect(() => {
        fetchLoans();
        checkEligibility();
    }, []);

    const fetchLoans = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/loans/my-loans', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLoans(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const checkEligibility = async () => {
        // Mock eligibility check
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get('/api/user/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Simple logic: Eligible for 5x balance
            setEligibility(res.data.balance * 5);
        } catch (err) {
            console.error(err);
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/loans/apply', { amount, reason }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(res.data.message);
            setAmount('');
            setReason('');
            fetchLoans();
        } catch (err) {
            setMessage(err.response?.data?.error || 'Application failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-300">

            <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Apply Section */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md transition-colors duration-300">
                        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Apply for Loan</h3>
                        {eligibility !== null && (
                            <div className="mb-4 p-3 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-lg text-sm border border-blue-100 dark:border-blue-800">
                                Max Eligibility: <span className="font-bold">${eligibility.toFixed(2)}</span>
                            </div>
                        )}
                        {message && <p className="mb-4 text-sm text-green-600 dark:text-green-400">{message}</p>}
                        <form onSubmit={handleApply} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Amount</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border dark:bg-slate-700 dark:text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Reason</label>
                                <input
                                    type="text"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border dark:bg-slate-700 dark:text-white"
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                                Apply Now
                            </button>
                        </form>
                    </div>
                </div>

                {/* Dashboard Section */}
                <div className="md:col-span-2">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md transition-colors duration-300">
                        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Active Loans</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                                <thead className="bg-gray-50 dark:bg-slate-700/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Reason</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                                    {loans.map((loan) => (
                                        <tr key={loan._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{new Date(loan.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">${loan.amount}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">{loan.reason}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                    {loan.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {loans.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 text-center text-gray-500 dark:text-slate-400">No active loans.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoanDashboard;
