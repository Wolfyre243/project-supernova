# Project Supernova Architecture

## System Overview

Project Supernova is a modular NextJS PWA for personal finance tracking. The
architecture is designed for scalability, maintainability, and a seamless user
experience across devices.

## Source Code Structure

- **src/app/**: NextJS app directory, including:
  - **app/**: Main app entry, layout, error handling, and static assets.
  - **app/api/**: API routes for accounts, categories, transactions, and user
    management.
  - **app/auth/**: Authentication pages and logic (login, signup, confirmation).
  - **app/home/**: Main dashboard and account views.
  - **app/state/**: Redux slices and middleware for state management.
- **src/components/**: Reusable UI components, including:
  - **accounts/**, **dashboard/**, **nav/**, **transactions/**, **ui/**:
    Feature-specific and generic UI components.
- **src/config/**: Application, authentication, color, icon, navigation, and
  status configuration.
- **src/context/**: React context providers (e.g., authentication).
- **src/db/**: Drizzle ORM schema, helpers, and relations for database access.
- **src/documentation/**: Auth flow documentation and ERD (entity-relationship
  diagram).
- **src/drizzle/**: SQL migration files and metadata for schema evolution.
- **src/hooks/**: Custom React hooks for Redux, authentication, locale, and
  mobile detection.
- **src/lib/**: Utility libraries and exception handling.
- **src/utils/**: General utilities and Supabase integration.

## Data Flow

- **Frontend**: React components interact with Redux state and context
  providers.
- **API Layer**: NextJS API routes handle CRUD operations for accounts,
  categories, transactions, and users.
- **Database**: Drizzle ORM manages schema and queries, with migrations tracked
  in `src/drizzle/`.
- **Authentication**: Supabase Auth is integrated for secure user sign-up and
  login.
- **State Management**: Redux Toolkit slices manage global state for accounts,
  categories, transactions, and user data.

## Key Technical Decisions

- **NextJS App Router** for modular routing and API endpoints.
- **Drizzle ORM** for type-safe database access and migrations.
- **Supabase** for authentication and potential future data storage.
- **Redux Toolkit** for predictable and scalable state management.
- **Tailwind CSS** for rapid, responsive UI development.
- **TypeScript** for type safety and maintainability.

## Component Relationships

- UI components are composed in feature modules (accounts, dashboard,
  transactions).
- State slices and context providers are injected at the app root and consumed
  by components as needed.
- API routes are organized by resource and versioned for future extensibility.

## Critical Implementation Paths

- User authentication and session management.
- Budget and transaction CRUD operations.
- Dashboard data aggregation and chart rendering.
- Responsive layout and mobile-first design.
