import { OnboardingScreen } from '@/components/screens/OnboardingScreen';
import { MobileLayout } from '@/components/layout/MobileLayout';

const Onboarding = () => {
  return (
    <MobileLayout hideNav>
      <OnboardingScreen />
    </MobileLayout>
  );
};

export default Onboarding;
