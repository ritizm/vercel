# Simple Setup Guide for TataPlay Streaming App

## What This App Does
This app lets you log in with your mobile number, get an OTP code, and then download playlist files for watching TV channels on any media player like VLC.

## Option 1: Run on Your Computer (Local Setup)

### What You Need
- A computer with internet connection
- Node.js installed (download from nodejs.org - get version 18 or newer)

### Step 1: Get the Files
You need to copy these files from this Replit to your computer:

**Main Setup Files (copy these first):**
- `package.json`
- `vite.config.ts`
- `tailwind.config.ts`
- `tsconfig.json`
- `components.json`
- `postcss.config.js`

**App Files:**
- Everything in the `client` folder
- Everything in the `server` folder  
- Everything in the `shared` folder
- The `README.md` file

### Step 2: Create Folder Structure
On your computer, create a new folder called `tataplay-app` and inside it create these folders:
```
tataplay-app/
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       └── lib/
├── server/
│   └── services/
└── shared/
```

### Step 3: Copy All Files
Copy all the files from this Replit into the matching folders on your computer.

### Step 4: Install and Run
1. Open command prompt/terminal in your `tataplay-app` folder
2. Type: `npm install` (this downloads all needed parts)
3. Type: `npm run dev` (this starts the app)
4. Open your web browser and go to: `http://localhost:5000`

## Option 2: Deploy to Cloudflare Pages

### What is Cloudflare Pages?
It's a free service that hosts your website online so anyone can access it from the internet.

### Important Note About Backend
**Problem:** Cloudflare Pages only hosts frontend websites, but this app needs a backend server for the TataPlay API.

**Solution Options:**

#### Option A: Split Frontend and Backend
1. **Frontend on Cloudflare Pages:**
   - Only upload the `client` folder
   - Your website will load but won't work for login/streaming

2. **Backend on Another Service:**
   - Use Railway, Heroku, or Vercel for the backend
   - Update the frontend to point to your backend URL

#### Option B: Use Full-Stack Hosting (Recommended)
Instead of Cloudflare Pages, use these services that support both frontend and backend:

**Easy Options:**
- **Vercel** (free, connects to GitHub)
- **Railway** (free tier, very simple)
- **Heroku** (free with limitations)

### Simple Cloudflare Pages Setup (Frontend Only)

1. **Prepare Files:**
   - Create a new folder with only the `client` folder contents
   - Modify the API calls to point to your backend server

2. **Upload to Cloudflare:**
   - Go to pages.cloudflare.com
   - Connect your GitHub account
   - Upload your project
   - It will automatically build and deploy

3. **Build Settings:**
   - Build command: `npm run build`
   - Output directory: `dist`

## Complete Working Setup (Recommended)

### Use Railway (Easiest Full-Stack Option)

1. **Create GitHub Repository:**
   - Upload all your project files to GitHub
   
2. **Deploy to Railway:**
   - Go to railway.app
   - Connect your GitHub account
   - Select your repository
   - Railway automatically detects Node.js and deploys everything

3. **Your App is Live:**
   - Railway gives you a URL like `yourapp.railway.app`
   - Everything works: login, OTP, playlist download

## Files You Must Have

### Essential Files (these make the app work):
- `package.json` - tells the computer what parts to download
- `server/index.ts` - main server file
- `server/routes.ts` - handles login and playlist requests
- `client/src/App.tsx` - main app interface
- `client/index.html` - web page file

### Configuration Files (these set up the app correctly):
- `vite.config.ts` - build settings
- `tailwind.config.ts` - styling settings
- `tsconfig.json` - TypeScript settings

### Important App Files:
- `server/services/tataplay-api.ts` - connects to TataPlay
- `server/services/streaming.ts` - handles video streams
- `client/src/components/login-form.tsx` - login page
- `shared/schema.ts` - data definitions

## Testing Your Setup

1. **Start the app** (local: `npm run dev`, online: automatic)
2. **Open in browser** (local: localhost:5000, online: your deployment URL)
3. **Test login:**
   - Enter a 10-digit mobile number
   - Wait for OTP
   - Enter the 4-digit code
4. **Download playlist:**
   - Click "Download M3U Playlist"
   - Open the file in VLC or any media player

## Common Problems and Solutions

### "npm not found"
- Install Node.js from nodejs.org first

### "Build failed"  
- Make sure all files are copied correctly
- Check that package.json exists

### "Login doesn't work"
- The backend server must be running
- Check if you have internet connection

### "Playlist is empty"
- Make sure you completed login successfully
- Try logging out and logging in again

## What Each Part Does

- **Frontend (client folder):** The website you see and interact with
- **Backend (server folder):** Handles login and gets data from TataPlay
- **Shared (shared folder):** Common code used by both frontend and backend

## Quick Start Summary

**For Local Testing:**
1. Copy all files to your computer
2. Run `npm install`
3. Run `npm run dev`
4. Go to localhost:5000

**For Online Deployment:**
1. Upload files to GitHub
2. Connect to Railway/Vercel
3. Your app gets a public URL
4. Share the URL with others

The app will work exactly like this Replit version once set up correctly!