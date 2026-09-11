# Campus Lost & Found — Backend

REST API backend for the Campus Lost & Found Management System.

## Stack

- **Runtime**: Node.js (≥18)
- **Framework**: Express
- **Language**: JavaScript
- **Port**: 4000

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` as needed (defaults work out of the box for local development).

### 3. Run the server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

## API

### `GET /health`

Confirms the server is running.

**Response**

```json
{
  "status": "ok",
  "message": "Campus Lost & Found backend is running",
  "timestamp": "2026-09-11T00:00:00.000Z"
}
```

## Project Structure

```
src/
├── config/          # App configuration (future)
├── controllers/     # Route handler functions
│   └── healthController.js
├── models/          # Data models (future)
├── routes/          # Express routers
│   └── healthRoutes.js
├── services/        # Business logic (future)
└── server.js        # Entry point
```
