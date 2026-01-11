import { CompletedState as CompletedStateComponent } from '@/components/screens/CompletedState';
import { MobileLayout } from '@/components/layout/MobileLayout';

const CompletedState = () => {
  return (
    <MobileLayout hideNav>
      <CompletedStateComponent />
    </MobileLayout>
  );
};

export default CompletedState;