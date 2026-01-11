import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle2, AlertCircle, ChevronRight, Home, CreditCard, Banknote, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLoan } from '@/contexts/LoanContext';
import { cn } from '@/lib/utils';

export function DisbursementState() {
  const navigate = useNavigate();
  const { currentApplicationId, applications, updateApplicationState } = useLoan();
  const [countdown, setCountdown] = useState(4);
  
  const application = applications.find(a => a.id === currentApplicationId);



  if (!application) {
    navigate('/');
    return null;
  }

  const isDisbursementInitiated = application.state === 'disbursement-initiated';
  const isCompleted = application.state === 'completed';

  return (
    <div className="min-h-screen flex flex-col px-6 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold font-serif">Disbursement Process</h1>
        <span className="text-sm text-muted-foreground">{application.id}</span>
      </div>

      <div className={cn("rounded-xl p-5 mb-6", 
        isCompleted ? "bg-success-bg" : "bg-card border border-border")}>
        <div className="flex items-start gap-4">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center",
            isCompleted ? "bg-success/20 text-success" : "bg-progress-bg")}>
            {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <CreditCard className="w-6 h-6 text-secondary" />}
          </div>
          <div className="flex-1">
            <span className={cn("lp-state-badge mb-2",
              isCompleted ? "lp-state-success" : "lp-state-progress")}>
              {isCompleted ? "Completed" : "Disbursement In Progress"}
            </span>
            <p className="text-sm text-foreground mt-2">
              {isCompleted 
                ? "Your loan has been successfully disbursed." 
                : "Your loan amount is being transferred to your bank account."}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Disbursement Details</h2>
        <div className="space-y-3">
          <div className="p-4 bg-card rounded-xl border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-progress-bg flex items-center justify-center">
                <Banknote className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Loan Amount</p>
                <p className="text-sm text-muted-foreground">
                  {application.disbursement ? `₹${application.disbursement.amount.toLocaleString()}` : '₹2,50,000'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-progress-bg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Bank Account</p>
                <p className="text-sm text-muted-foreground">
                  {application.disbursement ? application.disbursement.bankAccount : 'XXXX-XXXX-1234'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-card rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-progress-bg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Expected Date</p>
                <p className="text-sm text-muted-foreground">
                  {application.disbursement ? 
                    new Date(application.disbursement.expectedDate).toLocaleDateString() : 
                    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl p-4">
        <h3 className="font-semibold text-foreground mb-2">What's happening now</h3>
        <p className="text-sm text-muted-foreground">
          Your loan amount is being processed for transfer to your designated bank account.
        </p>
        <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" /><span>Typically completed within 24-48 hours</span>
        </div>

      </div>

      <div className="mt-6">
        <Button className="w-full h-12" onClick={() => {
          if (currentApplicationId) {
            updateApplicationState(currentApplicationId, 'completed');
          }
          navigate('/application/completed');
        }}>
          Continue to Completion <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
        <Button variant="outline" className="w-full h-12 mt-2" onClick={() => navigate('/')}>
          <Home className="w-5 h-5 mr-2" /> Back to Home
        </Button>
      </div>
    </div>
  );
}