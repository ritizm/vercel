import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { TataPlayAPI } from "./services/tataplay-api";
import { StreamingService } from "./services/streaming";
import { sendOtpSchema, verifyOtpSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Check login status
  app.get("/api/auth/status", async (req: Request, res: Response) => {
    try {
      const deviceId = req.headers['x-device-id'] as string;
      
      if (!deviceId) {
        return res.json({ isLoggedIn: false });
      }

      const session = await storage.getSessionByDeviceId(deviceId);
      const isLoggedIn = !!(session?.loginData);
      
      let playlistUrl = '';
      if (isLoggedIn) {
        playlistUrl = `${req.protocol}://${req.get('host')}/api/playlist.m3u`;
      }

      res.json({ isLoggedIn, playlistUrl });
    } catch (error) {
      console.error('Status check error:', error);
      res.json({ isLoggedIn: false });
    }
  });

  // Send OTP
  app.post("/api/auth/send-otp", async (req: Request, res: Response) => {
    try {
      console.log('Send OTP request received:', { body: req.body, headers: req.headers });
      
      const { mobile } = sendOtpSchema.parse(req.body);
      let deviceId = req.headers['x-device-id'] as string;

      console.log('Parsed mobile:', mobile, 'deviceId:', deviceId);

      // Get or create device credentials
      let session = deviceId ? await storage.getSessionByDeviceId(deviceId) : undefined;
      
      console.log('Existing session:', session ? 'found' : 'not found');
      
      if (!session) {
        console.log('Creating new device registration...');
        const credentials = await TataPlayAPI.registerGuestDevice();
        deviceId = credentials.deviceId;
        
        console.log('Device registered, creating session...');
        session = await storage.createSession({
          deviceId: credentials.deviceId,
          anonymousId: credentials.anonymousId,
          mobileNumber: mobile,
          loginData: null,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        });
        console.log('Session created successfully');
      } else {
        console.log('Updating existing session with mobile number...');
        // Update mobile number
        await storage.updateSession(deviceId, { mobileNumber: mobile });
      }

      const credentials = {
        deviceId: session.deviceId,
        anonymousId: session.anonymousId!,
      };

      console.log('Sending OTP with credentials:', credentials);
      const message = await TataPlayAPI.sendOTP(mobile, credentials);
      
      console.log('OTP sent successfully, returning response');
      res.json({ 
        message, 
        deviceId: session.deviceId,
        success: true 
      });
    } catch (error: any) {
      console.error('Send OTP error - Full error object:', error);
      console.error('Send OTP error - Stack trace:', error.stack);
      
      // Ensure we always return JSON
      res.setHeader('Content-Type', 'application/json');
      
      // Handle different types of errors
      if (error instanceof z.ZodError) {
        console.log('Validation error:', error.errors);
        return res.status(400).json({ 
          message: 'Invalid input data: ' + error.errors.map(e => e.message).join(', '),
          success: false 
        });
      }
      
      const errorMessage = error.message || 'Failed to send OTP';
      console.error('Returning error response:', errorMessage);
      
      res.status(500).json({ 
        message: errorMessage,
        success: false 
      });
    }
  });

  // Verify OTP
  app.post("/api/auth/verify-otp", async (req: Request, res: Response) => {
    try {
      const { mobile, otp } = verifyOtpSchema.parse(req.body);
      const deviceId = req.headers['x-device-id'] as string;

      if (!deviceId) {
        return res.status(400).json({ 
          message: 'Device ID required',
          success: false 
        });
      }

      const session = await storage.getSessionByDeviceId(deviceId);
      if (!session || !session.anonymousId) {
        return res.status(400).json({ 
          message: 'Invalid session',
          success: false 
        });
      }

      const credentials = {
        deviceId: session.deviceId,
        anonymousId: session.anonymousId,
      };

      // Verify OTP
      const { token, deviceToken } = await TataPlayAPI.verifyOTP(mobile, otp, credentials);

      // Get subscriber details
      const subscriberData = await TataPlayAPI.getSubscriberDetails(mobile, token, credentials);

      // Login user
      const loginData = await TataPlayAPI.loginUser(mobile, token, deviceToken, credentials, subscriberData);

      // Update session with login data
      await storage.updateSession(deviceId, {
        loginData: loginData,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Extend session
      });

      const playlistUrl = `${req.protocol}://${req.get('host')}/api/playlist.m3u`;

      res.json({ 
        message: loginData.message || 'Logged in successfully',
        success: true,
        playlistUrl 
      });
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      
      // Ensure we always return JSON
      res.setHeader('Content-Type', 'application/json');
      
      // Handle different types of errors
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Invalid input data',
          success: false 
        });
      }
      
      res.status(500).json({ 
        message: error.message || 'OTP verification failed',
        success: false 
      });
    }
  });

  // Logout
  app.post("/api/auth/logout", async (req: Request, res: Response) => {
    try {
      const deviceId = req.headers['x-device-id'] as string;

      if (!deviceId) {
        return res.json({ message: 'Already logged out', success: true });
      }

      const session = await storage.getSessionByDeviceId(deviceId);
      if (!session?.loginData) {
        return res.json({ message: 'Already logged out', success: true });
      }

      const credentials = {
        deviceId: session.deviceId,
        anonymousId: session.anonymousId!,
      };

      // Call logout API
      const message = await TataPlayAPI.logout(session.loginData, credentials);

      // Delete session
      await storage.deleteSession(deviceId);

      res.json({ message, success: true });
    } catch (error: any) {
      console.error('Logout error:', error);
      res.status(500).json({ 
        message: error.message || 'Logout failed',
        success: false 
      });
    }
  });

  // Generate playlist
  app.get("/api/playlist.m3u", async (req: Request, res: Response) => {
    try {
      // Get device ID from header or query parameter (for external players)
      const deviceId = (req.headers['x-device-id'] as string) || (req.query.device as string);

      if (!deviceId) {
        return res.status(401).send('Login required');
      }

      const session = await storage.getSessionByDeviceId(deviceId);
      if (!session?.loginData) {
        return res.status(401).send('Login required');
      }

      // Get channel list and skip IDs
      const [channels, skipIds] = await Promise.all([
        StreamingService.getChannelList(),
        StreamingService.getSkipChannelIds(),
      ]);

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const userAgent = req.headers['user-agent'] || '';
      
      const playlist = StreamingService.generatePlaylist(channels, skipIds, baseUrl, userAgent, deviceId);

      res.setHeader('Content-Type', 'audio/x-mpegurl');
      res.setHeader('Content-Disposition', 'attachment; filename="playlist.m3u"');
      res.send(playlist);
    } catch (error: any) {
      console.error('Playlist generation error:', error);
      res.status(500).send('Failed to generate playlist');
    }
  });

  // Stream manifest proxy
  app.get("/api/manifest.mpd", async (req: Request, res: Response) => {
    try {
      const channelId = req.query.id as string;
      // Get device ID from header or query parameter (for external players)
      const deviceId = (req.headers['x-device-id'] as string) || (req.query.device as string);

      if (!channelId) {
        return res.status(400).send('Missing content ID');
      }

      if (!deviceId) {
        return res.status(401).send('Login required');
      }

      const session = await storage.getSessionByDeviceId(deviceId);
      if (!session?.loginData) {
        return res.status(401).send('Login required');
      }

      // Check cache first
      let cachedUrl = await storage.getCachedUrl(channelId);
      let mpdUrl = '';

      if (cachedUrl) {
        // Check if cached URL is still valid
        const url = new URL(cachedUrl.url);
        const queryParams = new URLSearchParams(url.search);
        let exp = queryParams.get('exp');
        
        if (queryParams.has('hdntl')) {
          const hdntlParams = new URLSearchParams(queryParams.get('hdntl')?.replace(/~/g, '&') || '');
          exp = hdntlParams.get('exp');
        }

        if (exp && parseInt(exp) > Math.floor(Date.now() / 1000)) {
          mpdUrl = cachedUrl.url;
        }
      }

      // Get fresh URL if cache miss or expired
      if (!mpdUrl) {
        mpdUrl = await StreamingService.getStreamUrl(channelId, session.loginData);
        
        // Cache the URL
        await storage.setCachedUrl({
          channelId,
          url: mpdUrl,
        });
      }

      // Process and return manifest
      const processedManifest = await StreamingService.processManifest(mpdUrl, channelId);

      res.setHeader('Content-Type', 'application/dash+xml');
      res.setHeader('Content-Disposition', `attachment; filename="tp${channelId}.mpd"`);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
      res.send(processedManifest);
    } catch (error: any) {
      console.error('Manifest proxy error:', error);
      res.status(500).send('Failed to fetch MPD content');
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
