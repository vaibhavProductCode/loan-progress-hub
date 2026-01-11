import { VerificationState as VerificationStateComponent } from '@/components/screens/VerificationState';
import { MobileLayout } from '@/components/layout/MobileLayout';

const VerificationState = () => {
  return (
    <MobileLayout hideNav>
      <VerificationStateComponent />
    </MobileLayout>
  );
};

export default VerificationState;