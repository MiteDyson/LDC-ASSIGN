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
                const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/history`);
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
            {/* Thicker Header */}
            <header className="glass-bright sticky top-0 z-50 border-b">
                <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => navigate('/')}
                    >
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all">
                            <Wallet className="text-white" size={28} />
                        </div>
                        <h1 className="text-3xl font-bold gradient-text tracking-tighter">PayVault</h1>
                    </motion.div>

                    <div className="flex items-center gap-8">
                        {/* Balance in Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="hidden md:flex flex-col items-end pr-8 border-r border-white/10"
                        >
                            <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-1">Available Funds</span>
                            <div className="text-2xl font-black text-white tabular-nums flex items-center gap-1">
                                <span className="text-primary opacity-60 text-lg">$</span>
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={user.balance}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        {user.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-6"
                        >
                            <div className="hidden sm:flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-sm shadow-inner">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="font-semibold text-muted tracking-tight">{user.name}</span>
                            </div>
                            <button
                                onClick={logout}
                                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all shadow-lg"
                                title="Logout"
                            >
                                <LogOut size={24} />
                            </button>
                        </motion.div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-16 space-y-16">
                {/* Centered Transfer Form */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="w-full"
                >
                    <TransferForm />
                </motion.div>

                {/* Simplified History */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass rounded-3xl overflow-hidden border-white/5 shadow-2xl"
                >
                    <div className="p-10 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20 shadow-lg shadow-accent/5">
                                <History className="text-accent" size={26} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white tracking-tight">Recent Activity</h3>
                                <p className="text-xs text-muted mt-1 font-medium italic opacity-60">Verified transaction history</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 border border-white/10">
                            <span className="text-xs font-bold text-muted uppercase tracking-[0.2em]">{transactions.length} Logs</span>
                        </div>
                    </div>

                    <div className="p-8">
                        <TransactionTable transactions={transactions} isLoading={isInitialLoading} currentUserId={user.id} />
                    </div>
                </motion.div>
            </main>
        </div>
    );
};
