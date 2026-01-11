import { DisbursementState as DisbursementStateComponent } from '@/components/screens/DisbursementState';
import { MobileLayout } from '@/components/layout/MobileLayout';

const DisbursementState = () => {
  return (
    <MobileLayout hideNav>
      <DisbursementStateComponent />
    </MobileLayout>
  );
};

export default DisbursementState;