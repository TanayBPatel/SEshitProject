import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDeposits: 0,
        totalTransactions: 0,
        activeLoans: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="text-center p-10">Loading stats...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
                    <div className="p-2 bg-blue-50 rounded-lg">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    </div>
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
                <p className="text-sm text-green-600 mt-2 flex items-center">
                    <span className="font-medium">Active</span>
                </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 text-sm font-medium">Total Deposits</h3>
                    <div className="p-2 bg-green-50 rounded-lg">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                </div>
                <p className="text-3xl font-bold text-gray-800">${stats.totalDeposits?.toLocaleString() || 0}</p>
                <p className="text-sm text-gray-500 mt-2">System-wide balance</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 text-sm font-medium">Total Transactions</h3>
                    <div className="p-2 bg-purple-50 rounded-lg">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    </div>
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats.totalTransactions}</p>
                <p className="text-sm text-gray-500 mt-2">All time volume</p>
            </div>

            <Link to="/admin/loans" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-500 transition-colors cursor-pointer block">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 text-sm font-medium">Active Loans</h3>
                    <div className="p-2 bg-yellow-50 rounded-lg">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats.activeLoans}</p>
                <p className="text-sm text-gray-500 mt-2">Manage Loans &rarr;</p>
            </Link>
        </div>
    );
};

export default AdminDashboard;
