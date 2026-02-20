import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, ChevronUp, ChevronDown, Clock, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Transaction {
    id: string;
    timestamp: string;
    sender: { name: string; id: string; email: string };
    receiver: { name: string; id: string; email: string };
    amount: number;
    status: string;
}

interface Props {
    transactions: Transaction[];
    currentUserId: string;
    isLoading?: boolean;
}

export const TransactionTable: React.FC<Props> = ({ transactions, currentUserId, isLoading }) => {
    const [sortField, setSortField] = useState<'timestamp' | 'amount'>('timestamp');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [searchTerm, setSearchTerm] = useState('');

    const handleSort = (field: 'timestamp' | 'amount') => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const filteredTransactions = transactions.filter(tx =>
        tx.sender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.receiver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.sender.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.receiver.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
        const factor = sortOrder === 'asc' ? 1 : -1;
        if (sortField === 'timestamp') {
            return (new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) * factor;
        }
        return (a.amount - b.amount) * factor;
    });

    if (isLoading) {
        return (
            <div className="p-20 flex flex-col items-center justify-center gap-5 text-muted">
                <div className="w-14 h-14 border-4 border-white/5 border-t-primary rounded-full animate-spin shadow-lg" />
                <p className="text-sm font-bold tracking-widest uppercase opacity-60">Synchronizing Vault...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="input-group max-w-sm ml-auto">
                <div className="input-icon">
                    <Search size={16} />
                </div>
                <input
                    type="text"
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field !py-2 !pl-10 !text-xs !bg-white/5 border-white/10"
                />
            </div>

            {transactions.length === 0 ? (
                <div className="py-24 text-center text-muted">
                    <div className="inline-flex p-6 rounded-3xl bg-white/5 mb-6 border border-white/5 shadow-inner">
                        <Clock size={48} className="opacity-20" />
                    </div>
                    <p className="text-lg font-bold text-white tracking-tight">No Transactions Found</p>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="cursor-pointer group select-none" onClick={() => handleSort('timestamp')}>
                                    <div className="flex items-center gap-2">
                                        Timestamp
                                        <span className={`${sortField === 'timestamp' ? 'text-primary' : 'opacity-0 group-hover:opacity-100'} transition-all`}>
                                            {sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        </span>
                                    </div>
                                </th>
                                <th>Movement Detail</th>
                                <th className="text-right cursor-pointer group select-none" onClick={() => handleSort('amount')}>
                                    <div className="flex items-center justify-end gap-2">
                                        Amount
                                        <span className={`${sortField === 'amount' ? 'text-primary' : 'opacity-0 group-hover:opacity-100'} transition-all`}>
                                            {sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        </span>
                                    </div>
                                </th>
                                <th className="text-center">Verification</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence initial={false}>
                                {sortedTransactions.map((tx) => {
                                    const isOutgoing = tx.sender.id === currentUserId;
                                    return (
                                        <motion.tr
                                            layout
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            key={tx.id}
                                            className="group"
                                        >
                                            <td className="whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold tracking-tight">
                                                        {new Date(tx.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                    <span className="text-[10px] text-muted font-bold uppercase tracking-wider opacity-60">
                                                        {new Date(tx.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 ${isOutgoing ? 'bg-red-500/10 border border-red-500/10' : 'bg-green-500/10 border border-green-500/10'
                                                        }`}>
                                                        {isOutgoing ? <ArrowUpRight className="text-red-400" size={18} /> : <ArrowDownLeft className="text-green-400" size={18} />}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <p className="font-bold text-white tracking-tight">
                                                            {isOutgoing ? `Debit: ${tx.receiver.name}` : `Credit: ${tx.sender.name}`}
                                                        </p>
                                                        <p className="text-[11px] text-muted font-medium opacity-60 italic">
                                                            ID: {tx.id.split('-')[0].toUpperCase()} • {isOutgoing ? tx.receiver.email : tx.sender.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`text-right font-black text-lg tabular-nums ${isOutgoing ? 'text-red-400' : 'text-green-400'}`}>
                                                <div className="flex items-center justify-end gap-1">
                                                    <span className="text-xs opacity-50 font-bold">{isOutgoing ? '-' : '+'}</span>
                                                    <span>₹{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex justify-center">
                                                    <span className={`status-pill ${tx.status === 'SUCCESS'
                                                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                                                        }`}>
                                                        {tx.status}
                                                    </span>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
