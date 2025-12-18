# Yappit

A full-stack blog application built with a React frontend and a Node.js/Express backend, all managed within a `pnpm` monorepo.

## Tech Stack

- **Frontend:**
  - React
  - Vite
  - React Router for navigation
  - Axios for API communication
- **Backend:**
  - Node.js
  - Express.js
  - Prisma ORM
  - PostgreSQL database
  - JWT for authentication
  - AWS S3 for file storage
- **Monorepo:**
  - pnpm workspaces

## Features

- User authentication (registration and login)
- Create, read, update, and delete posts
- Comment on posts
- User profiles
- Admin panel for managing users and comments
- Voting system for posts and comments

## Project Structure

The project is a monorepo managed by `pnpm`.

- `client/`: Contains the React frontend application.
- `server/`: Contains the Node.js/Express backend API.

Each directory is its own self-contained application with its own `package.json` file.

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- pnpm
- PostgreSQL
- An AWS account and an S3 bucket for file uploads

### 1. Initial Setup

To set up the project for the first time, including installing dependencies, configuring environment variables, and setting up the database, run:

```bash
git clone git@github.com:riaanjlagrange/yappit.git
cd yappit
pnpm run setup
```

**Environment Variables:**
After cloning, you must configure the environment variables for the backend. Copy the example file and fill in the required values:

```bash
cp .env.example server/.env
```

You will need to provide values for:

- `DATABASE_URL`: Your PostgreSQL connection string.
- `JWT_SECRET`: A secret key for signing JWTs.
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET_NAME`: Your AWS credentials for S3 file uploads.

### 2. Running the Application

To start both the frontend and backend development servers concurrently, run the following command from the root directory:

```bash
pnpm dev
```

- The React application will be available at `http://localhost:5173`.
- The Express API will be running on `http://localhost:3000`.

## Other Useful Commands

- **Linting:**
  `pnpm lint` - Runs ESLint on client and server code.
  `pnpm lint:fix` - Runs ESLint and automatically fixes fixable issues.

- **Formatting:**
  `pnpm format` - Formats code using Prettier.

- **Database:**
  `pnpm db:reset` - Resets the database (WARNING: This will delete all data).
