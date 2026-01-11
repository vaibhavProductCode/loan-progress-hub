import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle2, AlertCircle, ChevronRight, Home, BadgeCheck, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLoan } from '@/contexts/LoanContext';
import { cn } from '@/lib/utils';

export function DecisionState() {
  const navigate = useNavigate();
  const { currentApplicationId, applications, updateApplicationState } = useLoan();
  const [countdown, setCountdown] = useState(4);
  
  const application = applications.find(a => a.id === currentApplicationId);



  if (!application) {
    navigate('/');
    return null;
  }

  const isApproved = application.state === 'approved';
  const isConditionalApproval = application.state === 'conditional-approval';
  const isRejected = application.state === 'rejected';

  return (
    <div className="min-h-screen flex flex-col px-6 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold font-serif">Decision Made</h1>
        <span className="text-sm text-muted-foreground">{application.id}</span>
      </div>

      <div className={cn("rounded-xl p-5 mb-6", 
        isRejected ? "bg-error-bg" : 
        isConditionalApproval ? "bg-warning-bg" : 
        "bg-success-bg")}>
        <div className="flex items-start gap-4">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center",
            isRejected ? "bg-error/20 text-error" : 
            isConditionalApproval ? "bg-warning/20 text-warning" : 
            "bg-success/20 text-success")}>
            {isRejected ? <AlertCircle className="w-6 h-6" /> : 
             isConditionalApproval ? <AlertCircle className="w-6 h-6" /> : 
             <CheckCircle2 className="w-6 h-6" />}
          </div>
          <div className="flex-1">
            <span className={cn("lp-state-badge mb-2",
              isRejected ? "lp-state-rejected" : 
              isConditionalApproval ? "lp-state-action" : 
              "lp-state-success")}>
              {isRejected ? "Not Approved" : 
               isConditionalApproval ? "Conditionally Approved" : 
               "Approved"}
            </span>
            <p className="text-sm text-foreground mt-2">
              {isRejected 
                ? "We could not approve your application at this time." 
                : isConditionalApproval 
                  ? "Your loan is approved with some conditions to fulfill."
                  : "Congratulations! Your loan has been approved."}
            </p>
          </div>
        </div>
        
        {isRejected && application.rejection && (
          <div className="mt-4 p-3 bg-error/10 rounded-lg">
            <p className="text-sm font-medium text-error">Reason:</p>
            <p className="text-sm text-error">{application.rejection.reason}</p>
          </div>
        )}
        
        {isConditionalApproval && (
          <div className="mt-4 p-3 bg-warning/10 rounded-lg">
            <p className="text-sm font-medium text-warning">Conditions:</p>
            <p className="text-sm text-warning">Please fulfill the required conditions to proceed.</p>
          </div>
        )}
        
        {(isConditionalApproval || isRejected) && (
          <button className="w-full mt-4 py-3 bg-warning text-warning-foreground rounded-lg font-semibold flex items-center justify-center gap-2" onClick={() => navigate('/application/action')}>
            View Details <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Decision Summary</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border">
            <div className="w-10 h-10 rounded-lg bg-progress-bg flex items-center justify-center">
              <Scale className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Risk Assessment</p>
              <p className="text-sm text-muted-foreground">Comprehensive evaluation completed</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border">
            <div className="w-10 h-10 rounded-lg bg-progress-bg flex items-center justify-center">
              <BadgeCheck className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Eligibility Check</p>
              <p className="text-sm text-muted-foreground">All criteria have been reviewed</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border">
            <div className="w-10 h-10 rounded-lg bg-progress-bg flex items-center justify-center">
              <FileText className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">Documentation Verification</p>
              <p className="text-sm text-muted-foreground">All documents have been validated</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-success" />
          </div>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl p-4">
        <h3 className="font-semibold text-foreground mb-2">Next Steps</h3>
        <p className="text-sm text-muted-foreground">
          {isRejected 
            ? "If you believe this decision was made in error, you can reapply after addressing the issues."
            : isConditionalApproval 
              ? "Complete the required conditions to finalize your loan approval."
              : "Your loan is ready for disbursement. Funds will be transferred soon."}
        </p>

      </div>

      <div className="mt-6">
        <Button className="w-full h-12" onClick={() => {
          if (currentApplicationId) {
            updateApplicationState(currentApplicationId, 'disbursement-initiated');
          }
          navigate('/application/disbursement');
        }}>
          Continue to Disbursement <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
        <Button variant="outline" className="w-full h-12 mt-2" onClick={() => navigate('/')}>
          <Home className="w-5 h-5 mr-2" /> Back to Home
        </Button>
      </div>
    </div>
  );
}