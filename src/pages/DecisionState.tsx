import { DecisionState as DecisionStateComponent } from '@/components/screens/DecisionState';
import { MobileLayout } from '@/components/layout/MobileLayout';

const DecisionState = () => {
  return (
    <MobileLayout hideNav>
      <DecisionStateComponent />
    </MobileLayout>
  );
};

export default DecisionState;