import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import SplashScreen from '@/components/splash-screen';
import LoginForm from '@/components/login-form';
import PostLoginActions from '@/components/post-login-actions';
import { Play, Zap, Shield, MonitorPlay } from 'lucide-react';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const { isLoggedIn, playlistUrl, deviceId, isLoading, setDeviceId, onLoginSuccess, onLogout } = useAuth();

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center tata-gradient">
        <div className="text-center">
          <div 
            className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: 'var(--tata-red)', borderTopColor: 'transparent' }}
          ></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 tata-gradient">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-pattern"></div>
      
      {/* Main Content */}
      <div className="relative w-full max-w-md">
        {/* Logo/Brand Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--tata-red)' }}
            >
              <Play className="text-white h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">
              <span className="text-white">Tata</span>
              <span style={{ color: 'var(--tata-red)' }}>Play</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">Streaming Manager</p>
        </div>

        {/* Main Card */}
        <div className="tata-card p-8 animate-slide-up">
          {/* Dynamic Page Title */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-semibold text-white transition-all duration-300">
              {isLoggedIn ? 'Welcome to TataPlay Streaming' : 'Secure Login with OTP'}
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
              {isLoggedIn ? 'Access your streaming features below' : 'Enter your registered mobile number'}
            </p>
          </div>

          {/* Content */}
          {isLoggedIn ? (
            <PostLoginActions
              playlistUrl={playlistUrl}
              deviceId={deviceId!}
              onLogout={onLogout}
            />
          ) : (
            <LoginForm
              onLoginSuccess={onLoginSuccess}
              deviceId={deviceId}
              setDeviceId={setDeviceId}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-muted-foreground text-xs">
            Powered by TataPlay API
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <span className="flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span>Secure</span>
            </span>
            <span className="flex items-center space-x-1">
              <Zap className="h-3 w-3" />
              <span>Fast</span>
            </span>
            <span className="flex items-center space-x-1">
              <MonitorPlay className="h-3 w-3" />
              <span>HD Quality</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
