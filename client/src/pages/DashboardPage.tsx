import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { TransferForm } from '../components/TransferForm';
import { TransactionTable } from '../components/TransactionTable';
import { LogOut, Wallet, History, ArrowRightLeft, Activity } from 'lucide-react';
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
        <div className="min-h-screen bg-[#030303] text-zinc-300 font-sans selection:bg-indigo-500/30 relative overflow-hidden">

            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500 via-[#030303] to-transparent" />

            {/* --- PREMIUM THICK HEADER --- */}
            <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#030303]/70 backdrop-blur-2xl">
                <div className="max-w-7xl mx-auto px-6 h-28 flex items-center justify-between">

                    {/* Brand */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 cursor-pointer group"
                        onClick={() => navigate('/')}
                    >
                        <div className="w-12 h-12 bg-gradient-to-b from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)] ring-1 ring-white/10 group-hover:scale-105 transition-all">
                            <Wallet className="text-white" size={24} />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-2xl font-extrabold text-white tracking-tight">PayVault</h1>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">System Online</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* CENTERED BALANCE */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute left-1/2 -translate-x-1/2 text-center"
                    >
                        <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.25em] mb-1">Available Balance</p>
                        <div className="flex items-center justify-center gap-1.5">
                            <span className="text-indigo-400/70 font-mono text-xl">₹</span>
                            <div className="text-4xl font-mono font-black text-white tracking-tighter flex items-center">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={user.balance}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="inline-block"
                                    >
                                        {user.balance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>

                    {/* User Profile & Logout */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-5"
                    >
                        {/* ONLY User Name */}
                        <div className="hidden lg:flex items-center pr-5 border-r border-white/10">
                            <span className="text-sm font-bold text-zinc-400"> <span className="text-zinc-100">{user.name}</span></span>
                        </div>
                        <button
                            onClick={logout}
                            className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-[0_4px_12px_rgba(239,68,68,0.2)] group"
                            title="Sign Out"
                        >
                            <LogOut size={20} className="group-active:scale-95 transition-transform" />
                        </button>
                    </motion.div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-16 space-y-24 relative z-10">

                {/* --- TRANSFER HERO SECTION --- */}
                <section className="flex justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-full max-w-xl"
                    >
                        <div className="bg-[#09090b]/80 backdrop-blur-xl border border-white/[0.08] rounded-[2rem] p-1 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] relative">
                            <div className="bg-[#0c0c0e] rounded-[1.9rem] p-8 relative overflow-hidden">
                                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                            <ArrowRightLeft size={18} className="text-indigo-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white">Send Assets</h2>
                                            <p className="text-xs text-zinc-500 font-medium mt-0.5">Secure peer-to-peer network</p>
                                        </div>
                                    </div>
                                    <Activity size={20} className="text-zinc-600" />
                                </div>

                                <div className="mt-4">
                                    <TransferForm />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* --- TRANSACTION SECTION --- */}
                <section className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="px-1"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <History className="text-indigo-400" size={20} />
                            <h3 className="text-xl font-bold text-white tracking-tight">Vault Ledger</h3>
                        </div>
                    </motion.div>

                    {/* Table Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#09090b]/80 backdrop-blur-xl border border-white/[0.08] rounded-3xl overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] relative"
                    >
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        <div className="p-2 sm:p-4 min-h-[400px]">
                            <TransactionTable
                                transactions={transactions}
                                isLoading={isInitialLoading}
                                currentUserId={user.id}
                            />

                            {/* Empty State Handle */}
                            {!isInitialLoading && transactions.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mb-4">
                                        <History size={24} className="text-zinc-600" />
                                    </div>
                                    <h4 className="text-zinc-300 font-semibold">No records found</h4>
                                    <p className="text-zinc-500 text-sm mt-1">You haven't made any transactions yet.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </section>
            </main>

            <footer className="py-12 border-t border-white/[0.02] mt-12 relative z-10">
                <div className="flex justify-center items-center gap-2 text-[10px] text-zinc-600 font-bold uppercase tracking-[0.4em]">
                    <div className="w-1 h-1 rounded-full bg-indigo-500/50" />
                    PayVault Node • v2.1.0
                    <div className="w-1 h-1 rounded-full bg-indigo-500/50" />
                </div>
            </footer>
        </div>
    );
};