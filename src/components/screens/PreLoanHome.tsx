import { ArrowRight, Clock, Eye, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLoan } from '@/contexts/LoanContext';
import { ApplicationCard } from '@/components/ApplicationCard';
import { EdgeCaseExplorer } from '@/components/EdgeCaseExplorer';
import logo from '@/assets/loanpulse-logo.png';
import coinsIllustration from '@/assets/coins-illustration.png';

export function PreLoanHome() {
  const navigate = useNavigate();
  const { 
    activeApplications, 
    completedApplications, 
    hasCompletedOnboarding,
    edgeCaseMode,
    setEdgeCaseMode 
  } = useLoan();
  
  const [showEdgeCaseExplorer, setShowEdgeCaseExplorer] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const hasApplications = activeApplications.length > 0 || completedApplications.length > 0;

  const handleApplyClick = () => {
    if (!hasCompletedOnboarding) {
      navigate('/onboarding');
    } else {
      navigate('/apply/loan-type');
    }
  };

  // Long press detection for edge case explorer
  const handleLogoMouseDown = () => {
    longPressTimer.current = setTimeout(() => {
      setShowEdgeCaseExplorer(true);
      setEdgeCaseMode(true);
    }, 1500);
  };

  const handleLogoMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // First-time user view (no applications)
  if (!hasApplications) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <div 
          ref={logoRef}
          className="flex items-center gap-3 px-6 pt-6"
          onMouseDown={handleLogoMouseDown}
          onMouseUp={handleLogoMouseUp}
          onMouseLeave={handleLogoMouseUp}
          onTouchStart={handleLogoMouseDown}
          onTouchEnd={handleLogoMouseUp}
        >
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
              onClick={handleApplyClick}
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <p className="text-center text-muted-foreground text-sm">
              Already have an account?{' '}
              <button 
                className="text-secondary font-medium hover:underline"
                onClick={() => navigate('/onboarding')}
              >
                Log in
              </button>
            </p>
          </div>
        </div>

        {/* Edge Case Explorer */}
        {showEdgeCaseExplorer && (
          <EdgeCaseExplorer onClose={() => setShowEdgeCaseExplorer(false)} />
        )}
      </div>
    );
  }

  // User with applications view
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div 
        ref={logoRef}
        className="flex items-center justify-between px-6 pt-6 pb-4"
        onMouseDown={handleLogoMouseDown}
        onMouseUp={handleLogoMouseUp}
        onMouseLeave={handleLogoMouseUp}
        onTouchStart={handleLogoMouseDown}
        onTouchEnd={handleLogoMouseUp}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
            <span className="text-secondary-foreground font-semibold text-lg">L</span>
          </div>
          <span className="text-xl font-semibold text-foreground">LoanPulse</span>
        </div>
        {edgeCaseMode && (
          <Badge variant="outline" className="text-warning border-warning">
            Test Mode
          </Badge>
        )}
      </div>

      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        {/* Active Applications */}
        {activeApplications.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Active Applications</h2>
            <div className="space-y-3">
              {activeApplications.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>
          </section>
        )}

        {/* Apply for Another Loan */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            className="w-full h-14 rounded-xl border-dashed border-2"
            onClick={handleApplyClick}
          >
            <Plus className="w-5 h-5 mr-2" />
            Apply for another loan
          </Button>
        </div>

        {/* Completed Applications */}
        {completedApplications.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-muted-foreground mb-4">Past Applications</h2>
            <div className="space-y-3">
              {completedApplications.map((app) => (
                <ApplicationCard key={app.id} application={app} isCompleted />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Edge Case Explorer */}
      {showEdgeCaseExplorer && (
        <EdgeCaseExplorer onClose={() => setShowEdgeCaseExplorer(false)} />
      )}
    </div>
  );
}
