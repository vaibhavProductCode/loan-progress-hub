import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle2, AlertCircle, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLoan } from '@/contexts/LoanContext';
import { cn } from '@/lib/utils';

export function VerificationState() {
  const navigate = useNavigate();
  const { currentApplicationId, applications, updateApplicationState } = useLoan();
  const [countdown, setCountdown] = useState(4);
  
  const application = applications.find(a => a.id === currentApplicationId);



  if (!application) {
    navigate('/');
    return null;
  }

  const isActionRequired = application.state === 'action-required';
  const documents = application.documents || [];

  return (
    <div className="min-h-screen flex flex-col px-6 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold font-serif">Verification In Progress</h1>
        <span className="text-sm text-muted-foreground">{application.id}</span>
      </div>

      <div className={cn("rounded-xl p-5 mb-6", isActionRequired ? "bg-warning-bg" : "bg-card border border-border")}>
        <div className="flex items-start gap-4">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", isActionRequired ? "bg-warning/20" : "bg-progress-bg")}>
            {isActionRequired ? <AlertCircle className="w-6 h-6 text-warning" /> : <FileText className="w-6 h-6 text-secondary" />}
          </div>
          <div className="flex-1">
            <span className={cn("lp-state-badge mb-2", isActionRequired ? "lp-state-action" : "lp-state-progress")}>
              {isActionRequired ? "Action Required" : "Verification In Progress"}
            </span>
            <p className="text-sm text-foreground mt-2">
              {isActionRequired 
                ? "We need some information from you to continue processing." 
                : "We are verifying your documents and details."}
            </p>
          </div>
        </div>
        {isActionRequired && (
          <button className="w-full mt-4 py-3 bg-warning text-warning-foreground rounded-lg font-semibold flex items-center justify-center gap-2" onClick={() => navigate('/application/action')}>
            View & Resolve <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Documents Being Verified</h2>
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{doc.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{doc.status}</p>
              </div>
              <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", 
                doc.status === 'verified' ? "bg-success-bg text-success" : 
                doc.status === 'rejected' ? "bg-error-bg text-error" : 
                "bg-muted")}>
                {doc.status === 'verified' ? <CheckCircle2 className="w-4 h-4" /> : 
                 doc.status === 'rejected' ? <AlertCircle className="w-4 h-4" /> : 
                 <Clock className="w-4 h-4 text-muted-foreground" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl p-4">
        <h3 className="font-semibold text-foreground mb-2">What's happening now</h3>
        <p className="text-sm text-muted-foreground">
          Our team is carefully reviewing each document to ensure everything is in order.
        </p>
        <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" /><span>Estimated: 1-2 business days</span>
        </div>

      </div>

      <div className="mt-6">
        <Button className="w-full h-12" onClick={() => {
          if (currentApplicationId) {
            updateApplicationState(currentApplicationId, 'review-in-progress');
          }
          navigate('/application/review');
        }}>
          Continue to Review <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
        <Button variant="outline" className="w-full h-12 mt-2" onClick={() => navigate('/')}>
          <Home className="w-5 h-5 mr-2" /> Back to Home
        </Button>
      </div>
    </div>
  );
}