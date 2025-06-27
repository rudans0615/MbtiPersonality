# MBTI Personality Test Application

## Overview

This is a full-stack web application for conducting MBTI (Myers-Briggs Type Indicator) personality tests. The application provides a comprehensive personality assessment with detailed results and sharing capabilities. Built with React, TypeScript, Express, and PostgreSQL, it features a modern UI with Tailwind CSS and shadcn/ui components.

## System Architecture

The application follows a monorepo structure with clear separation between client and server code:

- **Frontend**: React with TypeScript, using Vite for development and build
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management

## Key Components

### Frontend Architecture
- **React SPA**: Single-page application with component-based architecture
- **TypeScript**: Strict typing throughout the application
- **Tailwind CSS**: Utility-first CSS framework for styling
- **shadcn/ui**: Pre-built accessible UI components
- **Wouter**: Lightweight client-side routing
- **TanStack Query**: Data fetching and caching layer

### Backend Architecture
- **Express.js**: RESTful API server
- **TypeScript**: Type-safe server-side development
- **Drizzle ORM**: Type-safe database operations
- **Memory Storage**: In-memory data storage for development (with PostgreSQL schema ready)
- **Session Management**: Ready for session-based authentication

### Database Schema
- **Users table**: Stores user credentials (id, username, password)
- **Test Results table**: Stores MBTI test results with session tracking
- **PostgreSQL**: Production database with Drizzle migrations

### UI Components
- Comprehensive shadcn/ui component library
- Custom components for MBTI test functionality
- Responsive design with mobile-first approach
- Progress tracking and result visualization

## Data Flow

1. **Test Taking**: Users navigate through MBTI questions with progress tracking
2. **Result Calculation**: Client-side MBTI type calculation based on user responses
3. **Result Storage**: Test results stored with session tracking in database
4. **Result Display**: Comprehensive personality analysis with sharing options
5. **AdSense Integration**: Monetization through Google AdSense placements

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, React Router (Wouter)
- **TypeScript**: Full TypeScript support across the stack
- **Database**: Drizzle ORM, @neondatabase/serverless, PostgreSQL
- **UI Framework**: Tailwind CSS, Radix UI primitives, shadcn/ui
- **Build Tools**: Vite, esbuild for production builds

### Third-party Integrations
- **Google AdSense**: Integrated for monetization
- **Google Fonts**: Inter and Noto Sans KR for typography
- **Replit Integration**: Development environment optimization

## Deployment Strategy

### Development Environment
- **Replit**: Configured for seamless development experience
- **Hot Reload**: Vite dev server with HMR enabled
- **PostgreSQL**: Database provisioning through Replit modules

### Production Build
- **Client Build**: Vite production build with optimization
- **Server Build**: esbuild bundle for Node.js production
- **Static Assets**: Served through Express static middleware
- **Database**: PostgreSQL with connection pooling

### Deployment Configuration
- **Autoscale**: Configured for automatic scaling on Replit
- **Environment Variables**: DATABASE_URL for PostgreSQL connection
- **Build Process**: Automated build pipeline with npm scripts

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 25, 2025. Initial setup
- June 25, 2025. Fixed deployment configuration and production build issues
- June 27, 2025. Expanded to multi-test platform with mobile-friendly navigation