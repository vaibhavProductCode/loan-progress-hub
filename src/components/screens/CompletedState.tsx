import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Home, CreditCard, BadgeCheck, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLoan } from '@/contexts/LoanContext';
import { cn } from '@/lib/utils';

export function CompletedState() {
  const navigate = useNavigate();
  const { currentApplicationId, applications } = useLoan();
  
  const application = applications.find(a => a.id === currentApplicationId);

  if (!application) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold font-serif">Loan Completed</h1>
        <span className="text-sm text-muted-foreground">{application.id}</span>
      </div>

      <div className="rounded-xl p-5 mb-6 bg-success-bg">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-success/20 text-success">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <span className="lp-state-badge mb-2 lp-state-success">
              Completed
            </span>
            <p className="text-sm text-foreground mt-2">
              Your loan has been successfully disbursed.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">Loan Details</h2>
        <div className="space-y-3">
          <div className="p-4 bg-card rounded-xl border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-medium text-foreground">Loan Amount</p>
                <p className="text-sm text-muted-foreground">
                  ₹{application.disbursement ? application.disbursement.amount.toLocaleString() : '2,50,000'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-medium text-foreground">Loan Type</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {application.loanType}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-card rounded-xl border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-medium text-foreground">Bank Account</p>
                <p className="text-sm text-muted-foreground">
                  {application.disbursement ? application.disbursement.bankAccount : 'XXXX-XXXX-1234'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <BadgeCheck className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="font-medium text-foreground">Status</p>
                <p className="text-sm text-muted-foreground">
                  Successfully Completed
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-card rounded-xl border border-border">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Interest Rate</p>
                <p className="font-medium text-foreground">12.5%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Tenure</p>
                <p className="font-medium text-foreground">36 months</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">EMI</p>
                <p className="font-medium text-foreground">₹8,500</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Payable</p>
                <p className="font-medium text-foreground">₹3,06,000</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-card rounded-xl border border-border">
            <h3 className="font-medium text-foreground mb-3">Borrower Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="text-sm font-medium">{application.userDetails?.fullName || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm font-medium">{application.userDetails?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Phone</span>
                <span className="text-sm font-medium">{application.userDetails?.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Employer</span>
                <span className="text-sm font-medium">{application.userDetails?.employer || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Monthly Income</span>
                <span className="text-sm font-medium">₹{application.userDetails?.monthlyIncome || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Loan Amount</span>
                <span className="text-sm font-medium">₹{application.userDetails?.loanAmount || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl p-4">
        <h3 className="font-semibold text-foreground mb-2">Next Steps</h3>
        <p className="text-sm text-muted-foreground">
          Your loan amount has been transferred to your bank account. You will receive a confirmation notification shortly.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Keep your loan ID for future reference and start making your EMI payments as per the schedule.
        </p>
      </div>

      <div className="mt-6">
        <Button className="w-full h-12" onClick={() => navigate('/')}>
          Back to Home <Home className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}