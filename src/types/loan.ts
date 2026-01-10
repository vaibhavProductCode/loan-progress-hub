// LoanPulse Application State Machine Types

export type LoanType = 'personal' | 'business' | 'auto';

export type EmploymentType = 'salaried' | 'self-employed' | 'gig-msme';

export type ApplicationState = 
  | 'draft'
  | 'submitted'
  | 'verification-in-progress'
  | 'action-required'
  | 'verification-resumed'
  | 'review-in-progress'
  | 'approved'
  | 'conditional-approval'
  | 'rejected'
  | 'disbursement-initiated'
  | 'completed'
  | 'closed-incomplete';

export type VerificationCategory = 'documents' | 'kyc' | 'credit-check';

export type AIRiskLevel = 'low' | 'needs-review' | 'at-risk';

export interface VerificationStep {
  id: string;
  category: VerificationCategory;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'action-required' | 'failed';
  eta?: string;
  actionRequired?: {
    issue: string;
    resolution: string;
    example?: string;
  };
}

export interface Document {
  id: string;
  type: string;
  name: string;
  required: boolean;
  uploaded: boolean;
  status: 'pending' | 'verified' | 'rejected' | 'needs-review';
  uploadedAt?: Date;
}

export interface LoanApplication {
  id: string;
  state: ApplicationState;
  loanType: LoanType;
  employmentType: EmploymentType;
  amount?: number;
  createdAt: Date;
  updatedAt: Date;
  currentStep: number;
  totalSteps: number;
  eta?: string;
  verificationSteps: VerificationStep[];
  documents: Document[];
  aiRiskLevel?: AIRiskLevel;
  disbursement?: {
    amount: number;
    bankAccount: string;
    expectedDate: Date;
  };
  rejection?: {
    reason: string;
    guidance: string;
  };
}

export interface Notification {
  id: string;
  type: 'state-change' | 'action-required' | 'eta-delay' | 'disbursement' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  applicationId?: string;
}

// State transition rules
export const validTransitions: Record<ApplicationState, ApplicationState[]> = {
  'draft': ['submitted', 'closed-incomplete'],
  'submitted': ['verification-in-progress', 'closed-incomplete'],
  'verification-in-progress': ['action-required', 'review-in-progress', 'closed-incomplete'],
  'action-required': ['verification-resumed', 'closed-incomplete'],
  'verification-resumed': ['verification-in-progress', 'closed-incomplete'],
  'review-in-progress': ['approved', 'conditional-approval', 'rejected'],
  'approved': ['disbursement-initiated'],
  'conditional-approval': ['action-required', 'approved', 'closed-incomplete'],
  'rejected': [],
  'disbursement-initiated': ['completed'],
  'completed': [],
  'closed-incomplete': [],
};
