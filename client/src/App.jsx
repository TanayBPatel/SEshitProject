import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Statement from './pages/Statement';
import KYC from './pages/KYC';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import BillPayments from './pages/BillPayments';
import LoanDashboard from './pages/LoanDashboard';
import TransferHub from './pages/TransferHub';
import Notifications from './pages/Notifications';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import TransactionMonitor from './pages/admin/TransactionMonitor';
import AdminLoanManagement from './pages/admin/AdminLoanManagement';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (token) {
            setIsAuthenticated(true);
            setUserRole(role);
        }
        setIsLoading(false);
    }, []);

    const handleLogin = (token, role) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        setIsAuthenticated(true);
        setUserRole(role);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setIsAuthenticated(false);
        setUserRole(null);
    };

    const ProtectedRoute = ({ children }) => {
        if (isLoading) return null;
        if (!isAuthenticated) {
            return <Navigate to="/login" />;
        }
        return <Layout onLogout={handleLogout}>{children}</Layout>;
    };

    const AdminRoute = ({ children }) => {
        if (isLoading) return null;
        if (!isAuthenticated) {
            return <Navigate to="/login" />;
        }
        if (userRole !== 'admin') {
            return <Navigate to="/" />;
        }
        return <AdminLayout onLogout={handleLogout}>{children}</AdminLayout>;
    };

    if (isLoading) return null;

    return (
        <Router>
            <Routes>
                <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : (userRole === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/" />)} />
                <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />

                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/transfer" element={<ProtectedRoute><TransferHub /></ProtectedRoute>} />
                <Route path="/bills" element={<ProtectedRoute><BillPayments /></ProtectedRoute>} />
                <Route path="/loans" element={<ProtectedRoute><LoanDashboard /></ProtectedRoute>} />
                <Route path="/statement" element={<ProtectedRoute><Statement /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                <Route path="/kyc" element={<ProtectedRoute><KYC /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
                <Route path="/admin/transactions" element={<AdminRoute><TransactionMonitor /></AdminRoute>} />
                <Route path="/admin/loans" element={<AdminRoute><AdminLoanManagement /></AdminRoute>} />
            </Routes>
        </Router>
    );
}

export default App;
