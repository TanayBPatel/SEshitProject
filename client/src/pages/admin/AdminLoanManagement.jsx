import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminLoanManagement = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/admin/loans', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLoans(res.data);
        } catch (err) {
            console.error(err);
            setMessage('Failed to fetch loans');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`/api/admin/loans/approve/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(res.data.message);
            fetchLoans();
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.error || 'Failed to approve loan');
        }
    };

    const handleCollect = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`/api/admin/loans/collect/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(res.data.message);
            fetchLoans();
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.error || 'Failed to collect loan');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Loan Management</h1>
                    <p className="text-gray-600 dark:text-slate-400">Approve pending loans and collect active ones.</p>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded-lg ${message.includes('Failed') || message.includes('error') || message.includes('low') || message.includes('negative') || message.includes('Insufficient')
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-green-50 text-green-700 border border-green-200'
                    }`}>
                    {message}
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-slate-950/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Credit Score</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">User Balance</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                            {loans.map(loan => (
                                <tr key={loan._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                                        {loan.user_name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-bold">
                                        ${loan.amount}
                                    </td>
                                    <td className={`px-6 py-4 text-sm font-medium ${(loan.credit_score || 700) >= 450 ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {loan.credit_score || 700}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-400">
                                        ${loan.user_balance?.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${loan.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                loan.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-gray-100 text-gray-700'
                                            }`}>
                                            {loan.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {loan.status === 'pending' && (
                                            <button
                                                onClick={() => handleApprove(loan._id)}
                                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-md transition-colors"
                                            >
                                                Approve
                                            </button>
                                        )}
                                        {loan.status === 'approved' && (
                                            <button
                                                onClick={() => handleCollect(loan._id)}
                                                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-md transition-colors"
                                            >
                                                Collect (+5%)
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {loans.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-slate-500">
                                        No loans found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminLoanManagement;
