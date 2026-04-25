# SchoolOS Global

A comprehensive, multi-tenant school management system designed to digitize and streamline all school operations — from student enrollment to fee tracking, attendance, and examinations.

## Tech Stack

| Layer         | Technology                          |
| ------------- | ----------------------------------- |
| Framework     | Next.js 16 (App Router, TypeScript) |
| Styling       | Tailwind CSS v4                     |
| Database      | PostgreSQL via Neon (serverless)    |
| ORM           | Prisma                              |
| Auth          | NextAuth v5 (Credentials + JWT)     |
| Validation    | Zod + React Hook Form               |
| State         | TanStack React Query                |
| UI Icons      | Lucide React                        |
| Notifications | Sonner                              |

## Features

- **Multi-School Architecture** — Every entity is scoped to a `schoolId`, supporting multiple schools from a single deployment.
- **Role-Based Access Control** — Admin, Teacher, and Staff roles baked into the JWT session.
- **Class Management** — Create classes with sections, capacity limits, and academic year assignments.
- **Student Enrollment** — Full student registration with personal info, address, and parent/guardian details.
- **Teacher Management** — Staff profiles with qualifications, specializations, and salary tracking.
- **Subject Setup** — Define subjects with unique codes and assign them to classes and teachers.
- **Data Records** — Read-only views for quick lookups with search and filtering.
- **Configurable Grading** — Database-driven grade scales, customizable per school.
- **INR Default Currency** — Preconfigured for Indian schools, configurable per school.

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database

### Setup

```bash
# Install dependencies
npm install

# Set your database URL in .env
# DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"

# Push schema to database
npm run db:push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the app.

### Available Scripts

| Script                | Description                           |
| --------------------- | ------------------------------------- |
| `npm run dev`         | Start dev server with Turbopack       |
| `npm run build`       | Production build                      |
| `npm run db:push`     | Push Prisma schema to database        |
| `npm run db:generate` | Regenerate Prisma client              |
| `npm run db:studio`   | Open Prisma Studio (database browser) |

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/          # Login page
│   ├── (dashboard)/           # Dashboard layout + pages
│   │   ├── data-entry/        # CRUD modules (classes, students, teachers, subjects)
│   │   └── records/           # Read-only data views
│   └── api/                   # REST API routes
├── components/
│   ├── layout/                # Sidebar, Header
│   └── ui/                    # Shared components (Button, StatCard, etc.)
├── lib/                       # Auth, Prisma, utils, validation schemas
└── providers/                 # Auth + Query providers
prisma/
└── schema.prisma              # Database schema (17 models)
```

## License

Private — All rights reserved.
