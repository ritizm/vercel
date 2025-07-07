# TataPlay Streaming Manager - Local Setup Guide

## Project Overview
A React + Express.js application for TataPlay streaming service integration with OTP authentication and M3U playlist generation.

## Prerequisites
- Node.js 18+ 
- npm or yarn package manager

## Quick Setup

### 1. Create project directory
```bash
mkdir tataplay-streaming-app
cd tataplay-streaming-app
```

### 2. Initialize npm project
```bash
npm init -y
```

### 3. Install dependencies
```bash
# Core dependencies
npm install express typescript tsx drizzle-orm @neondatabase/serverless
npm install react react-dom @vitejs/plugin-react vite wouter
npm install @tanstack/react-query zod drizzle-zod
npm install lucide-react tailwindcss autoprefixer postcss
npm install @tailwindcss/vite class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-slot @radix-ui/react-toast @radix-ui/react-dialog
npm install @radix-ui/react-label framer-motion

# Dev dependencies  
npm install -D @types/node @types/react @types/react-dom @types/express
npm install -D tailwindcss-animate
```

### 4. Project Structure
```
tataplay-streaming-app/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── index.html
├── server/
│   ├── services/
│   ├── index.ts
│   ├── routes.ts
│   ├── storage.ts
│   └── vite.ts
├── shared/
│   └── schema.ts
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── components.json
```

### 5. Key Configuration Files

**package.json scripts:**
```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && tsc server/index.ts --outDir dist",
    "start": "node dist/index.js"
  }
}
```

**vite.config.ts:**
- Configured for React with TypeScript
- Path aliases for shared modules
- Proxy setup for API routes

**tailwind.config.ts:**
- TataPlay branding colors
- Custom component classes
- Dark mode support

## Features Implemented

### Authentication System
- Device registration with TataPlay API
- OTP-based mobile verification
- Session management with device IDs
- Automatic login status checking

### Streaming Integration
- Channel list fetching from TataPlay
- M3U playlist generation
- Stream manifest proxy
- DRM content support (Widevine/PlayReady)

### Frontend Features
- Modern React UI with TypeScript
- TataPlay branded design
- Responsive mobile-first layout
- Toast notifications
- Loading states and error handling

### Backend API
- RESTful Express.js server
- In-memory session storage
- URL caching for performance
- CORS and security headers

## Environment Setup

### Required Environment Variables
```bash
# Optional - for PostgreSQL database (uses in-memory storage by default)
DATABASE_URL=your_database_url_here
```

## API Endpoints

- `POST /api/auth/send-otp` - Send OTP to mobile number
- `POST /api/auth/verify-otp` - Verify OTP and login
- `GET /api/auth/status` - Check login status
- `POST /api/auth/logout` - Logout user
- `GET /api/playlist.m3u` - Generate M3U playlist
- `GET /api/manifest.mpd` - Stream manifest proxy

## Running the Application

### Development Mode
```bash
npm run dev
```
- Starts Express server on port 5000
- Includes Vite dev server with HMR
- API and frontend served on same port

### Production Build
```bash
npm run build
npm start
```

## Usage Flow

1. **Splash Screen** - TataPlay branded loading screen
2. **Login** - Enter mobile number and receive OTP
3. **Verification** - Enter 4-digit OTP code
4. **Dashboard** - Download playlist or copy URL
5. **Streaming** - Use playlist in media players

## External Player Support

The generated playlist works with:
- VLC Media Player
- TiviMate (Android TV)
- Kodi media center
- SparkleTV
- Other IPTV players supporting M3U/MPD

## Technical Notes

### Session Management
- Device-based sessions with 24-hour expiry
- Automatic cleanup of expired sessions
- Device ID stored in localStorage

### URL Structure
Playlist URLs include device authentication:
```
http://localhost:5000/api/playlist.m3u?device=DEVICE_ID
```

### DRM Support
- Widevine and PlayReady content protection
- PSSH data extraction from manifests
- Clear key license integration

## Deployment

The app can be deployed to:
- Vercel/Netlify (frontend)
- Railway/Heroku (backend)
- VPS with Node.js support

For production, configure:
- PostgreSQL database
- Environment variables
- HTTPS certificates
- Domain configuration

## Troubleshooting

### Common Issues
1. **OTP not received** - Check mobile number format (10 digits, starts with 6-9)
2. **Playlist empty** - Ensure proper login and session
3. **Streams not working** - Check DRM support in player
4. **Authentication fails** - Clear localStorage and retry

### Development Issues
1. **Port conflicts** - Change port in server/index.ts
2. **Build errors** - Check TypeScript configuration
3. **API errors** - Verify TataPlay service availability

## Support

This is a educational/personal project. For TataPlay official support, contact TataPlay customer service.

---

**Created**: January 2025
**Technology Stack**: React, TypeScript, Express.js, TataPlay API
**Purpose**: Streaming service integration and playlist management