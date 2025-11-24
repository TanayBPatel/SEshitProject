import React, { useState } from 'react';
import axios from 'axios';

const KYC = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;
        setLoading(true);

        const formData = new FormData();
        formData.append('document', file);

        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        };

        try {
            await axios.post('/api/user/kyc', formData, config);
            setMessage('Document uploaded successfully. Your KYC is now approved!');
        } catch (err) {
            console.error(err);
            setMessage('Failed to upload document.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">KYC Verification</h1>
                <p className="text-gray-600 dark:text-slate-400">Verify your identity to unlock full features.</p>
            </div>

            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl dark:shadow-none">
                <div className="flex items-start gap-4 mb-8 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <div>
                        <h4 className="text-blue-700 dark:text-blue-400 font-medium mb-1">Document Requirements</h4>
                        <p className="text-sm text-blue-600/80 dark:text-blue-300/80">
                            Please upload a valid government-issued ID (Passport, Driver's License, or National ID).
                            Ensure the image is clear and all details are visible.
                        </p>
                    </div>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.includes('success')
                        ? 'bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400'
                        : 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400'
                        }`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl p-8 text-center hover:border-blue-500/50 transition-colors group cursor-pointer relative">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            required
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-slate-700 transition-colors">
                                <svg className="w-8 h-8 text-gray-400 dark:text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                            </div>
                            <div>
                                <p className="text-gray-900 dark:text-white font-medium mb-1">
                                    {file ? file.name : 'Click to upload or drag and drop'}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-slate-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !file}
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Uploading...' : 'Upload Document'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default KYC;
