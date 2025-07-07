import { useState, useEffect } from 'react';
import type { LoginStatus } from '@shared/schema';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get device ID from localStorage
    let storedDeviceId = localStorage.getItem('tataplay-device-id');
    
    if (storedDeviceId) {
      setDeviceId(storedDeviceId);
      checkLoginStatus(storedDeviceId);
    } else {
      setIsLoading(false);
    }
  }, []);

  const checkLoginStatus = async (deviceId: string) => {
    try {
      const response = await fetch('/api/auth/status', {
        headers: {
          'X-Device-Id': deviceId,
        },
      });

      if (response.ok) {
        const data: LoginStatus = await response.json();
        setIsLoggedIn(data.isLoggedIn);
        if (data.playlistUrl) {
          setPlaylistUrl(data.playlistUrl);
        }
      }
    } catch (error) {
      console.error('Failed to check login status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeviceId = (newDeviceId: string) => {
    setDeviceId(newDeviceId);
    localStorage.setItem('tataplay-device-id', newDeviceId);
  };

  const handleLoginSuccess = async () => {
    setIsLoggedIn(true);
    if (deviceId) {
      await checkLoginStatus(deviceId);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPlaylistUrl('');
    if (deviceId) {
      localStorage.removeItem('tataplay-device-id');
    }
    setDeviceId(null);
  };

  return {
    isLoggedIn,
    playlistUrl,
    deviceId,
    isLoading,
    setDeviceId: handleDeviceId,
    onLoginSuccess: handleLoginSuccess,
    onLogout: handleLogout,
  };
}
