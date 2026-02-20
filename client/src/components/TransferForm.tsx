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
            setMessage('Funds sent successfully!');
            setEmail('');
            setAmount('');

            setTimeout(() => {
                setStatus('idle');
                setMessage('');
            }, 3000);
        } catch (error: any) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Transfer failed');
        }
    };

    return (
        <div className="glass p-8 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <Send className="text-primary" size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">Send Money</h3>
            </div>

            <form onSubmit={handleTransfer} className="space-y-4">
                <div className="input-group">
                    <div className="input-icon">
                        <Mail size={16} />
                    </div>
                    <input
                        type="email"
                        placeholder="Receiver's Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="input-field"
                    />
                </div>

                <div className="input-group">
                    <div className="input-icon">
                        <DollarSign size={16} />
                    </div>
                    <input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        min="0.01"
                        step="0.01"
                        className="input-field"
                    />
                </div>

                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={status === 'loading'}
                    type="submit"
                    className={`btn-primary w-full flex items-center justify-center gap-2 ${status === 'success' ? 'bg-green-500' :
                            status === 'error' ? 'bg-red-500' : ''
                        }`}
                >
                    {status === 'loading' ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : status === 'success' ? (
                        <CheckCircle2 size={20} />
                    ) : status === 'error' ? (
                        <AlertCircle size={20} />
                    ) : (
                        <>
                            <span>Transfer Now</span>
                            <Send size={18} />
                        </>
                    )}
                </motion.button>

                <AnimatePresence>
                    {message && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`text-center text-xs font-semibold mt-2 ${status === 'success' ? 'text-success' : 'text-error'
                                }`}
                        >
                            {message}
                        </motion.p>
                    )}
                </AnimatePresence>
            </form>
        </div>
    );
};
