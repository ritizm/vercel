import { randomBytes } from 'crypto';

export interface DeviceCredentials {
  deviceId: string;
  anonymousId: string;
}

export interface LoginData {
  data: {
    subscriberId: string;
    userAuthenticateToken: string;
    deviceAuthenticateToken: string;
    baId: string;
    dthStatus: string;
    subscriptionStatus: string;
    bingeSubscriberId?: string;
  };
  message: string;
}

export class TataPlayAPI {
  private static readonly USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36';
  private static readonly AES_KEY = 'aesEncryptionKey';

  static generateNumericUuid(): string {
    return String(Math.floor(Math.random() * 900) + 100) + 
           String(Date.now()) + 
           String(Math.floor(Math.random() * 90) + 10);
  }

  static async registerGuestDevice(): Promise<DeviceCredentials> {
    const deviceId = this.generateNumericUuid();
    
    try {
      const response = await fetch('https://tb.tapi.videoready.tv/binge-mobile-services/pub/api/v1/user/guest/register', {
        method: 'POST',
        headers: {
          'accept': 'application/json, text/plain, */*',
          'authorization': 'bearer undefined',
          'content-length': '0',
          'referer': 'https://www.tataplaybinge.com/',
          'deviceid': deviceId,
          'origin': 'https://www.tataplaybinge.com',
          'user-agent': this.USER_AGENT,
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site',
          'x-requested-with': 'XMLHttpRequest'
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Device registration failed:', response.status, errorText);
        throw new Error(`Failed to register device: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      const anonymousId = data.data?.anonymousId;

      if (!anonymousId) {
        throw new Error('Failed to get anonymous ID from device registration');
      }

      return { deviceId, anonymousId };
    } catch (error) {
      console.error('Device registration error:', error);
      throw error;
    }
  }

  static async sendOTP(mobile: string, credentials: DeviceCredentials): Promise<string> {
    try {
      const response = await fetch('https://tb.tapi.videoready.tv/binge-mobile-services/pub/api/v1/user/authentication/generateOTP', {
        method: 'POST',
        headers: {
          'accept': 'application/json, text/plain, */*',
          'anonymousid': credentials.anonymousId,
          'content-length': '0',
          'deviceid': credentials.deviceId,
          'mobilenumber': mobile,
          'newotpflow': '4DOTP',
          'origin': 'https://www.tataplaybinge.com',
          'platform': 'BINGE_ANYWHERE',
          'referer': 'https://www.tataplaybinge.com/',
          'user-agent': this.USER_AGENT,
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'cross-site',
          'x-requested-with': 'XMLHttpRequest'
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OTP send failed:', response.status, errorText);
        throw new Error(`Failed to send OTP: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      return data.message || 'OTP sent successfully';
    } catch (error) {
      console.error('OTP send error:', error);
      throw error;
    }
  }

  static async verifyOTP(mobile: string, otp: string, credentials: DeviceCredentials): Promise<{ token: string; deviceToken: string }> {
    const response = await fetch('https://tb.tapi.videoready.tv/binge-mobile-services/pub/api/v1/user/authentication/validateOTP', {
      method: 'POST',
      headers: {
        'accept': 'application/json, text/plain, */*',
        'anonymousid': credentials.anonymousId,
        'content-type': 'application/json',
        'deviceid': credentials.deviceId,
        'origin': 'https://www.tataplaybinge.com',
        'platform': 'BINGE_ANYWHERE',
        'referer': 'https://www.tataplaybinge.com/',
        'user-agent': this.USER_AGENT,
      },
      body: JSON.stringify({
        mobileNumber: mobile,
        otp: otp,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to verify OTP: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.data?.userAuthenticateToken) {
      throw new Error(data.message || 'OTP validation failed');
    }

    return {
      token: data.data.userAuthenticateToken,
      deviceToken: data.data.deviceAuthenticateToken,
    };
  }

  static async getSubscriberDetails(mobile: string, token: string, credentials: DeviceCredentials): Promise<any> {
    const response = await fetch('https://tb.tapi.videoready.tv/binge-mobile-services/api/v4/subscriber/details', {
      method: 'GET',
      headers: {
        'accept': 'application/json, text/plain, */*',
        'anonymousid': credentials.anonymousId,
        'authorization': `bearer ${token}`,
        'devicetype': 'WEB',
        'mobilenumber': mobile,
        'origin': 'https://www.tataplaybinge.com',
        'platform': 'BINGE_ANYWHERE',
        'referer': 'https://www.tataplaybinge.com/',
        'user-agent': this.USER_AGENT,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get subscriber details: ${response.statusText}`);
    }

    return response.json();
  }

  static async loginUser(mobile: string, token: string, deviceToken: string, credentials: DeviceCredentials, subscriberData: any): Promise<LoginData> {
    const accountDetails = subscriberData.data?.accountDetails?.[0] || {};
    const dthStatus = accountDetails.dthStatus || '';
    
    let loginUrl = '';
    let loginBody: any = {};

    if (!dthStatus) {
      loginUrl = 'https://tb.tapi.videoready.tv/binge-mobile-services/api/v3/create/new/user';
      loginBody = {
        dthStatus: 'Non DTH User',
        subscriberId: mobile,
        login: 'OTP',
        mobileNumber: mobile,
        isPastBingeUser: false,
        eulaChecked: true,
        packageId: '',
      };
    } else if (dthStatus === 'DTH Without Binge') {
      loginUrl = 'https://tb.tapi.videoready.tv/binge-mobile-services/api/v3/create/new/user';
      loginBody = {
        dthStatus: 'DTH Without Binge',
        subscriberId: accountDetails.subscriberId || '',
        login: 'OTP',
        mobileNumber: mobile,
        baId: null,
        isPastBingeUser: false,
        eulaChecked: true,
        packageId: '',
        referenceId: null,
      };
    } else {
      loginUrl = 'https://tb.tapi.videoready.tv/binge-mobile-services/api/v3/update/exist/user';
      loginBody = {
        dthStatus: dthStatus,
        subscriberId: accountDetails.subscriberId || '',
        bingeSubscriberId: accountDetails.bingeSubscriberId || '',
        baId: accountDetails.baId || '',
        login: 'OTP',
        mobileNumber: mobile,
        payment_return_url: 'https://www.tataplaybinge.com/subscription-transaction/status',
        eulaChecked: true,
        packageId: '',
      };
    }

    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'accept': 'application/json, text/plain, */*',
        'anonymousid': credentials.anonymousId,
        'authorization': `bearer ${token}`,
        'content-type': 'application/json',
        'device': 'WEB',
        'deviceid': credentials.deviceId,
        'devicename': 'Web',
        'devicetoken': deviceToken,
        'origin': 'https://www.tataplaybinge.com',
        'platform': 'WEB',
        'referer': 'https://www.tataplaybinge.com/',
        'user-agent': this.USER_AGENT,
      },
      body: JSON.stringify(loginBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to login user: ${response.statusText}`);
    }

    return response.json();
  }

  static async logout(loginData: any, credentials: DeviceCredentials): Promise<string> {
    if (!loginData?.data) {
      return 'Already logged out';
    }

    const {
      baId,
      subscriberId,
      subscriptionStatus,
      dthStatus,
      userAuthenticateToken,
      deviceAuthenticateToken,
    } = loginData.data;

    const response = await fetch(`https://tb.tapi.videoready.tv/binge-mobile-services/api/v2/logout/${baId}`, {
      method: 'POST',
      headers: {
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9,da;q=0.8',
        'authorization': userAuthenticateToken,
        'cache-control': 'no-cache',
        'content-length': '0',
        'deviceid': credentials.deviceId,
        'devicetoken': deviceAuthenticateToken,
        'dthstatus': dthStatus,
        'locale': 'en',
        'origin': 'https://www.tataplaybinge.com',
        'platform': 'WEB',
        'referer': 'https://www.tataplaybinge.com/',
        'sec-fetch-site': 'cross-site',
        'subscriberid': subscriberId,
        'subscriptiontype': subscriptionStatus,
        'user-agent': this.USER_AGENT,
        'x-authenticated-userid': '',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to logout: ${response.statusText}`);
    }

    const data = await response.json();
    return data.message || 'Logged out successfully';
  }
}
