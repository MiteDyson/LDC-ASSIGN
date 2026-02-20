# PayVault - Real-time Transaction & Audit System

PayVault is a premium, real-time banking dashboard with ultra-smooth animations, glassmorphic UI, and instant transaction processing.

## Features

- **Premium UI/UX**: High-end glassmorphism design with `framer-motion` animations.
- **Real-time Updates**: Instant balance and history updates via `Socket.io`.
- **Frictionless Flow**: Immediate auto-login after registration.
- **Secure Transactions**: Atomic database transactions for fund transfers.
- **Audit Logging**: Comprehensive logs for all system activities.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, Prisma ORM, Socket.io.
- **Database**: PostgreSQL (Neon DB).

## Getting Started

### Prerequisites

- Node.js installed.
- A Neon DB account (PostgreSQL).

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/MiteDyson/LDC-ASSIGN.git
   cd LDC-ASSIGN
   ```

2. **Setup the Backend**:
   - Go to the `server` folder.
   - Install dependencies: `npm install`
   - Create a `.env` file based on the example below:
     ```env
     DATABASE_URL="your_neon_db_connection_string"
     JWT_SECRET="your_secret_key"
     PORT=5000
     ```
   - Initialize the database: `npx prisma migrate dev`

3. **Setup the Frontend**:
   - Go to the `client` folder.
   - Install dependencies: `npm install`
   - Run the development server: `npm run dev`

4. **Launch Application**:
   - Start the backend: `npm run dev` (inside `server`)
   - Start the frontend: `npm run dev` (inside `client`)

## License

MIT
