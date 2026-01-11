import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle2, AlertCircle, ChevronRight, Home, Users, FileSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLoan } from '@/contexts/LoanContext';
import { cn } from '@/lib/utils';

export function ReviewState() {
  const navigate = useNavigate();
  const { currentApplicationId, applications, updateApplicationState } = useLoan();
  const [countdown, setCountdown] = useState(4);
  
  const application = applications.find(a => a.id === currentApplicationId);



  if (!application) {
    navigate('/');
    return null;
  }

  const isConditionalApproval = application.state === 'conditional-approval';
  const isRejected = application.state === 'rejected';

  return (
    <div className="min-h-screen flex flex-col px-6 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold font-serif">Application Under Review</h1>
        <span className="text-sm text-muted-foreground">{application.id}</span>
      </div>

      <div className={cn("rounded-xl p-5 mb-6", 
        isConditionalApproval ? "bg-warning-bg" : 
        isRejected ? "bg-error-bg" : "bg-card border border-border")}>
        <div className="flex items-start gap-4">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center",
            isConditionalApproval ? "bg-warning/20" : 
            isRejected ? "bg-error/20" : "bg-progress-bg")}>
            {isRejected ? <AlertCircle className="w-6 h-6 text-error" /> : 
             isConditionalApproval ? <AlertCircle className="w-6 h-6 text-warning" /> : 
             <FileText className="w-6 h-6 text-secondary" />}
          </div>
          <div className="flex-1">
            <span className={cn("lp-state-badge mb-2",
              isConditionalApproval ? "lp-state-action" : 
              isRejected ? "lp-state-rejected" : "lp-state-progress")}>
              {isRejected ? "Not Approved" : 
               isConditionalApproval ? "Conditionally Approved" : 
               "Under Review"}
            </span>
            <p className="text-sm text-foreground mt-2">
              {isRejected 
                ? "We could not approve your application at this time." 
                : isConditionalApproval 
                  ? "Your loan is approved with some conditions to fulfill."
                  : "Your application is being reviewed by the lender."}
            </p>
          </div>
        </div>
        {(isConditionalApproval || isRejected) && (
          <button className="w-full mt-4 py-3 bg-warning text-warning-foreground rounded-lg font-semibold flex items-center justify-center gap-2" onClick={() => navigate('/application/action')}>
            View Details <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Review Process</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border">
            <div className="w-10 h-10 rounded-lg bg-progress-bg flex items-center justify-center">
              <Users className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Expert Evaluation</p>
              <p className="text-sm text-muted-foreground">Our underwriters assess your application</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border">
            <div className="w-10 h-10 rounded-lg bg-progress-bg flex items-center justify-center">
              <FileSearch className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Documentation Review</p>
              <p className="text-sm text-muted-foreground">All submitted documents are verified</p>
            </div>
            <Clock className="w-5 h-5 text-secondary" />
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border">
            <div className="w-10 h-10 rounded-lg bg-progress-bg flex items-center justify-center">
              <FileText className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Final Assessment</p>
              <p className="text-sm text-muted-foreground">Comprehensive risk evaluation</p>
            </div>
            <Clock className="w-5 h-5 text-secondary" />
          </div>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl p-4">
        <h3 className="font-semibold text-foreground mb-2">What's happening now</h3>
        <p className="text-sm text-muted-foreground">
          Your application is undergoing final evaluation by our lending experts.
        </p>
        <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" /><span>Estimated: 1-2 business days</span>
        </div>

      </div>

      <div className="mt-6">
        <Button className="w-full h-12" onClick={() => {
          if (currentApplicationId) {
            updateApplicationState(currentApplicationId, 'approved');
          }
          navigate('/application/decision');
        }}>
          Continue to Decision <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
        <Button variant="outline" className="w-full h-12 mt-2" onClick={() => navigate('/')}>
          <Home className="w-5 h-5 mr-2" /> Back to Home
        </Button>
      </div>
    </div>
  );
}