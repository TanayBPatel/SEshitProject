import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'text-emerald-600 font-semibold' : 'text-gray-600 hover:text-emerald-600';
    };

    const navItems = [
        { path: '/', label: 'Dashboard' },
        { path: '/transfer', label: 'Transfer' },
        { path: '/bills', label: 'Bills' },
        { path: '/loans', label: 'Loans' },
        { path: '/statement', label: 'Statement' },
        { path: '/profile', label: 'Profile' },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-lg">₹</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                            BankApp
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`text-sm transition-colors ${isActive(item.path)}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={onLogout}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
