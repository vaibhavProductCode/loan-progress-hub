import { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/screens/SplashScreen';
import { PreLoanHome } from '@/components/screens/PreLoanHome';
import { ApplicationTracking } from '@/components/screens/ApplicationTracking';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useLoan } from '@/contexts/LoanContext';

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { hasApplication, application } = useLoan();

  // Check if we should show splash (only on initial load)
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

  // Show application tracking if user has an active application
  const hasActiveApplication = hasApplication && application?.state !== 'draft';

  return (
    <MobileLayout>
      {hasActiveApplication ? <ApplicationTracking /> : <PreLoanHome />}
    </MobileLayout>
  );
};

export default Index;
