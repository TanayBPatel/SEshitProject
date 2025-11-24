import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AnalyticsWidget = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/analytics/spending', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div>Loading Analytics...</div>;

    const totalSpending = data.reduce((acc, item) => acc + item.total, 0);

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Spending Analytics</h3>
            {data.length === 0 ? (
                <p className="text-gray-500">No spending data available.</p>
            ) : (
                <div className="space-y-4">
                    {data.map((item) => (
                        <div key={item.category}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700">{item.category}</span>
                                <span className="text-gray-600">${item.total.toFixed(2)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{ width: `${(item.total / totalSpending) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="font-bold text-gray-800">Total Spending</span>
                        <span className="font-bold text-blue-600 text-lg">${totalSpending.toFixed(2)}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsWidget;
