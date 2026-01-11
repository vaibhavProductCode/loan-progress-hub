import { ApplicationSubmittedState as ApplicationSubmittedStateComponent } from '@/components/screens/ApplicationSubmittedState';
import { MobileLayout } from '@/components/layout/MobileLayout';

const ApplicationSubmittedState = () => {
  return (
    <MobileLayout hideNav>
      <ApplicationSubmittedStateComponent />
    </MobileLayout>
  );
};

export default ApplicationSubmittedState;