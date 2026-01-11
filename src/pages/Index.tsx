import { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/screens/SplashScreen';
import { ProcessExplainer } from '@/components/screens/ProcessExplainer';
import { LoginScreen } from '@/components/screens/LoginScreen';
import { PreLoanHome } from '@/components/screens/PreLoanHome';
import { PostLoginHome } from '@/components/screens/PostLoginHome';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useLoan } from '@/contexts/LoanContext';

type AppFlow = 'splash' | 'explainer' | 'login' | 'home';

const Index = () => {
  const { 
    isAuthenticated, 
    hasCompletedOnboarding, 
    hasSeenExplainer,
    setAuthenticated,
    setExplainerSeen 
  } = useLoan();
  
  const [currentFlow, setCurrentFlow] = useState<AppFlow>('splash');

  useEffect(() => {
    // Check if splash was already shown this session
    const hasSeenSplash = sessionStorage.getItem('lp-splash-shown');
    
    if (hasSeenSplash) {
      // Determine where to go based on auth state
      if (isAuthenticated && hasCompletedOnboarding) {
        setCurrentFlow('home');
      } else if (hasSeenExplainer) {
        setCurrentFlow('login');
      } else {
        setCurrentFlow('explainer');
      }
    }
  }, [isAuthenticated, hasCompletedOnboarding, hasSeenExplainer]);

  const handleSplashComplete = () => {
    sessionStorage.setItem('lp-splash-shown', 'true');
    
    // If already authenticated, go to home
    if (isAuthenticated && hasCompletedOnboarding) {
      setCurrentFlow('home');
    } else if (hasSeenExplainer) {
      setCurrentFlow('login');
    } else {
      setCurrentFlow('explainer');
    }
  };

  const handleExplainerComplete = () => {
    setExplainerSeen();
    setCurrentFlow('login');
  };

  const handleLoginComplete = () => {
    setAuthenticated(true);
    setCurrentFlow('home');
  };

  // Splash Screen
  if (currentFlow === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Process Explainer (first-time users only)
  if (currentFlow === 'explainer') {
    return <ProcessExplainer onComplete={handleExplainerComplete} />;
  }

  // Login Screen
  if (currentFlow === 'login') {
    return <LoginScreen onComplete={handleLoginComplete} />;
  }

  // Home Screen - different views based on onboarding status
  if (isAuthenticated && hasCompletedOnboarding) {
    return (
      <MobileLayout>
        <PostLoginHome />
      </MobileLayout>
    );
  }

  // Pre-login marketing home (should not typically reach here, but fallback)
  return (
    <MobileLayout hideNav>
      <PreLoanHome />
    </MobileLayout>
  );
};

export default Index;
