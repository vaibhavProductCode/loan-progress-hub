import { ArrowRight, FileCheck, AlertCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import logo from '@/assets/loanpulse-logo.png';

export function PreLoanHome() {
  const navigate = useNavigate();

  const valueCards = [
    {
      icon: FileCheck,
      title: 'Clear stages',
      description: 'Always know exactly where your application is in the process.',
      color: 'bg-progress-bg text-secondary',
    },
    {
      icon: AlertCircle,
      title: 'Early issue alerts',
      description: 'Get notified immediately if something needs your attention.',
      color: 'bg-warning-bg text-warning',
    },
    {
      icon: Clock,
      title: 'No silent waiting',
      description: 'Every wait is explained with clear timelines and next steps.',
      color: 'bg-success-bg text-success',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-center mb-8">
        <img src={logo} alt="LoanPulse" className="h-8" />
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col">
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <h1 className="text-2xl font-semibold text-foreground leading-tight mb-3 font-serif">
            Know where your loan stands — at every step
          </h1>
          <p className="text-muted-foreground text-base">
            Track your application, get early alerts, and never wonder what's happening.
          </p>
        </div>

        {/* Value Cards */}
        <div className="space-y-3 mb-8">
          {valueCards.map((card, index) => (
            <div 
              key={card.title}
              className="lp-value-card flex items-start gap-4 animate-fade-in-up opacity-0"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center flex-shrink-0`}>
                <card.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-0.5">{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-auto space-y-3 animate-fade-in-up opacity-0" style={{ animationDelay: '0.5s' }}>
          <Button 
            className="w-full h-12 text-base font-semibold"
            onClick={() => navigate('/apply/loan-type')}
          >
            Apply for a loan
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <Button 
            variant="ghost"
            className="w-full h-11 text-muted-foreground"
            onClick={() => navigate('/onboarding')}
          >
            How this works
          </Button>
        </div>
      </div>
    </div>
  );
}
