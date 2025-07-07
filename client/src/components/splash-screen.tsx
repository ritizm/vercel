import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    // Simulate video loading and minimum display time
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Placeholder for video - using image since we can't include video files */}
      <div 
        className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&w=1920&h=1080&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* TataPlay Logo */}
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <h1 className="text-4xl font-bold">
              <span className="text-white">Tata</span>
              <span className="text-red-600">Play</span>
            </h1>
          </div>
          
          <p className="text-white/80 text-lg mb-8">Streaming Manager</p>
        </div>
      </div>
      
      {/* Loading Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-3 text-white/80">
          <div 
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: 'var(--tata-red)', borderTopColor: 'transparent' }}
          ></div>
          <span className="text-sm font-medium">Loading TataPlay...</span>
        </div>
      </div>
    </div>
  );
}
