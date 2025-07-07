# Railway Deployment Issue Fixes

## Problem Identified
The Railway deployment is failing with "Failed to register device: Forbidden" error when trying to authenticate with TataPlay API.

## Root Causes
1. **CORS Issues**: Railway servers have different IP addresses/origins than expected
2. **Missing Headers**: Some required browser headers for TataPlay API
3. **IP Blocking**: TataPlay might be blocking requests from Railway's servers

## Fixes Applied

### 1. Added CORS Configuration
```javascript
// Added to server/index.ts
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://securemedia-production.up.railway.app',
    'https://www.tataplaybinge.com',
    'https://tb.tapi.videoready.tv'
  ];
  // ... CORS headers setup
});
```

### 2. Enhanced Request Headers
Added browser-like headers to TataPlay API calls:
- `sec-fetch-dest: empty`
- `sec-fetch-mode: cors`
- `sec-fetch-site: cross-site`
- `x-requested-with: XMLHttpRequest`

### 3. Improved Error Handling
- Better error messages with response details
- Console logging for debugging
- Proper try-catch blocks

## Testing Steps
1. Push changes to GitHub
2. Railway auto-deploys
3. Test device registration at: https://securemedia-production.up.railway.app
4. Check browser console and Railway logs for errors

## Alternative Solutions if Issues Persist

### Option 1: Use Proxy Service
If TataPlay is blocking Railway IPs:
- Deploy to different platform (Vercel, Netlify Functions)
- Use proxy service like ngrok for testing

### Option 2: Client-Side API Calls
Move TataPlay API calls to frontend:
- Remove CORS restrictions
- Handle authentication in browser
- Store tokens securely

### Option 3: Different Hosting Platform
Try these alternatives:
- **Vercel**: Better CORS handling
- **Netlify**: Different IP ranges  
- **Heroku**: Established platform

## Debugging Commands
```bash
# Check Railway logs
railway logs

# Test API endpoints directly
curl -X POST https://securemedia-production.up.railway.app/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"mobile": "9999999999", "deviceId": "test123"}'
```

## Expected Resolution
After these fixes, the Railway deployment should:
1. Successfully register devices with TataPlay
2. Send OTP to mobile numbers
3. Complete authentication flow
4. Generate working M3U playlists