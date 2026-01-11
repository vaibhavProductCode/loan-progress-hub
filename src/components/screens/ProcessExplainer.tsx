import { useEffect, useState } from 'react';
import { FileText, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProcessExplainerProps {
  onComplete: () => void;
}

const STEPS = [
  {
    icon: FileText,
    title: 'Apply in minutes',
    description: 'Simple application with minimal documentation',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Clock,
    title: 'Track every step',
    description: 'Real-time updates on your application status',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
  {
    icon: CheckCircle,
    title: 'Clear outcomes',
    description: 'No confusion, no stress — just transparency',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
];

export function ProcessExplainer({ onComplete }: ProcessExplainerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= STEPS.length - 1) {
          clearInterval(timer);
          // Start exit animation
          setTimeout(() => {
            setIsExiting(true);
            setTimeout(onComplete, 300);
          }, 2500);
          return prev;
        }
        return prev + 1;
      });
    }, 2500);

    return () => clearInterval(timer);
  }, [onComplete]);

  const step = STEPS[currentStep];
  const Icon = step.icon;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex flex-col bg-background transition-opacity duration-300",
        isExiting ? 'opacity-0' : 'opacity-100'
      )}
    >
      {/* Progress Bar */}
      <div className="flex gap-2 px-6 pt-6">
        {STEPS.map((_, index) => (
          <div 
            key={index}
            className={cn(
              "flex-1 h-1 rounded-full transition-all duration-500",
              index <= currentStep ? 'bg-secondary' : 'bg-border'
            )}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div 
          key={currentStep}
          className="flex flex-col items-center text-center animate-fade-in-up"
        >
          {/* Icon */}
          <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center mb-8", step.bgColor)}>
            <Icon className={cn("w-10 h-10", step.color)} />
          </div>

          {/* Text */}
          <h2 className="text-2xl font-bold text-foreground mb-3 font-serif">
            {step.title}
          </h2>
          <p className="text-muted-foreground text-lg max-w-xs">
            {step.description}
          </p>
        </div>
      </div>

      {/* Bottom Indicator */}
      <div className="px-6 pb-12">
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <span>Moving to next step</span>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary lp-animate-pulse-soft" style={{ animationDelay: '0s' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-secondary lp-animate-pulse-soft" style={{ animationDelay: '0.2s' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-secondary lp-animate-pulse-soft" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
