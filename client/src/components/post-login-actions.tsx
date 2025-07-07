import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  Copy, 
  LogOut, 
  CheckCircle, 
  Info, 
  Tv, 
  Smartphone, 
  Monitor, 
  Play
} from 'lucide-react';

interface PostLoginActionsProps {
  playlistUrl: string;
  deviceId: string;
  onLogout: () => void;
}

export default function PostLoginActions({ playlistUrl, deviceId, onLogout }: PostLoginActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDownloadPlaylist = async () => {
    try {
      const response = await fetch(`/api/playlist.m3u`, {
        headers: {
          'X-Device-Id': deviceId,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch playlist');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'tataplay-playlist.m3u';
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: "M3U playlist file is downloading",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download playlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopyUrl = async () => {
    try {
      // Create URL with device ID parameter for external players
      const urlWithAuth = `${playlistUrl}?device=${encodeURIComponent(deviceId)}`;
      
      await navigator.clipboard.writeText(urlWithAuth);
      toast({
        title: "Copied!",
        description: "Playlist URL with auth copied to clipboard",
      });
    } catch (error) {
      // Fallback for older browsers
      const urlWithAuth = `${playlistUrl}?device=${encodeURIComponent(deviceId)}`;
      const input = document.createElement('input');
      input.value = urlWithAuth;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      
      toast({
        title: "Copied!",
        description: "Playlist URL with auth copied to clipboard",
      });
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'X-Device-Id': deviceId,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Logged Out",
          description: data.message || "You have been logged out successfully",
        });
        
        setTimeout(() => {
          onLogout();
        }, 1000);
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Logout Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Success Message */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <div>
            <p className="text-green-400 font-medium">Login Successful!</p>
            <p className="text-green-300/80 text-sm">You can now access streaming features</p>
          </div>
        </div>
      </div>

      {/* Streaming Actions */}
      <div className="space-y-4">
        {/* Download Playlist */}
        <Button
          onClick={handleDownloadPlaylist}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="flex items-center justify-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Download M3U Playlist</span>
          </span>
        </Button>

        {/* Playlist URL */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-muted-foreground">
            Playlist URL (Click to copy)
          </label>
          <div className="relative">
            <Input
              type="text"
              value={`${playlistUrl}?device=${encodeURIComponent(deviceId)}`}
              readOnly
              onClick={handleCopyUrl}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm cursor-pointer hover:bg-gray-700 transition-colors pr-12"
            />
            <button
              onClick={handleCopyUrl}
              className="absolute right-3 top-3 text-muted-foreground hover:text-white transition-colors"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Streaming Info */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <h3 className="text-white font-medium mb-3 flex items-center">
            <Info className="h-4 w-4 text-blue-400 mr-2" />
            Streaming Information
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Format:</span>
              <span className="text-white font-mono">M3U8/MPD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">DRM:</span>
              <span className="text-white font-mono">Widevine/PlayReady</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quality:</span>
              <span className="text-white font-mono">HD/FHD</span>
            </div>
          </div>
        </div>

        {/* Compatible Players */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <h3 className="text-white font-medium mb-3 flex items-center">
            <Tv className="h-4 w-4 text-green-400 mr-2" />
            Compatible Players
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <span className="text-white">TiviMate</span>
            </div>
            <div className="flex items-center space-x-2">
              <Monitor className="h-4 w-4 text-muted-foreground" />
              <span className="text-white">VLC Player</span>
            </div>
            <div className="flex items-center space-x-2">
              <Play className="h-4 w-4 text-muted-foreground" />
              <span className="text-white">Kodi</span>
            </div>
            <div className="flex items-center space-x-2">
              <Tv className="h-4 w-4 text-muted-foreground" />
              <span className="text-white">SparkleTV</span>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <Button
        onClick={handleLogout}
        disabled={isLoading}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <span className="flex items-center justify-center space-x-2">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </span>
      </Button>
    </div>
  );
}
