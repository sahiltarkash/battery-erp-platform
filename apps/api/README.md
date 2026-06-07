# Battery ERP API

This package provides the authentication API for the Battery ERP platform.

## Features

- User registration
- Login with JWT
- Refresh token support
- Forgot password / reset password
- Role-based access control (ADMIN, MANAGER, TECHNICIAN, CUSTOMER)
- Swagger API documentation

## Setup

1. Copy `.env.example` to `.env`.
2. Install dependencies from `apps/api`:
   ```bash
   cd apps/api
   npm install
   ```
3. Generate Prisma client and migrate:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```
4. Start the API:
   ```bash
   npm run dev
   ```

## API docs

After startup, visit `http://localhost:4000/api/docs` to explore Swagger documentation.
