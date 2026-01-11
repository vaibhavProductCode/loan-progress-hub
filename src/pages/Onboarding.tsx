import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingScreen } from '@/components/screens/OnboardingScreen';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useLoan } from '@/contexts/LoanContext';

const Onboarding = () => {
  const navigate = useNavigate();
  const { isAuthenticated, hasCompletedOnboarding } = useLoan();

  // Redirect if already completed onboarding
  useEffect(() => {
    if (isAuthenticated && hasCompletedOnboarding) {
      navigate('/');
    }
  }, [isAuthenticated, hasCompletedOnboarding, navigate]);

  return (
    <MobileLayout hideNav>
      <OnboardingScreen />
    </MobileLayout>
  );
};

export default Onboarding;
