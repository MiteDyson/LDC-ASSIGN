import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoginPage: React.FC = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            if (isRegister) {
                const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, { email, password, name });
                login(response.data.token, response.data.user);
            } else {
                const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, { email, password });
                login(response.data.token, response.data.user);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full glass p-8 md:p-10 rounded-xl relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-[80px] opacity-20" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary rounded-full blur-[80px] opacity-20" />

                <div className="relative">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold tracking-tight">
                            <span className="gradient-text">
                                {isRegister ? 'Join Us' : 'Welcome Back'}
                            </span>
                        </h2>
                        <p className="mt-3 text-muted text-sm">
                            {isRegister ? 'Create your secure account to start' : 'Sign in to manage your transfers'}
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-3 text-xs text-center rounded-md bg-red-400/10 border border-red-400/20 text-error"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-4">
                            <AnimatePresence>
                                {isRegister && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        className="input-group"
                                    >
                                        <div className="input-icon">
                                            <UserIcon size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            className="input-field"
                                            placeholder="Full Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="input-group">
                                <div className="input-icon">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="input-field"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="input-group">
                                <div className="input-icon">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="input-field"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            disabled={isSubmitting}
                            type="submit"
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {isRegister ? 'Create Account' : 'Sign In'}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <span className="text-muted">
                            {isRegister ? 'Already have an account?' : "Don't have an account?"}
                        </span>{' '}
                        <button
                            onClick={() => setIsRegister(!isRegister)}
                            className="btn-link"
                        >
                            {isRegister ? 'Sign in' : 'Register now'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
