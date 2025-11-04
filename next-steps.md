# Next Steps for Your Blog Project

This document outlines recommended steps to improve, stabilize, and prepare your project for deployment. The items are categorized by priority and area of focus.

---

## 🎯 High Priority: Pre-Deployment Fixes

These are critical issues that should be addressed before deploying the application.

- **[ ] Remove Hardcoded API URL in Frontend:**
  - **File:** `client/src/utils/api.js`
  - **Problem:** The API `baseURL` is hardcoded to `http://localhost:3000/api/`. This will fail in a production environment.
  - **Solution:** Use a relative URL (`/api/`) so the browser sends requests to the same origin that served the frontend. For production builds, you can configure a proxy in Vite or handle it with environment variables. A simple fix is to change it to:
    ```javascript
    const api = axios.create({
      baseURL: "/api/",
    });
    ```

- **[ ] Add a Production Start Script for the Server:**
  - **File:** `server/package.json`
  - **Problem:** The server only has a `dev` script using `nodemon`, which is not suitable for production.
  - **Solution:** Add a `start` script for running the server in production.
    ```json
    "scripts": {
      "dev": "nodemon index.js",
      "start": "node index.js"
    },
    ```

- **[ ] Document Environment Variables:**
  - **Problem:** The server requires environment variables (`DATABASE_URL`, AWS credentials, `PORT`, `JWT_SECRET`) which are not documented.
  - **Solution:** Create a `.env.example` file in the `server` directory listing all required variables with placeholder values. This makes setup for new developers and deployment much easier.
    ```
    # .env.example

    # Server Port
    PORT=3000

    # Database
    DATABASE_URL="postgresql://user:password@host:port/database"

    # AWS S3
    AWS_ACCESS_KEY_ID=
    AWS_SECRET_ACCESS_KEY=
    AWS_REGION=

    # Authentication
    JWT_SECRET=your-super-secret-key
    ```

---

## ❤️ Project Health & Maintainability

These improvements will make the project more robust, easier to test, and more welcoming for collaboration.

- **[ ] Write a Comprehensive README:**
  - **File:** `README.md`
  - **Problem:** The `README.md` is empty.
  - **Solution:** Add a project description, instructions on how to set up the development environment (including the `.env` file), and how to run the application.

- **[ ] Implement a Testing Strategy:**
  - **Problem:** There are no tests for either the frontend or the backend. This makes it risky to add new features or refactor existing code.
  - **Solution:**
    - **Backend:** Introduce a testing framework like **Jest** or **Mocha**. Start by writing API/integration tests for your Express routes.
    - **Frontend:** Use **Vitest** with React Testing Library to write unit and component tests for your React components.

- **[ ] Centralize Linting:**
  - **File:** `package.json` (root)
  - **Problem:** Linting can only be run from the `client` directory.
  - **Solution:** Add a root-level script to run linting across the entire project.
    ```json
    "scripts": {
      // ... other scripts
      "lint": "pnpm --filter client lint && pnpm --filter server lint"
    },
    ```
    *(This assumes you add a `lint` script to `server/package.json` as well, e.g., using ESLint).*

- **[ ] Review Prisma Migrations:**
  - **Files:** `server/prisma/migrations/*`
  - **Observation:** Some migration names like `idk_what_im_doing` and `help` suggest they might contain experimental changes.
  - **Solution:** Before you have production data, consider reviewing the schema and migrations. If the history is messy, you could squash them into a single, clean initial migration. For future migrations, use descriptive names (e.g., `add_post_categories`).

---

## 🔒 Security & Scalability

These are important for any application that will be public-facing.

- **[ ] Implement Input Validation:**
  - **Problem:** API endpoints may not be validating incoming data, which can lead to bad data in your database or security vulnerabilities.
  - **Solution:** Use a validation library like **Zod** or **express-validator** in your Express controllers to validate request bodies, params, and queries.

- **[ ] Add API Rate Limiting:**
  - **Problem:** Your API is open to abuse from single users making too many requests.
  - **Solution:** Add a rate-limiting middleware like `express-rate-limit` to your Express server to protect against brute-force attacks and denial-of-service.

- **[ ] Implement JWT Refresh Tokens:**
  - **As noted in your `ROADMAP.md`**, this is a key security improvement. Short-lived access tokens with long-lived refresh tokens reduce the risk of a stolen JWT being used for a long time.

---

## 🚀 DevOps & Deployment Pipeline

These steps will help you automate your deployment process.

- **[ ] Dockerize the Application:**
  - **Problem:** The project relies on the host machine having Node.js and pnpm installed.
  - **Solution:** Create a `Dockerfile` for the `server` and a multi-stage `Dockerfile` for the `client`. Create a `docker-compose.yml` file to orchestrate both services for easy local development. This makes your application portable and scalable.

- **[ ] Set Up a CI/CD Pipeline:**
  - **Problem:** The deployment process is manual.
  - **Solution:** Create a basic CI/CD pipeline using **GitHub Actions**.
    - **Continuous Integration (CI):** Create a workflow that triggers on pull requests to:
      1. Install dependencies (`pnpm install --frozen-lockfile`).
      2. Run linting.
      3. Run all tests.
      4. Run a production build (`pnpm --filter client build`).
    - **Continuous Deployment (CD):** Create a separate workflow that triggers on merges to the `main` branch to deploy the backend and frontend to your chosen hosting providers (e.g., Render, Vercel).

---

## ✨ Future Features

Your `ROADMAP.md` is a great guide. Based on it, here are some features that would provide high value:

- **[ ] Responsive Design:** Ensure the application is usable and looks good on mobile devices.
- **[ ] Image Uploads in Posts:** This is a common feature for blogs and would greatly enhance the user experience.
- **[ ] Password Reset via Email:** A critical feature for user account management.
