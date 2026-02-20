import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, ChevronUp, ChevronDown, Clock } from 'lucide-react';
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

    const handleSort = (field: 'timestamp' | 'amount') => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const sortedTransactions = [...transactions].sort((a, b) => {
        const factor = sortOrder === 'asc' ? 1 : -1;
        if (sortField === 'timestamp') {
            return (new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) * factor;
        }
        return (a.amount - b.amount) * factor;
    });

    if (isLoading) {
        return (
            <div className="p-12 flex flex-col items-center justify-center gap-4 text-muted">
                <div className="w-10 h-10 border-2 border-white/10 border-t-primary rounded-full animate-spin" />
                <p className="text-sm">Fetching transactions...</p>
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="p-12 text-center text-muted">
                <div className="inline-flex p-4 rounded-full bg-white/5 mb-4">
                    <Clock size={32} className="opacity-40" />
                </div>
                <p className="text-sm font-medium">No activity yet</p>
                <p className="text-xs mt-1">When you send or receive funds, they'll appear here.</p>
            </div>
        );
    }

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th className="cursor-pointer group" onClick={() => handleSort('timestamp')}>
                            <div className="flex items-center gap-2">
                                Date
                                <span className={`${sortField === 'timestamp' ? 'text-primary' : 'opacity-0 group-hover:opacity-100'} transition-all`}>
                                    {sortField === 'timestamp' && sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </span>
                            </div>
                        </th>
                        <th>Activity</th>
                        <th className="text-right cursor-pointer group" onClick={() => handleSort('amount')}>
                            <div className="flex items-center justify-end gap-2">
                                Amount
                                <span className={`${sortField === 'amount' ? 'text-primary' : 'opacity-0 group-hover:opacity-100'} transition-all`}>
                                    {sortField === 'amount' && sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </span>
                            </div>
                        </th>
                        <th className="text-center">Status</th>
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
                                >
                                    <td className="text-muted whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-white font-medium">
                                                {new Date(tx.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                            </span>
                                            <span className="text-[10px] uppercase tracking-wider">
                                                {new Date(tx.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg flex items-center justify-center ${isOutgoing ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
                                                {isOutgoing ? <ArrowUpRight className="text-red-400" size={16} /> : <ArrowDownLeft className="text-green-400" size={16} />}
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="font-semibold text-white">
                                                    {isOutgoing ? `To ${tx.receiver.name}` : `From ${tx.sender.name}`}
                                                </p>
                                                <p className="text-xs text-muted">
                                                    {isOutgoing ? tx.receiver.email : tx.sender.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={`text-right font-bold tabular-nums ${isOutgoing ? 'text-red-400' : 'text-green-400'}`}>
                                        {isOutgoing ? '-' : '+'}${tx.amount.toFixed(2)}
                                    </td>
                                    <td>
                                        <div className="flex justify-center">
                                            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${tx.status === 'SUCCESS' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
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
    );
};
