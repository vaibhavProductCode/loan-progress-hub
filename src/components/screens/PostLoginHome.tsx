import { ArrowRight, Plus, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLoan } from '@/contexts/LoanContext';
import { ApplicationCard } from '@/components/ApplicationCard';
import { EdgeCaseExplorer } from '@/components/EdgeCaseExplorer';

export function PostLoginHome() {
  const navigate = useNavigate();
  const { 
    activeApplications, 
    completedApplications, 
    userProfile,
    edgeCaseMode,
    setEdgeCaseMode 
  } = useLoan();
  
  const [showEdgeCaseExplorer, setShowEdgeCaseExplorer] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const hasApplications = activeApplications.length > 0 || completedApplications.length > 0;

  const handleApplyClick = () => {
    navigate('/apply/loan-type');
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

  return (
    <div className="min-h-screen flex flex-col bg-background pb-24">
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
          <div>
            <span className="text-lg font-semibold text-foreground block">LoanPulse</span>
            <span className="text-sm text-muted-foreground">
              Welcome{userProfile?.name ? `, ${userProfile.name}` : ''}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {edgeCaseMode && (
            <Badge variant="outline" className="text-warning border-warning">
              Test Mode
            </Badge>
          )}
          <button 
            onClick={() => navigate('/profile')}
            className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <User className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="flex-1 px-6 overflow-y-auto">
        {/* No Applications Yet */}
        {!hasApplications && (
          <div className="py-12">
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 text-center mb-6">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2 font-serif">
                Start your first application
              </h2>
              <p className="text-muted-foreground mb-6">
                Fast, transparent, and stress-free loans.
              </p>
              <Button 
                className="h-12 px-8 text-base font-semibold bg-secondary hover:bg-secondary/90"
                onClick={handleApplyClick}
              >
                Apply for a Loan
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Active Applications */}
        {activeApplications.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Active Applications</h2>
            <div className="space-y-3">
              {activeApplications.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>
          </section>
        )}

        {/* Apply for Another Loan */}
        {hasApplications && (
          <div className="mb-6">
            <Button 
              variant="outline" 
              className="w-full h-14 rounded-xl border-dashed border-2"
              onClick={handleApplyClick}
            >
              <Plus className="w-5 h-5 mr-2" />
              Apply for another loan
            </Button>
          </div>
        )}

        {/* Completed Applications */}
        {completedApplications.length > 0 && (
          <section className="mb-6">
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
