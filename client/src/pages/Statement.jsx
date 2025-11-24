import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statement = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            try {
                const res = await axios.get('/api/transactions/history', config);
                setTransactions(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Account Statement</h1>
                    <p className="text-gray-600 dark:text-slate-400">View your complete transaction history.</p>
                </div>
                <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-gray-800 dark:bg-slate-800 hover:bg-gray-700 dark:hover:bg-slate-700 text-white rounded-lg border border-gray-700 dark:border-slate-700 transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download PDF
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl dark:shadow-none">
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
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500 dark:text-slate-500">
                                        Loading transactions...
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500 dark:text-slate-500">
                                        No transactions found
                                    </td>
                                </tr>
                            ) : (
                                transactions.map(t => (
                                    <tr key={t._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-slate-300 whitespace-nowrap">
                                            {new Date(t.date).toLocaleString()}
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Statement;
