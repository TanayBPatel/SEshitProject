import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const AdminLayout = ({ children, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'bg-indigo-800 text-white' : 'text-indigo-100 hover:bg-indigo-800';
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <div className="w-64 bg-indigo-900 text-white flex flex-col">
                <div className="p-6 border-b border-indigo-800">
                    <h1 className="text-2xl font-bold tracking-wider">Bank Admin</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/admin" className={`block px-4 py-3 rounded-lg transition-colors duration-200 ${isActive('/admin')}`}>
                        <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                            <span>Dashboard</span>
                        </div>
                    </Link>
                    <Link to="/admin/users" className={`block px-4 py-3 rounded-lg transition-colors duration-200 ${isActive('/admin/users')}`}>
                        <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            <span>User Management</span>
                        </div>
                    </Link>
                    <Link to="/admin/transactions" className={`block px-4 py-3 rounded-lg transition-colors duration-200 ${isActive('/admin/transactions')}`}>
                        <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                            <span>Transactions</span>
                        </div>
                    </Link>
                </nav>
                <div className="p-4 border-t border-indigo-800">
                    <button onClick={onLogout} className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <header className="bg-white shadow-sm p-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            {location.pathname === '/admin' && 'Dashboard Overview'}
                            {location.pathname === '/admin/users' && 'User Management'}
                            {location.pathname === '/admin/transactions' && 'Transaction Monitor'}
                        </h2>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600">Admin Portal</span>
                            <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-800 font-bold">A</div>
                        </div>
                    </div>
                </header>
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
