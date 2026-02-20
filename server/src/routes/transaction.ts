import express from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { io } from '../index';

const router = express.Router();

// POST /transfer - Transfer funds within a database transaction
router.post('/transfer', authenticateToken, async (req: AuthRequest, res) => {
    const { receiverEmail, amount } = req.body;
    const senderId = req.user?.id;

    if (!senderId || !receiverEmail || amount <= 0) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    try {
        const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // 1. Check sender balance
            const sender = await tx.user.findUnique({ where: { id: senderId } });
            if (!sender || sender.balance < amount) {
                throw new Error('Insufficient balance');
            }

            // 2. Find receiver
            const receiver = await tx.user.findUnique({ where: { email: receiverEmail } });
            if (!receiver) {
                throw new Error('Receiver not found');
            }

            if (sender.id === receiver.id) {
                throw new Error('Cannot transfer to self');
            }

            // 3. Deduct from sender
            const updatedSender = await tx.user.update({
                where: { id: senderId },
                data: { balance: { decrement: amount } },
            });

            // 4. Credit to receiver
            const updatedReceiver = await tx.user.update({
                where: { id: receiver.id },
                data: { balance: { increment: amount } },
            });

            // 5. Create Transaction record
            const transaction = await tx.transaction.create({
                data: {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    amount,
                    status: 'SUCCESS',
                },
            });

            // 6. Create Audit Log record
            await tx.auditLog.create({
                data: {
                    transactionId: transaction.id,
                    senderId: sender.id,
                    receiverId: receiver.id,
                    amount,
                    status: 'SUCCESS',
                },
            });

            return { updatedSender, updatedReceiver, transaction };
        });

        // Notify clients via Socket.io
        io.to(result.updatedSender.id).emit('balanceUpdate', result.updatedSender.balance);
        io.to(result.updatedReceiver.id).emit('balanceUpdate', result.updatedReceiver.balance);

        // Notify about new transaction entry
        io.to(result.updatedSender.id).emit('newTransaction', result.transaction);
        io.to(result.updatedReceiver.id).emit('newTransaction', result.transaction);

        res.json({ message: 'Transfer successful', balance: result.updatedSender.balance });
    } catch (error: any) {
        // Audit failed transaction (asynchronously/separately)
        try {
            const receiver = await prisma.user.findUnique({ where: { email: receiverEmail } });
            await prisma.auditLog.create({
                data: {
                    senderId,
                    receiverId: receiver ? receiver.id : 'UNKNOWN',
                    amount,
                    status: 'FAILED: ' + error.message,
                },
            });
        } catch (auditError) {
            console.error('Failed to log failed transaction:', auditError);
        }

        res.status(400).json({ message: error.message || 'Transfer failed' });
    }
});

// GET /history - Fetch transaction history for a specific user
router.get('/history', authenticateToken, async (req: AuthRequest, res) => {
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const history = await prisma.transaction.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId },
                ],
            },
            include: {
                sender: { select: { id: true, name: true, email: true } },
                receiver: { select: { id: true, name: true, email: true } },
            },
            orderBy: { timestamp: 'desc' },
        });

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching history' });
    }
});

// GET /profile - Get current user profile
router.get('/profile', authenticateToken, async (req: AuthRequest, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, name: true, balance: true },
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
});

export default router;
