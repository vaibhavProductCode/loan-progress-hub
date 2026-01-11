import { ReviewState as ReviewStateComponent } from '@/components/screens/ReviewState';
import { MobileLayout } from '@/components/layout/MobileLayout';

const ReviewState = () => {
  return (
    <MobileLayout hideNav>
      <ReviewStateComponent />
    </MobileLayout>
  );
};

export default ReviewState;