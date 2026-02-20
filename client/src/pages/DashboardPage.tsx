import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { TransferForm } from '../components/TransferForm';
import { TransactionTable } from '../components/TransactionTable';
import { LogOut, Wallet, ArrowUpRight, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
    const { user, logout } = useAuth();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const navigate = useNavigate();

    useSocket((newTx) => {
        setTransactions((prev) => [newTx, ...prev]);
    });

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/history');
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching history:', error);
            } finally {
                setIsInitialLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (!user) return null;

    return (
        <div className="min-h-screen pb-20">
            {/* Header */}
            <header className="glass sticky top-0 z-50 border-b">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => navigate('/')}
                    >
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                            <Wallet className="text-white" size={24} />
                        </div>
                        <h1 className="text-2xl font-bold gradient-text">PayVault</h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-6"
                    >
                        <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border text-sm">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="font-medium text-muted">{user.name}</span>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2.5 rounded-xl bg-white/5 border hover:text-error transition-all"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </motion.div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
                {/* Full-width Balance Display */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass card relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Wallet size={120} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-muted text-sm font-medium mb-1 uppercase tracking-wider">Available Balance</p>
                        <h2 className="text-6xl font-bold tracking-tighter">
                            <span className="text-white opacity-40 mr-2">$</span>
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={user.balance}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    className="inline-block"
                                >
                                    {user.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </motion.span>
                            </AnimatePresence>
                        </h2>
                        <div className="mt-6 flex items-center gap-2 text-success text-xs font-bold bg-green-500/10 w-fit px-4 py-1.5 rounded-full border border-green-500/20">
                            <ArrowUpRight size={14} />
                            <span>Live & Active</span>
                        </div>
                    </div>
                </motion.div>

                {/* Centered Transfer Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="max-w-2xl mx-auto w-full"
                >
                    <TransferForm />
                </motion.div>

                {/* Full-width History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass rounded-xl overflow-hidden"
                >
                    <div className="p-8 border-b flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                                <History className="text-accent" size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-white">Transaction History</h3>
                        </div>
                        <span className="text-xs font-medium px-4 py-1.5 rounded-full bg-white/5 border text-muted">
                            {transactions.length} Total Activities
                        </span>
                    </div>

                    <div className="p-4">
                        <TransactionTable transactions={transactions} isLoading={isInitialLoading} currentUserId={user.id} />
                    </div>
                </motion.div>
            </main>
        </div>
    );
};
