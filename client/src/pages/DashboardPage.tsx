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
            {/* Header */}
            <header className="glass-bright sticky top-0 z-50 border-b">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => navigate('/')}
                    >
                        <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all">
                            <Wallet className="text-white" size={26} />
                        </div>
                        <h1 className="text-2xl font-bold gradient-text tracking-tighter">PayVault</h1>
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
                            className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all shadow-lg"
                            title="Logout"
                        >
                            <LogOut size={22} />
                        </button>
                    </motion.div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-16 space-y-16">
                {/* Full-width Balance Display */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass card p-12 overflow-hidden border-white/10"
                >
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none scale-150 rotate-12">
                        <Wallet size={200} />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-8 h-1 bg-primary rounded-full" />
                            <p className="text-muted text-xs font-bold uppercase tracking-[0.2em]">Safe Vault Balance</p>
                        </div>

                        <h2 className="text-7xl font-bold tracking-tighter mb-8 leading-none">
                            <span className="text-white opacity-30 mr-3">$</span>
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={user.balance}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="inline-block"
                                >
                                    {user.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </motion.span>
                            </AnimatePresence>
                        </h2>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-success text-xs font-bold bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20 shadow-sm">
                                <ArrowUpRight size={14} />
                                <span>Secured & Active</span>
                            </div>
                            <div className="text-[10px] text-muted font-medium opacity-60">Verified {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                    </div>
                </motion.div>

                {/* Centered Transfer Form */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="max-w-2xl mx-auto w-full"
                >
                    <TransferForm />
                </motion.div>

                {/* Full-width History */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass rounded-3xl overflow-hidden border-white/5"
                >
                    <div className="p-10 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-accent/10 border border-accent/20 shadow-lg shadow-accent/5">
                                <History className="text-accent" size={24} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white tracking-tight">System Logs</h3>
                                <p className="text-xs text-muted mt-1">Detailed history of your movements</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10">
                            <span className="text-xs font-bold text-muted uppercase tracking-widest">{transactions.length} Entries</span>
                        </div>
                    </div>

                    <div className="p-6">
                        <TransactionTable transactions={transactions} isLoading={isInitialLoading} currentUserId={user.id} />
                    </div>
                </motion.div>
            </main>
        </div>
    );
};
