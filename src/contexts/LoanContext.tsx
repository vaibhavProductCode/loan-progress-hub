import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  LoanApplication, 
  Notification, 
  ApplicationState, 
  LoanType, 
  EmploymentType, 
  UserProfile,
  EdgeCaseScenario,
  edgeCaseConfigs 
} from '@/types/loan';

interface LoanContextType {
  // Multi-application state
  applications: LoanApplication[];
  activeApplications: LoanApplication[];
  completedApplications: LoanApplication[];
  currentApplicationId: string | null;
  
  // User profile (from onboarding)
  userProfile: UserProfile | null;
  hasCompletedOnboarding: boolean;
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  
  // Edge Case Explorer
  edgeCaseMode: boolean;
  selectedEdgeCases: EdgeCaseScenario[];
  
  // Actions
  startApplication: (loanType: LoanType, employmentType: EmploymentType, edgeCase?: EdgeCaseScenario) => string;
  updateApplicationState: (appId: string, state: ApplicationState) => void;
  setCurrentApplication: (appId: string | null) => void;
  completeOnboarding: (profile: UserProfile) => void;
  markNotificationRead: (id: string) => void;
  
  // Edge Case Explorer actions
  setEdgeCaseMode: (enabled: boolean) => void;
  toggleEdgeCase: (scenario: EdgeCaseScenario) => void;
  runAllEdgeCases: () => void;
  clearAllApplications: () => void;
}

const LoanContext = createContext<LoanContextType | undefined>(undefined);

export function LoanProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [currentApplicationId, setCurrentApplicationId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [edgeCaseMode, setEdgeCaseModeState] = useState(false);
  const [selectedEdgeCases, setSelectedEdgeCases] = useState<EdgeCaseScenario[]>([]);

  // Load persisted state
  useEffect(() => {
    const savedOnboarding = localStorage.getItem('lp-onboarding-complete');
    const savedProfile = localStorage.getItem('lp-user-profile');
    const savedApplications = localStorage.getItem('lp-applications');
    
    if (savedOnboarding === 'true') {
      setHasCompletedOnboarding(true);
    }
    
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error('Failed to parse saved profile');
      }
    }
    
    if (savedApplications) {
      try {
        const apps = JSON.parse(savedApplications);
        setApplications(apps);
      } catch (e) {
        console.error('Failed to parse saved applications');
      }
    }

    // Check for edge case mode via URL param
    const params = new URLSearchParams(window.location.search);
    if (params.get('edgecase') === 'true') {
      setEdgeCaseModeState(true);
    }
  }, []);

  // Persist applications
  useEffect(() => {
    localStorage.setItem('lp-applications', JSON.stringify(applications));
  }, [applications]);

  const activeApplications = applications.filter(app => 
    !['completed', 'rejected', 'closed-incomplete'].includes(app.state)
  );

  const completedApplications = applications.filter(app => 
    ['completed', 'rejected', 'closed-incomplete'].includes(app.state)
  );

  const startApplication = (loanType: LoanType, employmentType: EmploymentType, edgeCase?: EdgeCaseScenario): string => {
    const newApp: LoanApplication = {
      id: `LP-${Date.now().toString(36).toUpperCase()}`,
      state: 'draft',
      loanType,
      employmentType,
      createdAt: new Date(),
      updatedAt: new Date(),
      currentStep: 1,
      totalSteps: 4,
      verificationSteps: [],
      documents: getRequiredDocuments(loanType, employmentType),
      edgeCaseScenario: edgeCase,
    };
    
    setApplications(prev => [...prev, newApp]);
    setCurrentApplicationId(newApp.id);
    
    addNotification({
      type: 'info',
      title: 'Application Started',
      message: `Your ${loanType} loan application has been created.`,
      applicationId: newApp.id,
    });

    return newApp.id;
  };

  const updateApplicationState = (appId: string, state: ApplicationState) => {
    setApplications(prev => prev.map(app => {
      if (app.id !== appId) return app;
      
      const updatedApp = {
        ...app,
        state,
        updatedAt: new Date(),
      };
      
      // Add state-specific data
      if (state === 'rejected') {
        updatedApp.rejection = {
          reason: 'Credit assessment criteria not met',
          guidance: 'You can reapply after 6 months with improved credit history.',
        };
      } else if (state === 'disbursement-initiated') {
        updatedApp.disbursement = {
          amount: app.amount || 250000,
          bankAccount: 'XXXX-XXXX-1234',
          expectedDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        };
      } else if (state === 'action-required') {
        updatedApp.verificationSteps = [{
          id: 'doc-issue',
          category: 'documents',
          title: 'Document Issue',
          description: 'A document needs your attention',
          status: 'action-required',
          actionRequired: {
            issue: 'The uploaded bank statement is unclear or incomplete.',
            resolution: 'Please upload a clear, complete bank statement for the last 6 months.',
            example: 'Ensure all pages are visible and text is readable.',
          },
        }];
      }
      
      return updatedApp;
    }));
    
    addNotification({
      type: 'state-change',
      title: getStateTitle(state),
      message: getStateMessage(state),
      applicationId: appId,
    });
  };

  const setCurrentApplication = (appId: string | null) => {
    setCurrentApplicationId(appId);
  };

  const completeOnboarding = (profile: UserProfile) => {
    setUserProfile(profile);
    setHasCompletedOnboarding(true);
    localStorage.setItem('lp-onboarding-complete', 'true');
    localStorage.setItem('lp-user-profile', JSON.stringify(profile));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const setEdgeCaseMode = (enabled: boolean) => {
    setEdgeCaseModeState(enabled);
  };

  const toggleEdgeCase = (scenario: EdgeCaseScenario) => {
    setSelectedEdgeCases(prev => 
      prev.includes(scenario) 
        ? prev.filter(s => s !== scenario)
        : [...prev, scenario]
    );
  };

  const runAllEdgeCases = () => {
    const loanTypes: LoanType[] = ['personal', 'business', 'auto'];
    const employmentTypes: EmploymentType[] = ['salaried', 'self-employed', 'gig-msme'];
    
    Object.keys(edgeCaseConfigs).forEach((scenario, index) => {
      const edgeCase = scenario as EdgeCaseScenario;
      const config = edgeCaseConfigs[edgeCase];
      const loanType = loanTypes[index % loanTypes.length];
      const employmentType = employmentTypes[index % employmentTypes.length];
      
      // Create application with this edge case
      const appId = startApplication(loanType, employmentType, edgeCase);
      
      // Simulate progression through states
      setTimeout(() => {
        updateApplicationState(appId, 'submitted');
        setTimeout(() => {
          if (config.targetState !== 'submitted') {
            updateApplicationState(appId, config.targetState);
          }
        }, 200);
      }, 100 + index * 50);
    });
  };

  const clearAllApplications = () => {
    setApplications([]);
    setCurrentApplicationId(null);
    localStorage.removeItem('lp-applications');
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
      applications,
      activeApplications,
      completedApplications,
      currentApplicationId,
      userProfile,
      hasCompletedOnboarding,
      notifications,
      unreadCount,
      edgeCaseMode,
      selectedEdgeCases,
      startApplication,
      updateApplicationState,
      setCurrentApplication,
      completeOnboarding,
      markNotificationRead,
      setEdgeCaseMode,
      toggleEdgeCase,
      runAllEdgeCases,
      clearAllApplications,
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
