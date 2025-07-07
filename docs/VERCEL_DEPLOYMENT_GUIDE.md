# Vercel Deployment Configuration for TataPlay App

## Problem Identified
Vercel is showing source code instead of running the application because it's not configured correctly for a full-stack Node.js app.

## Correct Vercel Configuration

### 1. Framework Preset
**Select:** `Other` (not Vite)
- Reason: This is a full-stack app with Node.js backend, not just a Vite frontend

### 2. Build & Output Settings

**Build Command:**
```
npm run build
```

**Output Directory:**
```
dist/public
```

**Install Command:**
```
npm install
```

**Root Directory:**
```
./
```

### 3. Environment Variables
**Add these if needed:**
- **Key:** `NODE_ENV`
- **Value:** `production`

**No other environment variables needed** - the app uses in-memory storage by default.

## Required Files (Already Created)

I've created `vercel.json` in your project root with the correct configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "package.json", 
      "use": "@vercel/static-build"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/public/$1"
    }
  ]
}
```

## Update package.json Scripts

Make sure your `package.json` has these scripts:

```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && tsc server/index.ts --outDir dist --target es2020 --module commonjs --moduleResolution node --esModuleInterop true",
    "start": "node dist/index.js",
    "vercel-build": "npm run build"
  }
}
```

## Step-by-Step Vercel Deployment

### Step 1: Update Your GitHub Repository
1. Add the `vercel.json` file I created
2. Commit and push to GitHub:
```bash
git add vercel.json
git commit -m "Add Vercel configuration"
git push origin main
```

### Step 2: Create New Vercel Project
1. Go to vercel.com and delete the existing project
2. Click "New Project"
3. Import your GitHub repository

### Step 3: Configure Project Settings
**Framework Preset:** `Other`

**Build and Output Settings:**
- Build Command: `npm run build`
- Output Directory: `dist/public`
- Install Command: `npm install`

**Environment Variables:**
- Key: `NODE_ENV`, Value: `production`

### Step 4: Deploy
Click "Deploy" and wait for build to complete.

## How It Works

### Frontend Build
- Vite builds the React frontend to `dist/public`
- Vercel serves these static files

### Backend API
- TypeScript compiles `server/index.ts` to `dist/index.js`
- Vercel runs this as a serverless function
- API routes (`/api/*`) are handled by the server

### Routing
- `/api/*` requests go to the Node.js backend
- All other requests serve the React frontend

## Testing After Deployment

1. **Frontend loads:** Your app should show the TataPlay interface
2. **API works:** Login form should accept mobile numbers
3. **Full functionality:** OTP, authentication, playlist generation

## Common Issues and Solutions

### "Source code displayed"
- Wrong framework preset (should be "Other")
- Missing or incorrect `vercel.json`
- Build command not working

### "API routes not found"
- Check `vercel.json` routes configuration
- Ensure backend build is successful

### "Build failed"
- Check build command in package.json
- Verify all dependencies are listed

## Alternative: Use Vercel CLI

If web interface doesn't work:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from your project directory
vercel --prod
```

## Expected Result

After correct configuration:
- **URL:** `https://your-project.vercel.app`
- **Frontend:** React app loads properly
- **Backend:** API endpoints work
- **Full functionality:** Login, OTP, playlist download

The key is using "Other" framework and proper build configuration in `vercel.json`!