import { 
  sessions, 
  cachedUrls, 
  type Session, 
  type InsertSession, 
  type CachedUrl, 
  type InsertCachedUrl 
} from "@shared/schema";

export interface IStorage {
  // Session management
  createSession(session: InsertSession): Promise<Session>;
  getSessionByDeviceId(deviceId: string): Promise<Session | undefined>;
  updateSession(deviceId: string, data: Partial<InsertSession>): Promise<Session | undefined>;
  deleteSession(deviceId: string): Promise<boolean>;
  
  // URL caching
  getCachedUrl(channelId: string): Promise<CachedUrl | undefined>;
  setCachedUrl(data: InsertCachedUrl): Promise<CachedUrl>;
  
  // Cleanup expired sessions
  cleanupExpiredSessions(): Promise<void>;
}

export class MemStorage implements IStorage {
  private sessions: Map<string, Session> = new Map();
  private cachedUrls: Map<string, CachedUrl> = new Map();
  private currentSessionId: number = 1;
  private currentCacheId: number = 1;

  constructor() {
    // Clean up expired sessions every hour
    setInterval(() => {
      this.cleanupExpiredSessions();
    }, 60 * 60 * 1000);
  }

  async createSession(sessionData: InsertSession): Promise<Session> {
    const session: Session = {
      id: this.currentSessionId++,
      deviceId: sessionData.deviceId,
      anonymousId: sessionData.anonymousId || null,
      mobileNumber: sessionData.mobileNumber || null,
      loginData: sessionData.loginData || null,
      createdAt: new Date(),
      expiresAt: sessionData.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours default
    };
    
    this.sessions.set(sessionData.deviceId, session);
    return session;
  }

  async getSessionByDeviceId(deviceId: string): Promise<Session | undefined> {
    const session = this.sessions.get(deviceId);
    if (session && session.expiresAt && session.expiresAt < new Date()) {
      this.sessions.delete(deviceId);
      return undefined;
    }
    return session;
  }

  async updateSession(deviceId: string, data: Partial<InsertSession>): Promise<Session | undefined> {
    const existing = this.sessions.get(deviceId);
    if (!existing) return undefined;

    const updated: Session = {
      ...existing,
      ...data,
    };
    
    this.sessions.set(deviceId, updated);
    return updated;
  }

  async deleteSession(deviceId: string): Promise<boolean> {
    return this.sessions.delete(deviceId);
  }

  async getCachedUrl(channelId: string): Promise<CachedUrl | undefined> {
    return this.cachedUrls.get(channelId);
  }

  async setCachedUrl(data: InsertCachedUrl): Promise<CachedUrl> {
    const existing = this.cachedUrls.get(data.channelId);
    
    if (existing) {
      const updated: CachedUrl = {
        ...existing,
        url: data.url,
        updatedAt: new Date(),
      };
      this.cachedUrls.set(data.channelId, updated);
      return updated;
    }

    const cached: CachedUrl = {
      ...data,
      id: this.currentCacheId++,
      updatedAt: new Date(),
    };
    
    this.cachedUrls.set(data.channelId, cached);
    return cached;
  }

  async cleanupExpiredSessions(): Promise<void> {
    const now = new Date();
    const expiredSessions: string[] = [];
    
    this.sessions.forEach((session, deviceId) => {
      if (session.expiresAt && session.expiresAt < now) {
        expiredSessions.push(deviceId);
      }
    });
    
    expiredSessions.forEach(deviceId => {
      this.sessions.delete(deviceId);
    });
  }
}

export const storage = new MemStorage();
