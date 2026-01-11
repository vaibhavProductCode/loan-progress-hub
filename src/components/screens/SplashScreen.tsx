import { useEffect, useState } from 'react';
import logo from '@/assets/loanpulse-logo.png';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex flex-col items-center gap-6 lp-animate-fade-in">
        <img 
          src={logo} 
          alt="LoanPulse" 
          className="h-16 object-contain"
        />
        <p className="text-muted-foreground text-center text-base lp-animate-fade-in lp-stagger-2 opacity-0">
          Know where your loan stands
        </p>
      </div>
      
      {/* Loading indicator */}
      <div className="absolute bottom-24 lp-animate-fade-in lp-stagger-3 opacity-0">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-secondary lp-animate-pulse-soft" style={{ animationDelay: '0s' }} />
          <span className="w-2 h-2 rounded-full bg-secondary lp-animate-pulse-soft" style={{ animationDelay: '0.2s' }} />
          <span className="w-2 h-2 rounded-full bg-secondary lp-animate-pulse-soft" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
}
