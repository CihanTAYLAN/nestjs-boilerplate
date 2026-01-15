# 🚀 NestJS Boilerplate - Production Ready Base

A comprehensive, production-ready **NestJS** boilerplate designed with best practices, scalability, and developer experience in mind. This base project comes pre-configured with essential tools and modules to kickstart your backend development.

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Biome](https://img.shields.io/badge/Biome-60A5FA?style=for-the-badge&logo=biome&logoColor=white)](https://biomejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## ✨ Features

- **⚡ Modern Tech Stack**: NestJS 11, Prisma ORM, and PostgreSQL.
- **🛡️ Secure Authentication**: JWT-based auth with Access & Refresh tokens, Passport integration.
- **🏗️ Database Management**: Prisma with **multi-file schema support**, migrations, and seeding.
- **🚀 Advanced Tooling**: [Biome](https://biomejs.dev/) for blazing fast linting and formatting.
- **📧 Email System**: Handlebars templating with Layouts and Partials support.
- **📬 Task Queue**: BullMQ (Redis-backed) for background processing.
- **🚦 Security & Resilience**: 
  - Advanced multi-level Rate Limiting (Burst, Minute, Hour, Day defense).
  - Global Exception Filter for standardized error responses.
  - Response Transformation Interceptors for consistent API output.
  - Audit Log system integrated via global interceptors.
- **📜 Logging & Auditing**: Integrated Audit Log system for tracking administrative actions.
- **🐳 Docker Ready**: Multi-stage Dockerfile for development and production.
- **🛠️ Utility Driven**: 
  - CLI commands for quick tasks.
  - Global filters, interceptors, and decorators.
  - Custom router for flexible route management.

---

## 🛠️ Project Structure

```text
src/
├── common/             # Global decorators, guards, interceptors, types, and DTOs
│   ├── decorators/     # Custom NestJS decorators (e.g., @CurrentUser)
│   ├── email/          # Email service with Handlebars templates (layouts/partials)
│   ├── guards/         # Auth, Roles, and API Key guards
│   └── interceptors/   # Response transformation and logging
├── config/             # Configuration management (dotenv, validation)
├── database/           # Prisma service and database-related logic
├── modules/            # Business logic organized by domain
│   ├── auth/           # Authentication & Authorization
│   ├── api-doc/        # Swagger UI configuration
│   └── shared/         # Shared modules (Cache, Queue, Audit Logs)
└── main.ts             # Application entry point
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js >= 16.0.0
- Yarn or NPM
- PostgreSQL and Redis instances

### 2. Installation
```bash
git clone https://github.com/your-username/nestjs-boilerplate.git
cd nestjs-boilerplate
yarn install
```

### 3. Environment Setup
Copy the example environment file and update your credentials:
```bash
cp .env.example .env
```

### 4. Database Setup
Generate Prisma client and push the schema to your database:
```bash
yarn db:generate
yarn db:push
```
*(Optional) Run seeds:*
```bash
yarn db:seed
```

### 5. Run the Application
```bash
# Development
yarn start:dev

# Production build
yarn build
yarn start:prod
```

---

## 📖 Essential Commands

| Command | Description |
| :--- | :--- |
| `yarn build` | Build the project for production |
| `yarn start:dev` | Start the development server with hot-reload |
| `yarn lint` | Lint and fix code using Biome |
| `yarn format` | Format code using Biome |
| `yarn db:generate` | Generate Prisma client |
| `yarn db:push` | Sync Prisma schema with database |
| `yarn db:view` | Open Prisma Studio |
| `yarn test` | Run unit tests |

---

## 🔒 Security & Documentation

- **Swagger API Docs**: Accessible at `/api-docs` (Protected by Basic Auth - see `.env` for credentials).
- **Rate Limiting**: Configured globally via `ThrottlerModule`.
- **Validation**: Strict input validation using `class-validator` and `class-transformer`.

---

## 📄 License

This project is [UNLICENSED](LICENSE) by default. Feel free to modify the `package.json` license field for your own use.
