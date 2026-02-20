import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

export const useSocket = (onNewTransaction?: (transaction: any) => void) => {
    const { user, updateBalance } = useAuth();
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (user && !socketRef.current) {
            const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
            socketRef.current = socket;

            socket.on('connect', () => {
                socket.emit('join', user.id);
            });

            socket.on('balanceUpdate', (newBalance: number) => {
                updateBalance(newBalance);
            });

            socket.on('newTransaction', (transaction: any) => {
                if (onNewTransaction) onNewTransaction(transaction);
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [user, updateBalance, onNewTransaction]);

    return socketRef.current;
};
