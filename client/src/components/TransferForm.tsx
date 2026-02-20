import React, { useState } from 'react';
import axios from 'axios';
import { Send, Mail, DollarSign, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export const TransferForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const { updateBalance } = useAuth();

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const response = await axios.post('http://localhost:5000/api/transfer', {
                receiverEmail: email,
                amount: parseFloat(amount)
            });

            updateBalance(response.data.balance);
            setStatus('success');
            setMessage('Funds successfully transferred!');
            setEmail('');
            setAmount('');

            setTimeout(() => {
                setStatus('idle');
                setMessage('');
            }, 4000);
        } catch (error: any) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Transfer failed. Check your balance.');
        }
    };

    return (
        <div className="glass p-10 rounded-3xl border-white/10 relative overflow-hidden group">
            {/* Subtle light effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-lg">
                    <Send className="text-primary" size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">Initiate Transfer</h3>
                    <p className="text-xs text-muted mt-1 uppercase tracking-widest font-semibold opacity-60">Fast & Encrypted</p>
                </div>
            </div>

            <form onSubmit={handleTransfer} className="space-y-6">
                <div className="space-y-4">
                    <div className="input-group">
                        <div className="input-icon">
                            <Mail size={18} />
                        </div>
                        <input
                            type="email"
                            placeholder="Recipient's Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>

                    <div className="input-group">
                        <div className="input-icon">
                            <DollarSign size={18} />
                        </div>
                        <input
                            type="number"
                            placeholder="Transfer Amount (USD)"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            min="0.01"
                            step="0.01"
                            className="input-field tabular-nums"
                        />
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={status === 'loading'}
                    type="submit"
                    className={`btn-primary w-full flex items-center justify-center gap-3 h-14 ${status === 'success' ? 'from-green-500 to-green-600 shadow-green-500/20' :
                            status === 'error' ? 'from-red-500 to-red-600 shadow-red-500/20' : ''
                        }`}
                >
                    {status === 'loading' ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="animate-spin" size={20} />
                            <span className="font-bold">PROCESSING...</span>
                        </div>
                    ) : status === 'success' ? (
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={22} />
                            <span className="font-bold">FUNDS SENT</span>
                        </div>
                    ) : status === 'error' ? (
                        <div className="flex items-center gap-2">
                            <AlertCircle size={22} />
                            <span className="font-bold">FAILED</span>
                        </div>
                    ) : (
                        <>
                            <span className="font-bold">Confirm Transfer</span>
                            <ArrowUpRight size={20} />
                        </>
                    )}
                </motion.button>

                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`flex items-center justify-center gap-2 p-3 rounded-xl border ${status === 'success'
                                    ? 'bg-green-500/10 border-green-500/20 text-success'
                                    : 'bg-red-500/10 border-red-500/20 text-error'
                                }`}
                        >
                            <span className="text-sm font-semibold">{message}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </div>
    );
};
