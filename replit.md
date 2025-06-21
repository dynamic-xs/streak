# Habit Tracker Application

## Overview

This is a modern habit tracking application built with a React frontend and Express.js backend. The application allows users to create, manage, and track daily habits with streaks, completion rates, and calendar views. It features a clean, responsive UI with a comprehensive habit management system.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Style**: RESTful API endpoints
- **Middleware**: Express middleware for JSON parsing, CORS, and request logging
- **Error Handling**: Centralized error handling middleware

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Connection**: Neon Database serverless PostgreSQL
- **Schema**: Strongly typed database schema with Zod validation
- **Migrations**: Drizzle Kit for database migrations
- **Development Storage**: In-memory storage for development/testing

## Key Components

### Database Schema
The application uses two main tables:
- **habits**: Stores habit information (name, description, icon, color, streaks)
- **completions**: Tracks daily habit completions with date references

### API Endpoints
- `GET /api/habits` - Fetch all habits with completion stats
- `GET /api/habits/:id` - Fetch specific habit details
- `POST /api/habits` - Create new habit
- `PATCH /api/habits/:id` - Update existing habit
- `DELETE /api/habits/:id` - Delete habit
- `POST /api/habits/:id/toggle` - Toggle habit completion for a date

### Frontend Features
- **Today View**: Main dashboard showing today's habits and completion status
- **Calendar View**: Monthly calendar with completion status visualization
- **Stats View**: Analytics and statistics for habit performance
- **Manage View**: Administrative interface for editing and deleting habits
- **Add Habit Dialog**: Modal for creating new habits with customizable icons and colors

### UI Components
- Built with shadcn/ui component library
- Responsive design optimized for mobile and desktop
- Custom gradient backgrounds and color schemes
- Icon-based habit categorization
- Progress indicators and streak counters

## Data Flow

1. **Client Request**: React components make API requests via TanStack Query
2. **API Processing**: Express.js routes handle requests and validate data
3. **Database Operations**: Drizzle ORM performs database CRUD operations
4. **Response**: Structured JSON responses sent back to client
5. **UI Updates**: React Query automatically updates UI with fresh data

### State Management Flow
- Server state managed by TanStack Query with automatic caching
- Optimistic updates for habit completion toggles
- Real-time UI updates on successful API operations
- Error handling with toast notifications

## External Dependencies

### Production Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Unstyled, accessible UI primitives
- **date-fns**: Date manipulation utilities
- **class-variance-authority**: Utility for conditional CSS classes

### Development Dependencies
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production builds
- **@types/***: TypeScript type definitions

### UI Dependencies
- Complete shadcn/ui component library
- Tailwind CSS for styling
- Lucide React for icons
- Custom color system for habit categorization

## Deployment Strategy

### Development
- Uses Vite development server with HMR
- In-memory storage for rapid prototyping
- Hot reload for both frontend and backend changes
- Development error overlay for better debugging

### Production Build
- Vite builds optimized React bundle
- esbuild bundles Node.js server
- Static assets served from Express
- Environment-based configuration

### Platform Configuration
- Configured for Replit deployment
- PostgreSQL database provisioning
- Auto-scaling deployment target
- Port 5000 for local development, port 80 for production

### Database Setup
- Drizzle migrations for schema management
- Environment variable configuration for database URL
- Automatic schema generation from TypeScript types

## Recent Changes
- June 21, 2025: Implemented dark mode theme toggle with light/dark themes
- June 21, 2025: Updated color scheme to use green exclusively for completed habits
- June 21, 2025: Added celebration message "Hooray you are a champion!" when all daily habits are completed
- June 21, 2025: Enhanced all components with comprehensive dark mode support
- June 21, 2025: Replaced settings icon with theme toggle (moon/sun icons)

## Changelog
- June 21, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.
Color scheme: Green theme for completed habits, comprehensive dark/light mode support.