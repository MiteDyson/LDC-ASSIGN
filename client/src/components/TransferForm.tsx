import React, { useState } from 'react';
import axios from 'axios';
import { Mail, DollarSign, Loader2, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
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
            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/transfer`, {
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
        <>
            {/* MANUAL CSS BLOCK - Bypasses Tailwind completely */}
            <style>
                {`
                    .tf-form {
                        display: flex;
                        flex-direction: column;
                        position: relative;
                        width: 100%;
                        font-family: inherit;
                    }
                    .tf-input-group {
                        position: relative;
                        margin-bottom: 1.25rem;
                    }
                    .tf-icon {
                        position: absolute;
                        left: 1rem;
                        top: 50%;
                        transform: translateY(-50%);
                        color: #71717a;
                        transition: color 0.3s ease;
                        pointer-events: none;
                    }
                    .tf-input {
                        width: 100%;
                        box-sizing: border-box;
                        background-color: #030303;
                        border: 1px solid rgba(255, 255, 255, 0.05);
                        border-radius: 1rem;
                        padding: 1.125rem 1rem 1.125rem 3rem;
                        font-size: 0.875rem;
                        color: white;
                        outline: none;
                        transition: all 0.3s ease;
                        box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
                    }
                    .tf-input::placeholder {
                        color: #52525b;
                    }
                    .tf-input:hover {
                        border-color: rgba(255, 255, 255, 0.12);
                    }
                    .tf-input:focus {
                        border-color: rgba(99, 102, 241, 0.4);
                        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2), inset 0 2px 4px rgba(0,0,0,0.3);
                    }
                    .tf-input-group:focus-within .tf-icon {
                        color: #818cf8;
                    }
                    .tf-currency-badge {
                        position: absolute;
                        right: 1rem;
                        top: 50%;
                        transform: translateY(-50%);
                        display: flex;
                        align-items: center;
                        gap: 0.375rem;
                        padding: 0.375rem 0.5rem;
                        border-radius: 0.5rem;
                        background-color: rgba(255, 255, 255, 0.03);
                        border: 1px solid rgba(255, 255, 255, 0.05);
                        font-size: 0.625rem;
                        font-weight: 900;
                        color: #a1a1aa;
                        text-transform: uppercase;
                        letter-spacing: 0.1em;
                        pointer-events: none;
                        transition: border-color 0.3s ease;
                    }
                    .tf-input-group:focus-within .tf-currency-badge {
                        border-color: rgba(99, 102, 241, 0.2);
                    }
                    .tf-submit-btn {
                        margin-top: 2.5rem;
                        width: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.75rem;
                        height: 3.5rem;
                        border-radius: 1rem;
                        font-weight: bold;
                        transition: all 0.5s ease;
                        cursor: pointer;
                        border: none;
                        outline: none;
                    }
                    .tf-submit-btn:disabled {
                        cursor: not-allowed;
                        opacity: 0.8;
                    }
                    .tf-btn-idle {
                        background-color: #4f46e5;
                        color: white;
                        box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4);
                    }
                    .tf-btn-idle:hover {
                        background-color: #6366f1;
                    }
                    .tf-btn-success {
                        background-color: rgba(16, 185, 129, 0.1);
                        color: #34d399;
                        border: 1px solid rgba(16, 185, 129, 0.2);
                        box-shadow: 0 0 30px rgba(16, 185, 129, 0.15);
                    }
                    .tf-btn-error {
                        background-color: rgba(239, 68, 68, 0.1);
                        color: #f87171;
                        border: 1px solid rgba(239, 68, 68, 0.2);
                        box-shadow: 0 0 30px rgba(239, 68, 68, 0.15);
                    }
                    .tf-alert {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.75rem;
                        padding: 1rem;
                        border-radius: 1rem;
                        width: 100%;
                        box-sizing: border-box;
                        text-align: center;
                        backdrop-filter: blur(8px);
                    }
                    .tf-alert-success {
                        background-color: rgba(16, 185, 129, 0.05);
                        border: 1px solid rgba(16, 185, 129, 0.1);
                        color: rgba(52, 211, 153, 0.9);
                        box-shadow: 0 0 20px rgba(16, 185, 129, 0.05);
                    }
                    .tf-alert-error {
                        background-color: rgba(239, 68, 68, 0.05);
                        border: 1px solid rgba(239, 68, 68, 0.1);
                        color: rgba(248, 113, 113, 0.9);
                        box-shadow: 0 0 20px rgba(239, 68, 68, 0.05);
                    }
                `}
            </style>

            <form onSubmit={handleTransfer} className="tf-form">

                {/* Email Input */}
                <div className="tf-input-group">
                    <div className="tf-icon">
                        <Mail size={18} />
                    </div>
                    <input
                        type="email"
                        placeholder="Recipient's wallet address or email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="tf-input"
                    />
                </div>

                {/* Amount Input */}
                <div className="tf-input-group" style={{ marginBottom: 0 }}>
                    <div className="tf-icon">
                        <DollarSign size={18} />
                    </div>
                    <input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        min="0.01"
                        step="0.01"
                        className="tf-input"
                        style={{ fontFamily: 'monospace', paddingRight: '4.5rem' }}
                    />
                    <div className="tf-currency-badge">
                        USD
                    </div>
                </div>

                {/* Submit Button */}
                <motion.button
                    whileHover={status === 'idle' ? { scale: 1.01, translateY: -1 } : {}}
                    whileTap={status === 'idle' ? { scale: 0.99 } : {}}
                    disabled={status === 'loading'}
                    type="submit"
                    className={`tf-submit-btn ${status === 'success' ? 'tf-btn-success' :
                            status === 'error' ? 'tf-btn-error' :
                                'tf-btn-idle'
                        }`}
                >
                    {status === 'loading' ? (
                        <>
                            <Loader2 className="animate-spin" size={18} />
                            <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>PROCESSING TRANSACTION</span>
                        </>
                    ) : status === 'success' ? (
                        <>
                            <CheckCircle2 size={20} />
                            <span>TRANSFER COMPLETE</span>
                        </>
                    ) : status === 'error' ? (
                        <>
                            <AlertCircle size={20} />
                            <span>EXECUTION FAILED</span>
                        </>
                    ) : (
                        <>
                            <span>Confirm & Execute</span>
                            <ArrowUpRight size={18} style={{ opacity: 0.7 }} />
                        </>
                    )}
                </motion.button>

                {/* Status Messages */}
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', minHeight: '3.5rem' }}>
                    <AnimatePresence mode="wait">
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className={`tf-alert ${status === 'success' ? 'tf-alert-success' : 'tf-alert-error'}`}
                            >
                                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    {message}
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </form>
        </>
    );
};