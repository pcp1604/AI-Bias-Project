# Overview

BiasGuard is an AI fairness audit platform that helps organizations detect, measure, and mitigate bias in machine learning models. The application provides comprehensive bias analysis tools, fairness metrics calculation, and detailed reporting capabilities to ensure responsible AI deployment.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built with React and TypeScript using Vite as the build tool. The UI leverages shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling. The application uses Wouter for client-side routing and TanStack Query for server state management. The frontend follows a component-based architecture with pages organized by feature areas (dashboard, audits, reports, settings).

## Backend Architecture
The server is built with Express.js and TypeScript, following a REST API design pattern. The application uses a layered architecture with clear separation between routes, business logic, and data access. For development, the server integrates with Vite's middleware for hot module replacement and seamless full-stack development experience.

## Data Storage Solutions
The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The database schema includes tables for users, models, audits, fairness metrics, reports, and uploaded files. For development and testing, an in-memory storage implementation is provided as a fallback. The database is configured to work with Neon's serverless PostgreSQL offering.

## Authentication and Authorization
Currently implemented with a simplified user system using hardcoded user IDs for demo purposes. The architecture supports session-based authentication with user credentials stored securely in the database. The system is designed to be easily extended with proper authentication middleware and session management.

## API Design
The REST API follows RESTful conventions with endpoints organized by resource type:
- `/api/dashboard/stats` - Dashboard overview metrics
- `/api/models` - Model management operations  
- `/api/audits` - Bias audit lifecycle management
- `/api/reports` - Report generation and retrieval
- `/api/files` - File upload and processing

Error handling is centralized with consistent error response formats and proper HTTP status codes throughout the API.

# External Dependencies

## UI Framework and Styling
- **Radix UI**: Headless UI primitives for accessible component foundations
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **shadcn/ui**: Pre-built component library combining Radix UI with Tailwind CSS
- **Lucide React**: Icon library for consistent iconography

## Database and ORM
- **PostgreSQL**: Primary relational database (configured for Neon serverless)
- **Drizzle ORM**: Type-safe database toolkit with migration support
- **Drizzle Kit**: CLI tools for database schema management and migrations

## State Management and Data Fetching
- **TanStack Query**: Server state management with caching and synchronization
- **Wouter**: Lightweight client-side routing library
- **React Hook Form**: Form state management with validation support

## Development and Build Tools
- **Vite**: Fast build tool and development server with HMR support
- **TypeScript**: Static type checking across frontend and backend
- **Replit Plugins**: Development environment integration for Replit platform

## Backend Infrastructure
- **Express.js**: Web application framework for the REST API
- **tsx**: TypeScript execution engine for development
- **esbuild**: Fast JavaScript bundler for production builds

## Validation and Type Safety
- **Zod**: Schema validation library for runtime type checking
- **drizzle-zod**: Integration between Drizzle ORM and Zod for schema validation