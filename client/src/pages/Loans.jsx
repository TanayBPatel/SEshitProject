import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Loans = () => {
    const [loans, setLoans] = useState([]);
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchLoans = async () => {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        try {
            const res = await axios.get('/api/loans/my-loans', config);
            setLoans(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchLoans();
    }, []);

    const handleApply = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        try {
            await axios.post('/api/loans/apply', { amount: parseFloat(amount), reason }, config);
            setMessage('Loan application submitted successfully!');
            setAmount('');
            setReason('');
            fetchLoans();
        } catch (err) {
            console.error(err);
            setMessage('Failed to apply for loan.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Loan Services</h1>
                <p className="text-slate-400">Apply for a new loan or view your history.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Application Form */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-xl h-fit">
                    <h3 className="text-xl font-bold text-white mb-6">Apply for a Loan</h3>

                    {message && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.includes('success')
                                ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                                : 'bg-red-500/10 border border-red-500/20 text-red-400'
                            }`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleApply} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Loan Amount ($)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-3.5 text-slate-500">$</span>
                                <input
                                    type="number"
                                    className="w-full pl-8 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    required
                                    min="100"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Reason for Loan</label>
                            <textarea
                                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                rows="4"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                required
                                placeholder="e.g. Home renovation, Education..."
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : 'Apply Now'}
                        </button>
                    </form>
                </div>

                {/* Loan History */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-slate-800">
                        <h3 className="text-xl font-bold text-white">My Loans</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-950/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {loans.map(l => (
                                    <tr key={l._id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 text-sm text-slate-300 whitespace-nowrap">
                                            {new Date(l.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-white">
                                            ${l.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${l.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                                                    l.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                                                        'bg-amber-500/10 text-amber-400'
                                                }`}>
                                                {l.status.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {loans.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-12 text-center text-slate-500">
                                            No active loans found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loans;
