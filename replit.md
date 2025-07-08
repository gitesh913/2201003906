# URL Shortener Application

## Overview

This is a full-stack URL shortener application built with React, TypeScript, and Express. The application allows users to shorten URLs, track click statistics, and manage multiple URLs simultaneously. It features a modern, responsive design with comprehensive analytics and client-side data persistence.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui components with Tailwind CSS
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks with localStorage persistence
- **Data Fetching**: TanStack Query (React Query) for server state management

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: Hot module replacement with Vite integration

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Migration Strategy**: Drizzle Kit for schema management
- **Connection**: Environment-based DATABASE_URL configuration

## Key Components

### Frontend Components
1. **URL Form Component** (`client/src/components/url-form.tsx`)
   - Multi-URL input forms (up to 5 URLs)
   - Custom shortcode support
   - Validity period configuration
   - Client-side validation

2. **Results Display** (`client/src/components/results-display.tsx`)
   - Shows generated shortened URLs
   - Displays creation and expiry times
   - Click tracking information

3. **Statistics Table** (`client/src/components/stats-table.tsx`)
   - Comprehensive analytics display
   - Click details with timestamps
   - Sortable and filterable data

4. **Navigation Header** (`client/src/components/layout/header.tsx`)
   - Application navigation
   - Responsive design

### Backend Components
1. **Express Server** (`server/index.ts`)
   - Request/response logging middleware
   - JSON and URL-encoded body parsing
   - Error handling middleware

2. **Storage Interface** (`server/storage.ts`)
   - In-memory storage implementation
   - User management methods
   - Extensible interface for database integration

3. **Routing System** (`server/routes.ts`)
   - Modular route registration
   - HTTP server creation
   - API endpoint management

### Shared Components
1. **Schema Definitions** (`shared/schema.ts`)
   - Zod schema validation
   - TypeScript type definitions
   - Data validation rules

2. **Custom Logger** (`Logging Middleware/logger.ts`)
   - Structured logging system
   - localStorage persistence
   - Multiple log levels (info, warn, error, debug)

## Data Flow

### URL Shortening Process
1. User enters URLs in the form components
2. Client-side validation using Zod schemas
3. Shortcode generation (automatic or custom)
4. URL entry creation with expiry timestamps
5. localStorage persistence for session data
6. Results display with tracking information

### Click Tracking Process
1. User visits shortened URL
2. Redirect component checks URL validity
3. Click data collection (timestamp, referrer, location)
4. Analytics update in localStorage
5. Redirect to original URL or error page

### Statistics Display
1. Data retrieval from localStorage
2. Aggregation of click statistics
3. Table rendering with sorting/filtering
4. Export functionality for data backup

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with custom design tokens
- **Icons**: Lucide React for consistent iconography
- **Forms**: React Hook Form with Zod resolvers
- **Date Handling**: date-fns for date manipulation
- **State Management**: TanStack Query for server state

### Backend Dependencies
- **Database**: Neon Database serverless PostgreSQL
- **ORM**: Drizzle ORM with Drizzle Kit
- **Session Store**: connect-pg-simple for PostgreSQL sessions
- **Development**: tsx for TypeScript execution

### Development Dependencies
- **Build Tools**: Vite with React plugin
- **TypeScript**: Full TypeScript support
- **Linting**: ESLint configuration
- **Development**: Replit-specific plugins for cloud development

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React application to `dist/public`
2. **Backend Build**: ESBuild bundles server code to `dist/index.js`
3. **Database Migration**: Drizzle Kit pushes schema changes
4. **Static Assets**: Served from build directory

### Environment Configuration
- **Development**: `NODE_ENV=development` with hot reload
- **Production**: `NODE_ENV=production` with optimized builds
- **Database**: `DATABASE_URL` environment variable required
- **Sessions**: PostgreSQL session store configuration

### Deployment Commands
- `npm run dev`: Development server with hot reload
- `npm run build`: Production build
- `npm run start`: Production server
- `npm run db:push`: Database schema migration

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 08, 2025. Initial setup