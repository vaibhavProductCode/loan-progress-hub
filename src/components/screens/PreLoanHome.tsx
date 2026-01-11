import { ArrowRight, Clock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import coinsIllustration from '@/assets/coins-illustration.png';

export function PreLoanHome() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-6">
        <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
          <span className="text-secondary-foreground font-semibold text-lg">L</span>
        </div>
        <span className="text-xl font-semibold text-foreground">LoanPulse</span>
      </div>

      {/* Hero Illustration */}
      <div className="flex-1 flex flex-col px-6 py-8">
        <div className="relative mb-8 animate-fade-in-up">
          {/* Hero Card */}
          <div className="relative bg-hero-gradient rounded-3xl p-8 overflow-hidden min-h-[280px] flex items-center justify-center">
            {/* Floating Badge - Real-time tracking */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Clock className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-foreground">Real-time tracking</span>
            </div>

            {/* Coins Illustration */}
            <img 
              src={coinsIllustration} 
              alt="Loan growth illustration" 
              className="w-48 h-48 object-contain"
            />

            {/* Floating Badge - Transparent */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2 shadow-sm animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Eye className="w-4 h-4 text-secondary" />
              <span className="text-sm font-medium text-foreground">100% Transparent</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-3xl font-bold text-foreground leading-tight mb-3 font-serif">
            Loan journeys,<br />simplified.
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Track your application in real-time with full transparency. No more guesswork.
          </p>
        </div>

        {/* CTAs */}
        <div className="mt-auto space-y-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <Button 
            className="w-full h-14 text-base font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl"
            onClick={handleGetStarted}
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          
          <p className="text-center text-muted-foreground text-sm">
            Fast, transparent, and stress-free loans.
          </p>
        </div>
      </div>
    </div>
  );
}
