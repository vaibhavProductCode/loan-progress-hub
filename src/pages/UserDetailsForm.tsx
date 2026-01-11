import { UserDetailsForm as UserDetailsFormComponent } from '@/components/screens/UserDetailsForm';
import { MobileLayout } from '@/components/layout/MobileLayout';

const UserDetailsForm = () => {
  return (
    <MobileLayout hideNav>
      <UserDetailsFormComponent />
    </MobileLayout>
  );
};

export default UserDetailsForm;