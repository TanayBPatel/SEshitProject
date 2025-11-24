import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            try {
                const res = await axios.get('/api/user/profile', config);
                setUser(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    if (!user) return <div className="text-center text-slate-400 mt-20">Loading profile...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Profile</h1>
                <p className="text-gray-600 dark:text-slate-400">Manage your account settings and preferences.</p>
            </div>

            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl dark:shadow-none">
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-slate-800">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-blue-500/20 ring-4 ring-white dark:ring-slate-900">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{user.name}</h2>
                        <p className="text-gray-500 dark:text-slate-400">{user.email}</p>
                        <div className="flex items-center gap-2 mt-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.kyc_status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                                }`}>
                                KYC {user.kyc_status.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">Account Number</label>
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg group hover:border-gray-300 dark:hover:border-slate-700 transition-colors">
                            <span className="font-mono text-lg text-gray-900 dark:text-white tracking-wider">{user.account_number}</span>
                            <button
                                onClick={() => navigator.clipboard.writeText(user.account_number)}
                                className="text-gray-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                                title="Copy to clipboard"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">Current Balance</label>
                            <div className="p-4 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg">
                                <span className="text-xl font-bold text-gray-900 dark:text-white">${user.balance.toFixed(2)}</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">Member Since</label>
                            <div className="p-4 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg">
                                <span className="text-gray-900 dark:text-white">November 2023</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
