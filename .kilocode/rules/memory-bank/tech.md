# Project Supernova Tech Stack

## Core Technologies

- **NextJS**: React framework for SSR, routing, and PWA features.
- **React**: UI library for building interactive interfaces.
- **TypeScript**: Type safety and improved developer experience.
- **Tailwind CSS**: Utility-first CSS framework for responsive design.
- **Redux Toolkit**: State management for predictable global state.
- **Supabase**: Authentication and potential future data storage.
- **Drizzle ORM**: Type-safe database access and migrations (SQL).
- **Node.js**: Runtime for server-side logic and API routes.

## Development Tools

- **ESLint**: Linting for code quality.
- **Prettier**: Code formatting.
- **Husky**: Git hooks for enforcing code standards.
- **PostCSS**: CSS processing pipeline.
- **Jest/Testing Library**: (If present) For unit and integration testing.

## Configuration & Setup

- **next.config.ts**: NextJS configuration.
- **tsconfig.json**: TypeScript configuration.
- **drizzle.config.ts**: Drizzle ORM and migration setup.
- **.env**: Environment variables for secrets and API keys.
- **package.json**: Dependency and script management.

## Notable Dependencies

- `next`, `react`, `react-dom`, `@reduxjs/toolkit`, `react-redux`,
  `@supabase/supabase-js`, `drizzle-orm`, `tailwindcss`, `eslint`, `prettier`,
  `husky`, and related plugins.

## Technical Constraints

- Must maintain type safety throughout the stack.
- Responsive and mobile-first design is required.
- Authentication must use Supabase.
- Database schema managed via Drizzle migrations.

## Setup Workflow

1. Install dependencies: `npm install`
2. Configure environment variables in `.env`
3. Run database migrations: `npx drizzle-kit push`
4. Start development server: `npm run dev`
