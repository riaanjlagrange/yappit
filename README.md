# Yappit

![Logo](./logo.svg)

Yappit is a full-stack social media application inspired by Reddit, featuring posts, comments, voting, and user profiles. This project is built as a monorepo using `pnpm` workspaces, with a React frontend and a Node.js/Express backend.

## Tech Stack

- **Monorepo:** `pnpm` workspaces
- **Containerization:** Docker, Docker Compose
- **Frontend:**
  - React (with Vite)
  - React Router
  - Axios
- **Backend:**
  - Node.js & Express.js
  - Prisma ORM
  - PostgreSQL
- **Authentication:** JWT (Access & Refresh Tokens)
- **File Storage:** AWS S3 for user profile pictures

## Features

- Full user authentication (registration, login, secure routes)
- Create, read, update, and delete posts
- Comment on posts
- Vote on posts
- User profiles with custom profile picture uploads
- Admin panel for user management

---

## Project Structure

The project is a monorepo managed by `pnpm`.

- `api/`: Contains the Node.js/Express backend API.
- `client/`: Contains the React frontend application.

Each directory is a self-contained application with its own `package.json`.

---

## Getting Started

You can run this project in two ways: using Docker (recommended for a quick setup) or by running the services manually on your local machine.

### Option 1: Running with Docker (Recommended)

This is the fastest and most reliable way to get the entire application stack running.

#### Prerequisites

- Docker
- Docker Compose

#### 1. Configure Environment

The application stack is configured using a single `.env` file in the project root.

```bash
# Copy the example file
cp .env.example .env
```

Now, open the `.env` file and fill in the required variables:

- **PostgreSQL Credentials:**
  - `POSTGRES_USER`: Desired username for the database.
  - `POSTGRES_PASSWORD`: Desired password for the database.
  - `POSTGRES_DB`: Desired name for the database.
- **Database URL (for Prisma):**
  - `DATABASE_URL`: The connection string. **This must match the PostgreSQL credentials above and point to the Docker service name.** Format: `postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@postgres:5432/<POSTGRES_DB>`
- **JWT Secrets:**
  - `JWT_SECRET`: A long, random string for signing access tokens.
  - `REFRESH_TOKEN_SECRET`: A long, random string for signing refresh tokens.
- **AWS S3 for File Uploads:**
  - `AWS_ACCESS_KEY_ID`: Your AWS access key.
  - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key.
  - `AWS_REGION`: The region where your S3 bucket is located.
  - `AWS_S3_BUCKET_NAME`: The name of your S3 bucket.
  - `SENTRY_AUTH_TOKEN=`: Your sentry token.

#### 2. Build and Run

With Docker running, execute the following command from the project root:

```bash
docker-compose up --build -d
```

This command will:
1.  Build the `api` and `client` images.
2.  Start the `postgres`, `api`, and `client` containers in detached mode.
3.  The `api` service will automatically run database migrations and seed the database on its first startup.

The application will be available at the following locations:
- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:3000`

#### 3. Stopping the Application

To stop the containers, run: `docker-compose down`

---

### Option 2: Running Manually with pnpm

If you prefer to run the services directly on your local machine.

#### Prerequisites

- Node.js (v20 or later)
- `pnpm`
- A running PostgreSQL instance
- An AWS S3 bucket

#### 1. Install Dependencies

```bash
# From the project root
pnpm install
```

#### 2. Configure Environment Variables

For manual development, you need to set up environment variables for both the `api` and `client`.

**For the backend:**

```bash
# Create a .env file in the /api directory
cp .env.example api/.env
```

Open `api/.env` and fill in the variables. **Important:** Your `DATABASE_URL` must point to your local PostgreSQL instance (e.g., `postgresql://user:password@localhost:5432/yappit`).

**For the frontend:**

The frontend uses Vite, which proxies API requests. By default, it will proxy requests to `http://localhost:3000`. If your API is running elsewhere, you can create a `.env` file in the `client` directory:

```bash
# In the /client directory
touch .env
```

Open `client/.env` and add the following variable:
`VITE_API_URL=http://your-api-url:3000`
`SENTRY_AUTH_TOKEN=`

#### 3. Set Up Database

From the root directory, run the following command to apply migrations and seed the database:

```bash
pnpm db:setup
```

#### 4. Run the Development Servers

This command will start both the frontend and backend servers concurrently.

```bash
# From the project root
pnpm dev
```

- **Frontend:** `http://localhost:5173`
- **Backend API:** `http://localhost:3000`

---

## Useful Commands

These commands should be run from the root of the project.

- `pnpm lint`: Lints the code in both the `api` and `client` directories.
- `pnpm lint:fix`: Automatically fixes linting issues.
- `pnpm format`: Formats all code with Prettier.
- `pnpm db:setup`: A convenience script that runs database migrations and seeding.
- `pnpm db:reset`: Resets the database (WARNING: This will delete all data).
