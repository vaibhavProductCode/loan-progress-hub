import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LoanApplication, Notification, ApplicationState, LoanType, EmploymentType } from '@/types/loan';

interface LoanContextType {
  // Application state
  hasApplication: boolean;
  application: LoanApplication | null;
  
  // Navigation state
  hasCompletedOnboarding: boolean;
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  
  // Actions
  startApplication: (loanType: LoanType, employmentType: EmploymentType) => void;
  updateApplicationState: (state: ApplicationState) => void;
  completeOnboarding: () => void;
  markNotificationRead: (id: string) => void;
  clearApplication: () => void;
}

const LoanContext = createContext<LoanContextType | undefined>(undefined);

export function LoanProvider({ children }: { children: ReactNode }) {
  const [hasApplication, setHasApplication] = useState(false);
  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load persisted state
  useEffect(() => {
    const savedOnboarding = localStorage.getItem('lp-onboarding-complete');
    const savedApplication = localStorage.getItem('lp-application');
    
    if (savedOnboarding === 'true') {
      setHasCompletedOnboarding(true);
    }
    
    if (savedApplication) {
      try {
        const app = JSON.parse(savedApplication);
        setApplication(app);
        setHasApplication(true);
      } catch (e) {
        console.error('Failed to parse saved application');
      }
    }
  }, []);

  const startApplication = (loanType: LoanType, employmentType: EmploymentType) => {
    const newApp: LoanApplication = {
      id: `LP-${Date.now()}`,
      state: 'draft',
      loanType,
      employmentType,
      createdAt: new Date(),
      updatedAt: new Date(),
      currentStep: 1,
      totalSteps: 4,
      verificationSteps: [],
      documents: getRequiredDocuments(loanType, employmentType),
    };
    
    setApplication(newApp);
    setHasApplication(true);
    localStorage.setItem('lp-application', JSON.stringify(newApp));
    
    // Add notification
    addNotification({
      type: 'info',
      title: 'Application Started',
      message: 'Your loan application has been created. Complete the form to submit.',
    });
  };

  const updateApplicationState = (state: ApplicationState) => {
    if (!application) return;
    
    const updatedApp = {
      ...application,
      state,
      updatedAt: new Date(),
    };
    
    setApplication(updatedApp);
    localStorage.setItem('lp-application', JSON.stringify(updatedApp));
    
    // Add state change notification
    addNotification({
      type: 'state-change',
      title: getStateTitle(state),
      message: getStateMessage(state),
      applicationId: application.id,
    });
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    localStorage.setItem('lp-onboarding-complete', 'true');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const clearApplication = () => {
    setApplication(null);
    setHasApplication(false);
    localStorage.removeItem('lp-application');
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: Notification = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <LoanContext.Provider value={{
      hasApplication,
      application,
      hasCompletedOnboarding,
      notifications,
      unreadCount,
      startApplication,
      updateApplicationState,
      completeOnboarding,
      markNotificationRead,
      clearApplication,
    }}>
      {children}
    </LoanContext.Provider>
  );
}

export function useLoan() {
  const context = useContext(LoanContext);
  if (!context) {
    throw new Error('useLoan must be used within LoanProvider');
  }
  return context;
}

// Helper functions
function getRequiredDocuments(loanType: LoanType, employmentType: EmploymentType) {
  const common = [
    { id: 'aadhaar', type: 'identity', name: 'Aadhaar Card', required: true, uploaded: false, status: 'pending' as const },
    { id: 'pan', type: 'identity', name: 'PAN Card', required: true, uploaded: false, status: 'pending' as const },
    { id: 'bank-details', type: 'financial', name: 'Bank Account Details', required: true, uploaded: false, status: 'pending' as const },
  ];
  
  if (employmentType === 'salaried') {
    return [
      ...common,
      { id: 'salary-slips', type: 'income', name: 'Last 3 Salary Slips', required: true, uploaded: false, status: 'pending' as const },
      { id: 'bank-statements', type: 'financial', name: 'Bank Statements (6 months)', required: true, uploaded: false, status: 'pending' as const },
    ];
  }
  
  return [
    ...common,
    { id: 'business-proof', type: 'business', name: 'Business Registration', required: true, uploaded: false, status: 'pending' as const },
    { id: 'gst', type: 'business', name: 'GST Certificate', required: false, uploaded: false, status: 'pending' as const },
    { id: 'income-proof', type: 'income', name: 'Income Proof', required: true, uploaded: false, status: 'pending' as const },
    { id: 'bank-statements', type: 'financial', name: 'Bank Statements (6 months)', required: true, uploaded: false, status: 'pending' as const },
  ];
}

function getStateTitle(state: ApplicationState): string {
  const titles: Record<ApplicationState, string> = {
    'draft': 'Application Created',
    'submitted': 'Application Submitted',
    'verification-in-progress': 'Verification Started',
    'action-required': 'Action Required',
    'verification-resumed': 'Verification Resumed',
    'review-in-progress': 'Under Review',
    'approved': 'Loan Approved',
    'conditional-approval': 'Conditionally Approved',
    'rejected': 'Application Update',
    'disbursement-initiated': 'Disbursement Started',
    'completed': 'Loan Completed',
    'closed-incomplete': 'Application Closed',
  };
  return titles[state];
}

function getStateMessage(state: ApplicationState): string {
  const messages: Record<ApplicationState, string> = {
    'draft': 'Complete your application to submit.',
    'submitted': 'Your application is being processed.',
    'verification-in-progress': 'We are verifying your documents and details.',
    'action-required': 'We need some information from you.',
    'verification-resumed': 'Verification has resumed after your update.',
    'review-in-progress': 'Your application is under final review.',
    'approved': 'Congratulations! Your loan has been approved.',
    'conditional-approval': 'Your loan is approved with some conditions.',
    'rejected': 'We could not approve your application at this time.',
    'disbursement-initiated': 'Your loan amount is being transferred.',
    'completed': 'Your loan has been successfully disbursed.',
    'closed-incomplete': 'Your application has been closed.',
  };
  return messages[state];
}
