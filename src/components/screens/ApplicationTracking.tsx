import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import { useLoan } from '@/contexts/LoanContext';
import { cn } from '@/lib/utils';
import logo from '@/assets/loanpulse-logo.png';

const stateInfo: Record<string, { label: string; color: string; description: string }> = {
  'submitted': { label: 'Submitted', color: 'lp-state-progress', description: 'Your application has been received and is queued for processing.' },
  'verification-in-progress': { label: 'Verification In Progress', color: 'lp-state-progress', description: 'We are verifying your documents and details.' },
  'action-required': { label: 'Action Required', color: 'lp-state-action', description: 'We need some information from you to continue processing.' },
  'verification-resumed': { label: 'Verification Resumed', color: 'lp-state-progress', description: 'Thank you for your update. Verification has resumed.' },
  'review-in-progress': { label: 'Under Review', color: 'lp-state-progress', description: 'Your application is being reviewed by the lender.' },
  'approved': { label: 'Approved', color: 'lp-state-success', description: 'Congratulations! Your loan has been approved.' },
  'conditional-approval': { label: 'Conditionally Approved', color: 'lp-state-action', description: 'Your loan is approved with some conditions to fulfill.' },
  'rejected': { label: 'Not Approved', color: 'lp-state-rejected', description: 'We could not approve your application at this time.' },
  'disbursement-initiated': { label: 'Disbursement In Progress', color: 'lp-state-success', description: 'Your loan amount is being transferred to your bank account.' },
  'completed': { label: 'Completed', color: 'lp-state-success', description: 'Your loan has been successfully disbursed.' },
};

const timelineSteps = [
  { id: 'submitted', label: 'Submitted' },
  { id: 'verification', label: 'Verification' },
  { id: 'review', label: 'Review' },
  { id: 'decision', label: 'Decision' },
  { id: 'disbursement', label: 'Disbursement' },
];

// State progression order for auto-advance (demo mode)
const stateProgression = [
  'verification-in-progress',
  'review-in-progress',
  'approved',
  'disbursement-initiated',
  'completed'
];

export function ApplicationTracking() {
  const navigate = useNavigate();
  const { currentApplicationId, applications, updateApplicationState } = useLoan();
  const application = applications.find(a => a.id === currentApplicationId) || applications.find(a => !['completed', 'rejected', 'closed-incomplete'].includes(a.state));

  if (!application || application.state === 'draft') {
    navigate('/');
    return null;
  }

  const state = stateInfo[application.state] || stateInfo['submitted'];
  const isActionRequired = application.state === 'action-required';
  const isTerminalState = ['completed', 'rejected', 'closed-incomplete'].includes(application.state);

  const getTimelineStatus = (stepId: string) => {
    const stateMap: Record<string, number> = {
      'submitted': 1, 'verification-in-progress': 2, 'action-required': 2, 'verification-resumed': 2,
      'review-in-progress': 3, 'approved': 4, 'conditional-approval': 4, 'rejected': 4,
      'disbursement-initiated': 5, 'completed': 5,
    };
    const stepMap: Record<string, number> = { 'submitted': 1, 'verification': 2, 'review': 3, 'decision': 4, 'disbursement': 5 };
    const currentProgress = stateMap[application.state] || 1;
    const stepProgress = stepMap[stepId];
    if (stepProgress < currentProgress) return 'complete';
    if (stepProgress === currentProgress) return 'active';
    return 'pending';
  };

  // Redirect to specific state pages based on current application state
  useEffect(() => {
    if (!application) return;
    
    switch (application.state) {
      case 'submitted':
        navigate('/application/submitted');
        break;
      case 'verification-in-progress':
        navigate('/application/verification');
        break;
      case 'review-in-progress':
        navigate('/application/review');
        break;
      case 'approved':
      case 'conditional-approval':
      case 'rejected':
        navigate('/application/decision');
        break;
      case 'disbursement-initiated':
        navigate('/application/disbursement');
        break;
      case 'completed':
        navigate('/application/completed');
        break;
      default:
        break;
    }
  }, [application, navigate]);

  // Don't render the old content since we're redirecting
  return null;
}
