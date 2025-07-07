# Export TataPlay Streaming App to Local PC

## Method 1: Download Individual Files (Recommended)

Since this is a Replit project, you'll need to recreate the files locally. Here's the step-by-step process:

### Step 1: Create Local Project Structure
```bash
mkdir tataplay-streaming-app
cd tataplay-streaming-app

# Create directory structure
mkdir -p client/src/{components,pages,hooks,lib}
mkdir -p server/services
mkdir -p shared
mkdir attached_assets
```

### Step 2: Copy Configuration Files
Download these files from the Replit file explorer:

**Root files:**
- `package.json`
- `vite.config.ts` 
- `tailwind.config.ts`
- `tsconfig.json`
- `components.json`
- `postcss.config.js`
- `PROJECT_EXPORT_README.md`

**Client files:**
- `client/index.html`
- `client/src/main.tsx`
- `client/src/App.tsx`
- `client/src/index.css`

**Server files:**
- `server/index.ts`
- `server/routes.ts`
- `server/storage.ts`
- `server/vite.ts`

**Services:**
- `server/services/tataplay-api.ts`
- `server/services/streaming.ts`

**Shared:**
- `shared/schema.ts`

**Components:**
- `client/src/components/splash-screen.tsx`
- `client/src/components/login-form.tsx`
- `client/src/components/post-login-actions.tsx`

**Pages:**
- `client/src/pages/home.tsx`
- `client/src/pages/not-found.tsx`

**Hooks:**
- `client/src/hooks/use-auth.ts`
- `client/src/hooks/use-toast.ts`
- `client/src/hooks/use-mobile.tsx`

**Utils:**
- `client/src/lib/utils.ts`
- `client/src/lib/queryClient.ts`

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Run the Application
```bash
npm run dev
```

## Method 2: Git Clone (Alternative)

If you have Git access to this Replit:

```bash
git clone <your-replit-git-url>
cd tataplay-streaming-app
npm install
npm run dev
```

## Method 3: Download as Archive

1. In Replit, go to the Shell
2. Run: `zip -r export.zip . -x node_modules/\* .git/\*`
3. Download the zip file
4. Extract on your local PC
5. Run `npm install`

## Local Setup Requirements

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Environment Setup
Create a `.env` file (optional):
```
NODE_ENV=development
PORT=5000
```

### Available Scripts
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Start production server
```

## File Checklist

Make sure you have these essential files:

**Configuration (6 files):**
- [ ] package.json
- [ ] vite.config.ts
- [ ] tailwind.config.ts
- [ ] tsconfig.json
- [ ] components.json
- [ ] postcss.config.js

**Client Source (10+ files):**
- [ ] client/index.html
- [ ] client/src/main.tsx
- [ ] client/src/App.tsx
- [ ] client/src/index.css
- [ ] All components, pages, hooks, lib files

**Server Source (6 files):**
- [ ] server/index.ts
- [ ] server/routes.ts
- [ ] server/storage.ts
- [ ] server/vite.ts
- [ ] server/services/tataplay-api.ts
- [ ] server/services/streaming.ts

**Shared (1 file):**
- [ ] shared/schema.ts

## Troubleshooting

### If you get dependency errors:
```bash
npm install --legacy-peer-deps
```

### If TypeScript errors occur:
```bash
npx tsc --noEmit
```

### If Tailwind doesn't work:
```bash
npx tailwindcss init -p
```

## Testing the Setup

1. Start the development server: `npm run dev`
2. Open browser to `http://localhost:5000`
3. You should see the TataPlay splash screen
4. Test login with a valid mobile number
5. Verify playlist generation works

The application should work identically to the Replit version once properly set up locally.