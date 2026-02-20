# Real-time Transaction & Audit Log System

This project implements a secure peer-to-peer fund transfer system with real-time updates and an immutable audit log.

## Project Overview
The system allows users to register, login, and transfer funds to other users via email. Every successful transfer is atomicity-guaranteed using database transactions and logged in a separate audit table. Real-time balance and history updates are achieved through Socket.io.

## Tech Stack
- **Backend**: Node.js/Express, TypeScript
- **Database**: SQLite with Prisma ORM
- **Frontend**: React, TypeScript, Vite, Lucide-React
- **Real-time**: Socket.io

## Setup/Run Instructions

### Prerequisites
- Node.js (v16+)
- npm

### 1. Backend Setup
```bash
cd server
npm install
npx prisma migrate dev --name init
npm run dev
```
The server will run on `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

## API Documentation

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST   | `/api/auth/register` | Register a new user | No |
| POST   | `/api/auth/login` | Login and get JWT token | No |
| GET    | `/api/profile` | Get current user profile | Yes |
| POST   | `/api/transfer` | Transfer funds to another user | Yes |
| GET    | `/api/history` | Get transaction history | Yes |

## Database Schema

- **User**: `id`, `email`, `password`, `name`, `balance`, `createdAt`, `updatedAt`
- **Transaction**: `id`, `senderId`, `receiverId`, `amount`, `status`, `timestamp`
- **AuditLog**: `id`, `transactionId`, `senderId`, `receiverId`, `amount`, `status`, `timestamp`

## AI Tool Usage Log

### AI-Assisted Tasks
1. **Database Transaction Boilerplate**: Generated the Prisma transaction logic for the `/transfer` endpoint, ensuring atomicity.
2. **Sortable Table Component**: Generated the initial React component for the transaction history table with multi-column sorting capabilities.
3. **Utility CSS Generation**: Generated a set of utility classes in `index.css` to match the design tokens used in components.

### Effectiveness Score: 5
**Justification**: The AI tool was extremely effective in generating boilerplate code for the database transactions and the complex sortable table logic, which would have taken much longer to write manually. It also helped in quickly creating a premium look by generating modern CSS styles.
