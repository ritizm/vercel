import { URL } from 'url';
import { createDecipheriv } from 'crypto';

export interface ChannelData {
  id: string;
  title: string;
  transparentImageUrl: string;
  genres: string[];
  provider?: string;
}

export interface PSShData {
  pssh: string;
  kid: string;
  pr_pssh: string;
}

export class StreamingService {
  private static readonly USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36';
  private static readonly AES_KEY = 'aesEncryptionKey';
  private static readonly CONTENT_API_BASE = 'https://tb.tapi.videoready.tv/content-detail/api/partner/cdn/player/details/chotiluli/';
  private static readonly ORIGIN_API = 'https://tp.drmlive-01.workers.dev/origin';
  private static readonly STB_ONLY_API = 'https://tp.drmlive-01.workers.dev/stb_only';

  static decryptUrl(encryptedUrl: string, aesKey: string): string {
    try {
      const cleanEncrypted = encryptedUrl.replace(/#.*$/, '');
      const decoded = Buffer.from(cleanEncrypted, 'base64');
      
      // AES-128-ECB decryption
      const decipher = createDecipheriv('aes-128-ecb', aesKey, null);
      let decrypted = decipher.update(decoded, undefined, 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      throw new Error(`Failed to decrypt URL: ${error}`);
    }
  }

  static async getChannelList(): Promise<ChannelData[]> {
    const response = await fetch(this.ORIGIN_API);
    if (!response.ok) {
      throw new Error(`Failed to fetch channel list: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data?.list || [];
  }

  static async getSkipChannelIds(): Promise<string[]> {
    try {
      const response = await fetch(this.STB_ONLY_API);
      if (!response.ok) return [];
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  static async getStreamUrl(channelId: string, loginData: any): Promise<string> {
    if (!loginData?.data) {
      throw new Error('User not logged in');
    }

    const { subscriberId, userAuthenticateToken } = loginData.data;
    
    const response = await fetch(`${this.CONTENT_API_BASE}${channelId}`, {
      headers: {
        'Authorization': `Bearer ${userAuthenticateToken}`,
        'subscriberId': subscriberId,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch content data: ${response.statusText}`);
    }

    const responseData = await response.json();
    
    if (!responseData.data?.dashPlayreadyPlayUrl) {
      throw new Error('Stream URL not found');
    }

    const encryptedUrl = responseData.data.dashPlayreadyPlayUrl;
    let decryptedUrl = this.decryptUrl(encryptedUrl, this.AES_KEY);
    
    // Replace domain as per original logic
    decryptedUrl = decryptedUrl.replace('bpaicatchupta', 'bpaita');
    
    // Handle redirects if needed
    if (decryptedUrl.includes('bpaita')) {
      const headResponse = await fetch(decryptedUrl, {
        method: 'HEAD',
        headers: {
          'User-Agent': this.USER_AGENT,
        },
        redirect: 'manual',
      });
      
      if (headResponse.headers.get('location')) {
        const location = headResponse.headers.get('location')!;
        return location.includes('&') ? location.substring(0, location.indexOf('&')) : location;
      }
    }

    return decryptedUrl;
  }

  static async extractPsshFromManifest(manifestContent: string, baseUrl: string): Promise<PSShData | null> {
    // This is a simplified version - in production you'd need proper XML parsing
    // and segment fetching to extract PSSH data from the actual media segments
    try {
      // Parse manifest and extract PSSH data
      // This would involve fetching audio segments and extracting DRM data
      // For now, returning null as this requires complex binary parsing
      return null;
    } catch {
      return null;
    }
  }

  static async processManifest(mpdUrl: string, channelId: string): Promise<string> {
    const response = await fetch(mpdUrl, {
      headers: {
        'User-Agent': this.USER_AGENT,
        'Referer': 'https://watch.tataplay.com/',
        'Origin': 'https://watch.tataplay.com',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch MPD content: ${response.statusText}`);
    }

    let manifestContent = await response.text();
    const baseUrl = new URL(mpdUrl).origin + new URL(mpdUrl).pathname.replace(/\/[^\/]*$/, '');
    
    // Replace relative URLs with absolute URLs
    manifestContent = manifestContent.replace(/dash\//g, `${baseUrl}/dash/`);
    
    // Extract and inject PSSH data if available
    const psshData = await this.extractPsshFromManifest(manifestContent, baseUrl);
    if (psshData) {
      manifestContent = manifestContent.replace(
        'mp4protection:2011',
        `mp4protection:2011" cenc:default_KID="${psshData.kid}`
      );
      manifestContent = manifestContent.replace(
        '" value="PlayReady"/>',
        `"><cenc:pssh>${psshData.pr_pssh}</cenc:pssh></ContentProtection>`
      );
      manifestContent = manifestContent.replace(
        '" value="Widevine"/>',
        `"><cenc:pssh>${psshData.pssh}</cenc:pssh></ContentProtection>`
      );
    }

    return manifestContent;
  }

  static generatePlaylist(channels: ChannelData[], skipIds: string[], baseUrl: string, userAgent: string, deviceId?: string): string {
    let playlist = '#EXTM3U\n\n';
    
    // Determine header format based on user agent
    let liveHeaders = '';
    if (userAgent.toLowerCase().includes('tivimate')) {
      liveHeaders = '| X-Forwarded-For=59.178.74.184 | Origin=https://watch.tataplay.com | Referer=https://watch.tataplay.com/';
    } else if (userAgent.toLowerCase().includes('sparkletv')) {
      liveHeaders = '|X-Forwarded-For=59.178.74.184|Origin=https://watch.tataplay.com|Referer=https://watch.tataplay.com/';
    } else {
      liveHeaders = '|X-Forwarded-For=59.178.74.184&Origin=https://watch.tataplay.com&Referer=https://watch.tataplay.com/';
    }

    for (const channel of channels) {
      // Skip channels in skip list
      if (skipIds.includes(channel.id)) continue;
      
      // Skip DistroTV channels
      if (channel.provider === 'DistroTV') continue;

      const channelName = channel.title;
      const channelLogo = channel.transparentImageUrl;
      let channelGenre = channel.genres?.[0] || 'General';
      
      // Add HD tag if present
      if (channel.genres?.includes('HD')) {
        channelGenre += ', HD';
      }

      const licenseUrl = `https://tp.drmlive-01.workers.dev?id=${channel.id}`;
      const deviceParam = deviceId ? `&device=${encodeURIComponent(deviceId)}` : '';
      const streamUrl = `${baseUrl}/api/manifest.mpd?id=${channel.id}${deviceParam}${liveHeaders}`;

      playlist += `#EXTINF:-1 tvg-id="ts${channel.id}" tvg-logo="${channelLogo}" group-title="${channelGenre}",${channelName}\n`;
      playlist += `#KODIPROP:inputstream.adaptive.license_type=clearkey\n`;
      playlist += `#KODIPROP:inputstream.adaptive.license_key=${licenseUrl}\n`;
      playlist += `#KODIPROP:inputstream.adaptive.manifest_type=mpd\n`;
      playlist += `#EXTVLCOPT:http-user-agent=${this.USER_AGENT}\n`;
      playlist += `${streamUrl}\n\n`;
    }

    return playlist;
  }
}
