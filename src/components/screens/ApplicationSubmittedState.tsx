import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Clock, FileCheck, Search, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLoan } from '@/contexts/LoanContext';

export function ApplicationSubmittedState() {
  const navigate = useNavigate();
  const { currentApplicationId, applications, updateApplicationState } = useLoan();
  const [countdown, setCountdown] = useState(4);
  
  const application = applications.find(a => a.id === currentApplicationId);



  const nextSteps = [
    { icon: FileCheck, title: 'Document verification', description: "We'll verify your submitted documents", eta: '1-2 days' },
    { icon: Search, title: 'Background checks', description: 'KYC and credit verification', eta: '2-3 days' },
  ];

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-success-bg flex items-center justify-center mb-6 animate-scale-in">
          <CheckCircle2 className="w-10 h-10 text-success" />
        </div>
        <h1 className="text-2xl font-semibold font-serif mb-3">Application Submitted</h1>
        <p className="text-muted-foreground mb-2">
          Your application <span className="font-medium text-foreground">{application?.id}</span> is now being processed.
        </p>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">What happens next</h2>
        <div className="space-y-3 mb-8">
          {nextSteps.map((step) => (
            <div key={step.title} className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border">
              <div className="w-10 h-10 rounded-lg bg-progress-bg flex items-center justify-center flex-shrink-0">
                <step.icon className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-0.5">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{step.eta}</span>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <Button className="w-full h-12" onClick={() => {
            if (currentApplicationId) {
              updateApplicationState(currentApplicationId, 'verification-in-progress');
            }
            navigate('/application/verification');
          }}>
            Continue to Verification <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button variant="outline" className="w-full h-12" onClick={() => navigate('/')}>
            <Home className="w-5 h-5 mr-2" /> Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}