# TataPlay Streaming Manager

## Overview

TataPlay Streaming Manager is a web application that provides IPTV streaming services by integrating with TataPlay's API. The application allows users to authenticate via OTP and generate M3U playlists for streaming live TV channels. It features a modern React frontend with a Node.js/Express backend, using PostgreSQL for data persistence and Drizzle ORM for database management.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom TataPlay branding
- **State Management**: TanStack Query for server state
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with JSON responses
- **Session Management**: Custom in-memory storage with device-based sessions
- **External API Integration**: TataPlay streaming service integration

### Database Design
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured via DATABASE_URL)
- **Schema**: Shared schema definitions between frontend and backend
- **Tables**: Users, Sessions, and Cached URLs for stream management

## Key Components

### Authentication System
- **Device Registration**: Automatic guest device registration with TataPlay
- **OTP Authentication**: Mobile number verification via TataPlay API
- **Session Management**: Device-based sessions with expiration handling
- **Storage**: In-memory session storage with automatic cleanup

### Streaming Service Integration
- **Channel Management**: Fetches live TV channel data from TataPlay API
- **Stream URL Generation**: Dynamic M3U playlist generation
- **URL Caching**: Cached stream URLs for performance optimization
- **DRM Support**: PSSH data handling for protected content

### UI Components
- **Splash Screen**: Branded loading experience
- **Login Form**: OTP-based authentication flow
- **Post-Login Actions**: Playlist download and management options
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Data Flow

1. **Initial Load**: User visits application, sees splash screen
2. **Device Registration**: App registers anonymous device with TataPlay if needed
3. **Authentication**: User enters mobile number, receives OTP, verifies
4. **Session Creation**: Successful login creates persistent session
5. **Playlist Generation**: Authenticated users can download M3U playlists
6. **Stream Access**: M3U playlists contain live stream URLs for media players

## External Dependencies

### Core Libraries
- **React Ecosystem**: React, React DOM, React Hook Form
- **UI Framework**: Radix UI components, Tailwind CSS
- **HTTP Client**: Native fetch API for server communication
- **Date Handling**: date-fns for date manipulation
- **Validation**: Zod for schema validation

### Backend Services
- **TataPlay API**: Primary streaming service provider
- **Neon Database**: PostgreSQL hosting service
- **Express Middleware**: CORS, body parsing, session handling

### Development Tools
- **TypeScript**: Type safety across frontend and backend
- **Vite**: Fast development server and build tool
- **Drizzle Kit**: Database migration and schema management
- **ESBuild**: Backend bundling for production

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with hot module replacement
- **Backend**: tsx for TypeScript execution with auto-reload
- **Database**: Drizzle push for schema synchronization
- **Environment**: NODE_ENV=development for dev-specific features

### Production Build
- **Frontend**: Vite builds static assets to dist/public
- **Backend**: ESBuild bundles server code to dist/index.js
- **Serving**: Express serves both API routes and static frontend
- **Database**: Migrations applied via Drizzle Kit

### Configuration Management
- **Environment Variables**: DATABASE_URL for database connection
- **Path Aliases**: TypeScript path mapping for clean imports
- **Asset Handling**: Vite resolves assets and shared modules

## Changelog

```
Changelog:
- July 07, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```