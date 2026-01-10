import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, FileSearch, Clock, Bell, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLoan } from '@/contexts/LoanContext';
import { cn } from '@/lib/utils';

interface OnboardingStep {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

const steps: OnboardingStep[] = [
  {
    icon: FileSearch,
    title: 'Loan journeys have stages',
    description: 'Every loan application goes through multiple stages — submission, verification, review, and decision. We show you exactly where you are.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Clock,
    title: 'Verification takes time',
    description: 'Lenders need to verify your documents, income, and identity. This can take a few days. We keep you informed throughout.',
    color: 'bg-secondary/10 text-secondary',
  },
  {
    icon: Bell,
    title: 'Issues surface early',
    description: 'If something needs your attention — a missing document or unclear information — we tell you right away. No surprises.',
    color: 'bg-warning/10 text-warning',
  },
  {
    icon: ShieldCheck,
    title: 'We don\'t decide approvals',
    description: 'LoanPulse helps you track and understand your application. The approval decision is always made by the lender.',
    color: 'bg-success/10 text-success',
  },
];

export function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { completeOnboarding } = useLoan();

  const isLastStep = currentStep === steps.length - 1;
  const step = steps[currentStep];

  const handleNext = () => {
    if (isLastStep) {
      completeOnboarding();
      navigate('/');
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      {/* Skip button */}
      <div className="flex justify-end mb-8">
        <Button variant="ghost" size="sm" onClick={handleSkip}>
          Skip
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div 
          key={currentStep}
          className="animate-fade-in-up"
        >
          <div className={cn(
            "w-20 h-20 rounded-2xl mx-auto mb-8 flex items-center justify-center",
            step.color
          )}>
            <step.icon className="w-10 h-10" />
          </div>

          <h2 className="text-xl font-semibold text-foreground mb-4 font-serif">
            {step.title}
          </h2>

          <p className="text-muted-foreground text-base leading-relaxed max-w-xs mx-auto">
            {step.description}
          </p>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-8">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === currentStep 
                ? "bg-primary w-6" 
                : "bg-border hover:bg-muted-foreground/30"
            )}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {currentStep > 0 && (
          <Button 
            variant="outline"
            className="flex-1 h-12"
            onClick={() => setCurrentStep(prev => prev - 1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}
        <Button 
          className="flex-1 h-12"
          onClick={handleNext}
        >
          {isLastStep ? 'Get Started' : 'Next'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
