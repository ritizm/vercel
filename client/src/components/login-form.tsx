import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Smartphone, Shield, Send } from 'lucide-react';

interface LoginFormProps {
  onLoginSuccess: () => void;
  deviceId: string | null;
  setDeviceId: (id: string) => void;
}

export default function LoginForm({ onLoginSuccess, deviceId, setDeviceId }: LoginFormProps) {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(deviceId && { 'X-Device-Id': deviceId }),
        },
        body: JSON.stringify({ mobile }),
      });

      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Handle non-JSON responses (HTML error pages, etc.)
        const text = await response.text();
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      if (response.ok && data.success) {
        if (data.deviceId) {
          setDeviceId(data.deviceId);
        }
        
        toast({
          title: "OTP Sent Successfully",
          description: "Check your SMS for the 4-digit verification code",
        });
        
        setShowOtp(true);
        startCountdown();
      } else {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }
    } catch (error: any) {
      console.error('Send OTP error:', error);
      toast({
        title: "Failed to Send OTP",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 4-digit OTP",
        variant: "destructive",
      });
      return;
    }

    if (!deviceId) {
      toast({
        title: "Session Error",
        description: "Please try sending OTP again",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-Id': deviceId,
        },
        body: JSON.stringify({ mobile, otp }),
      });

      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Handle non-JSON responses (HTML error pages, etc.)
        const text = await response.text();
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      if (response.ok && data.success) {
        toast({
          title: "Login Successful!",
          description: "Welcome to TataPlay Streaming",
        });
        
        onLoginSuccess();
      } else {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      toast({
        title: "OTP Verification Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 4);
    setOtp(numericValue);
    
    // Auto-verify when 4 digits are entered
    if (numericValue.length === 4) {
      setTimeout(() => handleVerifyOtp(), 500);
    }
  };

  const handleMobileChange = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 10);
    setMobile(numericValue);
  };

  return (
    <div className="space-y-6">
      {/* Mobile Number Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-muted-foreground">
          Mobile Number
        </label>
        <div className="relative">
          <Input
            type="tel"
            value={mobile}
            onChange={(e) => handleMobileChange(e.target.value)}
            className="w-full px-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all pr-12"
            placeholder="Enter 10-digit mobile number"
            disabled={showOtp}
            maxLength={10}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isLoading && countdown === 0) {
                handleSendOtp();
              }
            }}
          />
          <div className="absolute right-4 top-4">
            <Smartphone className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Send OTP Button */}
      <Button
        onClick={handleSendOtp}
        disabled={isLoading || countdown > 0}
        className="tata-button-primary"
      >
        <span className="flex items-center justify-center space-x-2">
          <Send className="h-4 w-4" />
          <span>
            {countdown > 0 ? `Resend in ${countdown}s` : 'Send OTP'}
          </span>
        </span>
      </Button>

      {/* OTP Section */}
      {showOtp && (
        <div className="space-y-4 pt-4 border-t border-gray-700 animate-slide-up">
          {/* OTP Info */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-blue-400 text-sm font-medium">OTP Sent Successfully</p>
                <p className="text-blue-300/80 text-xs mt-1">Check your SMS for 4-digit verification code</p>
              </div>
            </div>
          </div>

          {/* OTP Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted-foreground">
              Enter 4-digit OTP
            </label>
            <Input
              type="text"
              value={otp}
              onChange={(e) => handleOtpChange(e.target.value)}
              className="w-full px-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all text-center text-2xl font-mono tracking-widest"
              placeholder="• • • •"
              maxLength={4}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleVerifyOtp();
                }
              }}
            />
          </div>

          {/* Verify OTP Button */}
          <Button
            onClick={handleVerifyOtp}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="flex items-center justify-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Verify OTP</span>
            </span>
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-6">
          <div className="inline-flex items-center space-x-3">
            <div 
              className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: 'var(--tata-red)', borderTopColor: 'transparent' }}
            ></div>
            <span className="text-muted-foreground">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
}
