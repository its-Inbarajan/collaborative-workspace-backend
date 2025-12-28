# Purple Merit

Backend service for a collaborative workspace platform, built as part of a technical assessment.
The system demonstrates API-first design, authentication, role-based access, real-time collaboration, asynchronous processing, and proper backend architecture.

## Overview

Collaborative workspace full-featured backend service for collaborative workspaces with authentication, OAuth integration, WebSocket support, job queuing, and API documentation.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5.2
- **Database**: PostgreSQL with pg driver
- **Authentication**: JWT + Passport.js (Google OAuth 2.0)
- **Real-time**: Socket.io 4.8
- **Job Queue**: BullMQ 5.66 with Redis
- **Caching**: Redis & ioredis 5.8
- **API Docs**: Swagger UI Express
- **Validation**: Zod
- **Password Hashing**: bcrypt
- **HTTP Utilities**: CORS, Morgan (logging)
- **Code Quality**: ESLint, Prettier, Husky, lint-staged
- **Testing**: Jest + Supertest
- **Docker** : Docker Compose


## Features

- User authentication & registration with JWT
- Google OAuth 2.0 integration with token refresh
- Rate limiting on auth endpoints
- Real-time WebSocket communication via Socket.io
- Async job processing with BullMQ queues
- PostgreSQL database integration
- API documentation with Swagger UI
- Pre-commit hooks with ESLint & automated tests
- Password hashing with bcrypt
- Request logging with Morgan
- Input validation with Zod
- CORS support

Note:
The current implementation uses Redis Pub/Sub for event distribution.
Socket.IO Redis adapter can be introduced to synchronize rooms when scaling to multiple Node.js instances.

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- Redis

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file in the root directory with required variables:

```
DATABASE_URL=postgresql://user:password@localhost:5432/purple_merit
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:3000
```

### Development

```bash
npm run dev
```

Starts the server with hot-reload using ts-node-dev.

### Build

```bash
npm run build
```
## Docker Setup

### Prerequisites

- Docker
- Docker Compose

### Running with Docker

1. **Create a `.env` file** in the root directory:

```
DATABASE_URL=postgresql://postgres:postgres@db:5432/collaborative-workspace
REDIS_URL=redis://redis:6379
JWT_SECRET=your_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
PORT=3000
```

2. **Build and start containers**:

```bash
docker-compose up --build
```

This will start:
- **Node.js API**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **Swagger UI**: http://localhost:3000/api-docs

3. **Stop containers**:

```bash
docker-compose down
```

4. **View logs**:

```bash
docker-compose logs -f app
```

5. **Run migrations** (if applicable):

```bash
docker-compose exec app npm run migrate
```

### Docker Compose Configuration

Ensure you have a `docker-compose.yml` file in your root directory with PostgreSQL and Redis services defined.

### Local Development (Without Docker)

```bash
npm install
npm run dev
```

Make sure PostgreSQL and Redis are running locally on their default ports.

Compiles TypeScript to JavaScript in the `dist/` folder.

### Production

```bash
npm start
```

Runs the compiled server from `dist/server.js`.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run production server |
| `npm test` | Run Jest test suite |
| `npm run lint` | Check code with ESLint (max-warnings=0) |
| `npm run lint:fix` | Fix ESLint issues automatically |
| `npm run format` | Format code with Prettier |
| `npm run prepare` | Install Husky git hooks |
| `npm run precommit` | Run lint & tests (auto-runs via Husky) |

## Project Structure

```
src/
├── auth/              # Authentication routes & controllers
├── common/            # Shared utilities (rate limiting, etc.)
├── config/            # Configuration files
├── server.ts          # Entry point
└── ...
dist/                 # Compiled JavaScript output
```

## API Documentation

Once the server is running, access Swagger UI documentation at:
```
http://localhost:3000/api-docs
```

## Authentication

### Local Auth
- **POST** `/auth/register` - Register new user
- **POST** `/auth/login` - Login user (rate-limited)
- 
### OAuth
- **GET** `/auth/oauth/google` - Initiate Google OAuth flow
- **GET** `/auth/oauth/google/callback` - Google OAuth callback handler

### User
- **GET** `/auth/me` - Get authenticated user profile (requires JWT)
- **POST** `/auth/refresh` - Refresh access token (rate-limited)

## Code Quality

- **Linting**: ESLint with TypeScript support (max-warnings=0)
- **Formatting**: Prettier
- **Pre-commit Hooks**: Husky + lint-staged (auto-runs ESLint & Jest on commit)
- **Testing**: Jest with Supertest for API testing

## Database

- **PostgreSQL**: Primary data storage
- **Redis**: Session caching & BullMQ job queue backing store

## Queue System

BullMQ integration for asynchronous job processing with Redis as the message broker.
