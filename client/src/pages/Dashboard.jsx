import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import AnalyticsWidget from '../components/AnalyticsWidget';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            try {
                const userRes = await axios.get('/api/user/profile', config);
                setUser(userRes.data);

                const transRes = await axios.get('/api/transactions/history', config);
                setTransactions(transRes.data.slice(0, 5));

                const billsRes = await axios.get('/api/bills', config);
                setBills(billsRes.data.filter(b => b.status === 'unpaid').slice(0, 3));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="text-center text-slate-400 mt-20">Loading dashboard...</div>;
    if (!user) return <div className="text-center text-red-400 mt-20">Error loading profile</div>;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, {user.name}</h1>
                    <p className="text-gray-600 dark:text-slate-400">Here's what's happening with your account today.</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-900/50 rounded-full border border-gray-200 dark:border-slate-800 shadow-sm dark:shadow-none">
                    <div className={`w-2 h-2 rounded-full ${user.kyc_status === 'approved' ? 'bg-green-500' : 'bg-amber-500'}`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300 capitalize">Account {user.kyc_status === 'approved' ? 'Active' : user.kyc_status}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Balance Card */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05 1.18 1.91 2.53 1.91 1.29 0 2.13-.81 2.13-1.88 0-1.1-.68-1.57-1.75-1.82l-2.02-.46c-1.75-.41-3.07-1.5-3.07-3.6 0-1.77 1.39-3.16 2.96-3.53V3h2.67v1.93c1.38.32 2.48 1.12 2.8 2.78h-2.01c-.25-.72-1.01-1.35-2.03-1.35-1.15 0-1.94.64-1.94 1.55 0 .94.78 1.36 1.9 1.63l1.68.4c1.94.46 3.41 1.5 3.41 3.8 0 1.96-1.45 3.23-3.29 3.53z" /></svg>
                    </div>
                    <p className="text-blue-100 font-medium mb-1">Available Balance</p>
                    <h3 className="text-3xl font-bold">${user.balance.toFixed(2)}</h3>
                </div>

                {/* Credit Score Card */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 backdrop-blur-sm hover:border-gray-300 dark:hover:border-slate-700 transition-colors shadow-sm dark:shadow-none">
                    <p className="text-gray-500 dark:text-slate-400 font-medium mb-1">Credit Score</p>
                    <h3 className="text-3xl font-bold text-green-600 dark:text-green-400">{user.credit_score || 700}</h3>
                    <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">Excellent</p>
                </div>

                {/* Account Number Card */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 backdrop-blur-sm hover:border-gray-300 dark:hover:border-slate-700 transition-colors shadow-sm dark:shadow-none">
                    <p className="text-gray-500 dark:text-slate-400 font-medium mb-1">Account Number</p>
                    <h3 className="text-2xl font-mono text-gray-900 dark:text-white tracking-wider">{user.account_number}</h3>
                </div>

                {/* KYC Status Card */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 backdrop-blur-sm hover:border-gray-300 dark:hover:border-slate-700 transition-colors shadow-sm dark:shadow-none">
                    <p className="text-gray-500 dark:text-slate-400 font-medium mb-1">KYC Status</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${user.kyc_status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border border-green-200 dark:border-green-500/20' :
                            user.kyc_status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20' :
                                'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                            }`}>
                            {user.kyc_status.toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Transactions */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Analytics Widget */}
                    <AnalyticsWidget />

                    {/* Recent Transactions */}
                    <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-sm dark:shadow-none">
                        <div className="p-6 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
                            <Link to="/statement" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium transition-colors">
                                View All
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-slate-950/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                                    {transactions.map(t => (
                                        <tr key={t._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-700 dark:text-slate-300 whitespace-nowrap">
                                                {new Date(t.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                                                {t.description}
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.type === 'credit' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                                                    }`}>
                                                    {t.type.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className={`px-6 py-4 text-sm font-bold text-right whitespace-nowrap ${t.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-slate-200'
                                                }`}>
                                                {t.type === 'credit' ? '+' : '-'}${t.amount.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                    {transactions.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center text-gray-500 dark:text-slate-500">
                                                No recent transactions found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Upcoming Bills */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-sm dark:shadow-none">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upcoming Bills</h3>
                            <Link to="/bills" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">View All</Link>
                        </div>
                        <div className="space-y-4">
                            {bills.map(bill => (
                                <div key={bill.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                                    <div>
                                        <p className="text-gray-900 dark:text-white font-medium">{bill.biller_name}</p>
                                        <p className="text-xs text-gray-500 dark:text-slate-400">Due: {new Date(bill.due_date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-900 dark:text-white font-bold">${bill.amount}</p>
                                        <span className="text-xs text-amber-600 dark:text-amber-400">Unpaid</span>
                                    </div>
                                </div>
                            ))}
                            {bills.length === 0 && <p className="text-gray-500 dark:text-slate-500 text-sm">No upcoming bills.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
