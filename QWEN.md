# Project Context: Canfly Developers Portal

## Overview
This is a Next.js 16 application originally forked from a CRM for Neon, but now serving as the "Canfly Developers Portal" (dev.canfly.org). It's a web-based platform built using modern React (React 19) with TypeScript, Tailwind CSS for styling, and shadcn/ui components. The application appears to be a developer portal with features for managing projects, clients, tasks, assessments, vulnerabilities, and analytics.

## Architecture & Technologies
- **Framework**: Next.js 16 (React 19) with TypeScript
- **Styling**: Tailwind CSS with CSS variables and animations
- **UI Components**: shadcn/ui with Radix UI primitives and Lucide React icons
- **Database**: Neon Database (PostgreSQL) using serverless driver
- **State Management**: React Server Components, Client Components
- **Authentication**: Session-based authentication with middleware protection
- **Form Handling**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Build Tool**: pnpm as package manager

## Project Structure
```
├── app/                    # Next.js 16 app router pages
│   ├── analytics/          # Analytics dashboard pages
│   ├── api/                # API routes
│   ├── assessments/        # Assessment management pages
│   ├── auth/               # Authentication pages (login, register)
│   ├── clients/            # Client management
│   ├── projects/           # Project management
│   ├── reports/            # Reports pages
│   ├── settings/           # User settings
│   ├── tasks/              # Task management
│   ├── team/               # Team management
│   ├── vulnerabilities/    # Vulnerability management
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout with sidebar/header
│   ├── loading.tsx         # Loading component
│   └── page.tsx            # Home page
├── components/             # React components (including UI components)
├── lib/                    # Utility functions and database logic
├── scripts/                # Build/deployment scripts
├── middleware.ts           # Authentication and CORS middleware
├── package.json            # Dependencies and scripts
└── ...
```

## Key Features
- Role-based access control with authentication middleware
- Responsive sidebar navigation and header
- Dark/light theme support
- API routes with CORS handling
- Database initialization script
- Server-side rendering with Next.js
- Comprehensive UI component library (shadcn/ui)

## Building and Running

### Prerequisites
- Node.js 18+ (recommended)
- pnpm package manager
- Neon Database account

### Setup Commands
```bash
# Install dependencies
pnpm install

# Initialize database (requires .env configuration)
pnpm run db:init

# Run development server
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm run start

# Lint the codebase
pnpm run lint
```

### Environment Variables
The project likely requires environment variables in `.env.local` including:
- `DATABASE_URL` - Neon database connection string
- `NEXTAUTH_URL` - Base URL for authentication
- `NEXTAUTH_SECRET` - Secret for authentication
- Other potential auth provider credentials

## Development Conventions
- Component-based architecture with clear separation of concerns
- TypeScript for type safety throughout the application
- Tailwind CSS for styling with consistent design tokens
- API routes follow REST conventions within `/app/api/*`
- Authentication protected routes with middleware
- Server actions for database operations
- Responsive design using Tailwind's responsive utilities
- Accessibility-first approach with Radix UI primitives

## Special Configuration
- Next.js configured for standalone output deployment
- ESLint and TypeScript errors ignored during builds (should be addressed in production)
- Image optimization disabled (images: {unoptimized: true})
- Standalone output configured for containerized deployments
- CORS headers configured in middleware for API routes

## Database
- Neon Database (PostgreSQL) integration with serverless driver
- Database initialization script in `scripts/init-db.ts`
- Database utility functions in `lib/db.ts` (referenced by init script)