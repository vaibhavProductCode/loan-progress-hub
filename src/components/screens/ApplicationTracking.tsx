import { useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import { useLoan } from '@/contexts/LoanContext';
import { cn } from '@/lib/utils';
import logo from '@/assets/loanpulse-logo.png';

const stateInfo: Record<string, { label: string; color: string; description: string }> = {
  'submitted': { 
    label: 'Submitted', 
    color: 'lp-state-progress',
    description: 'Your application has been received and is queued for processing.'
  },
  'verification-in-progress': { 
    label: 'Verification In Progress', 
    color: 'lp-state-progress',
    description: 'We are verifying your documents and details. This usually takes 2-3 days.'
  },
  'action-required': { 
    label: 'Action Required', 
    color: 'lp-state-action',
    description: 'We need some information from you to continue processing.'
  },
  'verification-resumed': { 
    label: 'Verification Resumed', 
    color: 'lp-state-progress',
    description: 'Thank you for your update. Verification has resumed.'
  },
  'review-in-progress': { 
    label: 'Under Review', 
    color: 'lp-state-progress',
    description: 'Your application is being reviewed by the lender.'
  },
  'approved': { 
    label: 'Approved', 
    color: 'lp-state-success',
    description: 'Congratulations! Your loan has been approved.'
  },
  'conditional-approval': { 
    label: 'Conditionally Approved', 
    color: 'lp-state-action',
    description: 'Your loan is approved with some conditions to fulfill.'
  },
  'rejected': { 
    label: 'Not Approved', 
    color: 'lp-state-rejected',
    description: 'We could not approve your application at this time.'
  },
  'disbursement-initiated': { 
    label: 'Disbursement In Progress', 
    color: 'lp-state-success',
    description: 'Your loan amount is being transferred to your bank account.'
  },
  'completed': { 
    label: 'Completed', 
    color: 'lp-state-success',
    description: 'Your loan has been successfully disbursed.'
  },
};

const timelineSteps = [
  { id: 'submitted', label: 'Submitted' },
  { id: 'verification', label: 'Verification' },
  { id: 'review', label: 'Review' },
  { id: 'decision', label: 'Decision' },
  { id: 'disbursement', label: 'Disbursement' },
];

export function ApplicationTracking() {
  const navigate = useNavigate();
  const { application } = useLoan();

  if (!application || application.state === 'draft') {
    navigate('/');
    return null;
  }

  const state = stateInfo[application.state] || stateInfo['submitted'];
  const isActionRequired = application.state === 'action-required';

  // Calculate timeline progress
  const getTimelineStatus = (stepId: string) => {
    const stateMap: Record<string, number> = {
      'submitted': 1,
      'verification-in-progress': 2,
      'action-required': 2,
      'verification-resumed': 2,
      'review-in-progress': 3,
      'approved': 4,
      'conditional-approval': 4,
      'rejected': 4,
      'disbursement-initiated': 5,
      'completed': 5,
    };

    const stepMap: Record<string, number> = {
      'submitted': 1,
      'verification': 2,
      'review': 3,
      'decision': 4,
      'disbursement': 5,
    };

    const currentProgress = stateMap[application.state] || 1;
    const stepProgress = stepMap[stepId];

    if (stepProgress < currentProgress) return 'complete';
    if (stepProgress === currentProgress) return 'active';
    return 'pending';
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <img src={logo} alt="LoanPulse" className="h-7" />
        <span className="text-sm text-muted-foreground">
          {application.id}
        </span>
      </div>

      {/* Current State Card */}
      <div className={cn(
        "rounded-xl p-5 mb-6",
        isActionRequired ? "bg-warning-bg" : "bg-card border border-border"
      )}>
        <div className="flex items-start gap-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            isActionRequired ? "bg-warning/20" : "bg-progress-bg"
          )}>
            {isActionRequired ? (
              <AlertCircle className="w-6 h-6 text-warning" />
            ) : (
              <FileText className="w-6 h-6 text-secondary" />
            )}
          </div>
          <div className="flex-1">
            <span className={cn("lp-state-badge mb-2", state.color)}>
              {state.label}
            </span>
            <p className="text-sm text-foreground mt-2">
              {state.description}
            </p>
          </div>
        </div>

        {isActionRequired && (
          <button 
            className="w-full mt-4 py-3 bg-warning text-warning-foreground rounded-lg font-semibold flex items-center justify-center gap-2"
            onClick={() => navigate('/application/action')}
          >
            View & Resolve
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Timeline */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Application Timeline
        </h2>
        
        <div className="relative">
          {timelineSteps.map((step, index) => {
            const status = getTimelineStatus(step.id);
            const isLast = index === timelineSteps.length - 1;

            return (
              <div key={step.id} className="lp-timeline-step">
                <div className={cn(
                  "lp-timeline-dot",
                  status === 'complete' && "lp-timeline-dot-complete",
                  status === 'active' && "lp-timeline-dot-active",
                  status === 'pending' && "lp-timeline-dot-pending"
                )}>
                  {status === 'complete' ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : status === 'active' ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-current" />
                  )}
                </div>
                <div>
                  <p className={cn(
                    "font-medium",
                    status === 'pending' ? "text-muted-foreground" : "text-foreground"
                  )}>
                    {step.label}
                  </p>
                  {status === 'active' && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      In progress
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* What's happening */}
      <div className="bg-muted/50 rounded-xl p-4">
        <h3 className="font-semibold text-foreground mb-2">What's happening now</h3>
        <p className="text-sm text-muted-foreground">
          {state.description}
        </p>
        <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Estimated: 2-3 business days</span>
        </div>
      </div>
    </div>
  );
}
