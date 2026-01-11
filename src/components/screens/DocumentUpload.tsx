import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, FileText, Upload, CheckCircle2, AlertCircle, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLoan } from '@/contexts/LoanContext';
import { cn } from '@/lib/utils';

type DocumentType = 'aadhaar' | 'pan' | 'income-certificate' | 'pension-slip' | 'house-paper' | 'house-tax' | 'acceptance-letter' | 'academic-degree' | 'college-info';

interface Document {
  id: string;
  type: DocumentType;
  name: string;
  required: boolean;
  uploaded: boolean;
  status: 'pending' | 'verifying' | 'accepted' | 'rejected';
  reason?: string;
  fileName?: string;
}

export function DocumentUpload() {
  const navigate = useNavigate();
  const { currentApplicationId, applications, updateApplicationState } = useLoan();
  const [countdown, setCountdown] = useState(4);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);

  const application = applications.find(a => a.id === currentApplicationId);

  useEffect(() => {
    if (!application) {
      navigate('/');
      return;
    }

    // Initialize documents based on loan type
    const newDocuments: Document[] = [];
    
    // Common documents for all loan types
    newDocuments.push(
      { id: 'aadhaar', type: 'aadhaar', name: 'Aadhaar Card', required: true, uploaded: false, status: 'pending' },
      { id: 'pan', type: 'pan', name: 'PAN Card', required: true, uploaded: false, status: 'pending' }
    );

    // Loan type specific documents
    if (application.loanType === 'personal') {
      newDocuments.push(
        { id: 'income-certificate', type: 'income-certificate', name: 'Income Certificate', required: true, uploaded: false, status: 'pending' },
        { id: 'pension-slip', type: 'pension-slip', name: 'Pension Slip', required: true, uploaded: false, status: 'pending' }
      );
    } else if (application.loanType === 'business') {
      newDocuments.push(
        { id: 'income-certificate', type: 'income-certificate', name: 'Income Certificate', required: true, uploaded: false, status: 'pending' },
        { id: 'pension-slip', type: 'pension-slip', name: 'Pension Slip', required: true, uploaded: false, status: 'pending' }
      );
    } else if (application.loanType === 'auto') {
      newDocuments.push(
        { id: 'income-certificate', type: 'income-certificate', name: 'Income Certificate', required: true, uploaded: false, status: 'pending' },
        { id: 'pension-slip', type: 'pension-slip', name: 'Pension Slip', required: true, uploaded: false, status: 'pending' }
      );
    }

    setDocuments(newDocuments);
  }, [application, navigate]);



  const handleDocumentUpload = (docId: string) => {
    setUploadingDocId(docId);
    
    // Simulate document upload and AI validation
    setTimeout(() => {
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === docId 
            ? { 
                ...doc, 
                uploaded: true, 
                status: 'verifying',
                fileName: `document_${docId}_${Date.now()}.pdf`
              } 
            : doc
        )
      );
      
      // Simulate AI validation after 2 seconds
      setTimeout(() => {
        setDocuments(prev => 
          prev.map(doc => 
            doc.id === docId 
              ? { 
                  ...doc, 
                  status: Math.random() > 0.2 ? 'accepted' : 'rejected', // 80% acceptance rate
                  reason: Math.random() > 0.2 ? undefined : 
                    (Math.random() > 0.5 ? 'Blurry image detected' : 'Incorrect information')
                } 
              : doc
          )
        );
        setUploadingDocId(null);
      }, 2000);
    }, 1000);
  };

  const handleBack = () => {
    navigate('/apply/loan-type');
  };

  if (!application) {
    return null;
  }

  const allUploaded = documents.length > 0 && documents.every(doc => doc.uploaded);

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold font-serif">Upload Required Documents</h1>
      </div>

      <div className="mb-6">
        <div className="bg-progress-bg rounded-xl p-4 mb-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium mb-1">Important Documents Required</p>
            <p className="text-sm text-muted-foreground">Please upload clear images or PDFs of the following documents.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {documents.map((doc) => (
            <div 
              key={doc.id} 
              className={cn(
                "p-4 rounded-xl border flex flex-col",
                doc.status === 'accepted' ? "border-success bg-success/5" :
                doc.status === 'rejected' ? "border-error bg-error/5" :
                doc.status === 'verifying' ? "border-warning bg-warning/5" :
                "border-border bg-card"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  doc.status === 'accepted' ? "bg-success/20 text-success" :
                  doc.status === 'rejected' ? "bg-error/20 text-error" :
                  doc.status === 'verifying' ? "bg-warning/20 text-warning" :
                  "bg-muted text-muted-foreground"
                )}>
                  {doc.status === 'accepted' ? <CheckCircle2 className="w-5 h-5" /> : 
                   doc.status === 'rejected' ? <AlertCircle className="w-5 h-5" /> : 
                   doc.status === 'verifying' ? <FileText className="w-5 h-5" /> : 
                   <FileText className="w-5 h-5" />}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{doc.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {doc.required ? 'Required' : 'Optional'}
                  </p>
                  
                  {doc.fileName && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      Uploaded: {doc.fileName}
                    </p>
                  )}
                  
                  {doc.status === 'verifying' && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs text-secondary">AI verifying document...</span>
                    </div>
                  )}
                  
                  {doc.status === 'accepted' && (
                    <div className="flex items-start gap-2 mt-2">
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-success">Document verified successfully</span>
                    </div>
                  )}
                  
                  {doc.status === 'rejected' && doc.reason && (
                    <div className="flex items-start gap-2 mt-2 p-2 bg-error/10 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-error">{doc.reason}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  {!doc.uploaded ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleDocumentUpload(doc.id)}
                      disabled={uploadingDocId === doc.id}
                    >
                      {uploadingDocId === doc.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-1" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Camera className="w-4 h-4 mr-1" />
                          Upload
                        </>
                      )}
                    </Button>
                  ) : doc.status === 'accepted' ? (
                    <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </div>
                  ) : doc.status === 'rejected' ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleDocumentUpload(doc.id)}
                      disabled={uploadingDocId === doc.id}
                    >
                      {uploadingDocId === doc.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-1" />
                          Re-uploading...
                        </>
                      ) : (
                        <>
                          <Camera className="w-4 h-4 mr-1" />
                          Re-upload
                        </>
                      )}
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <Button 
          className="w-full h-12" 
          onClick={() => {
            if (currentApplicationId) {
              updateApplicationState(currentApplicationId, 'submitted');
            }
            navigate('/application/submitted');
          }}
          disabled={!allUploaded}
        >
          Continue to Application <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}