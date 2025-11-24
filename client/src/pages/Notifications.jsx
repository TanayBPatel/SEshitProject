import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/notifications/read/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNotifications();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-950">

            <div className="max-w-4xl mx-auto p-6">
                <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Notifications</h2>
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md dark:shadow-none overflow-hidden border border-gray-200 dark:border-slate-800">
                    <div className="divide-y divide-gray-200 dark:divide-slate-800">
                        {notifications.map((notif) => (
                            <div key={notif.id} className={`p-4 ${notif.is_read ? 'bg-white dark:bg-slate-900' : 'bg-blue-50 dark:bg-blue-900/10'}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-gray-900 dark:text-gray-100 font-medium">{notif.message}</p>
                                        <p className="text-sm text-gray-500 dark:text-slate-400">{new Date(notif.date).toLocaleString()}</p>
                                    </div>
                                        {!notif.is_read && (
                                            <button
                                            onClick={() => markAsRead(notif._id)}
                                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold"
                                        >
                                            Mark as Read
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {notifications.length === 0 && (
                            <div className="p-6 text-center text-gray-500 dark:text-slate-500">No notifications.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
