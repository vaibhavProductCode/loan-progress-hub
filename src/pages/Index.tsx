import { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/screens/SplashScreen';
import { PreLoanHome } from '@/components/screens/PreLoanHome';
import { MobileLayout } from '@/components/layout/MobileLayout';

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('lp-splash-shown');
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem('lp-splash-shown', 'true');
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <MobileLayout>
      <PreLoanHome />
    </MobileLayout>
  );
};

export default Index;
