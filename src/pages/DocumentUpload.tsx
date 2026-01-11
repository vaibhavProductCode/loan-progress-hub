import { DocumentUpload as DocumentUploadComponent } from '@/components/screens/DocumentUpload';
import { MobileLayout } from '@/components/layout/MobileLayout';

const DocumentUpload = () => {
  return (
    <MobileLayout hideNav>
      <DocumentUploadComponent />
    </MobileLayout>
  );
};

export default DocumentUpload;