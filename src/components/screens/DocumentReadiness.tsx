import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLoan } from '@/contexts/LoanContext';
import { cn } from '@/lib/utils';

export function DocumentReadiness() {
  const navigate = useNavigate();
  const { currentApplicationId, applications } = useLoan();
  const [countdown, setCountdown] = useState(4);
  
  const application = applications.find(a => a.id === currentApplicationId);

  // Auto-advance after 4 seconds
  useEffect(() => {
    if (!application) return;
    
    const countdownTimer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    const advanceTimer = setTimeout(() => {
      navigate('/apply/form');
    }, 4000);
    
    return () => {
      clearInterval(countdownTimer);
      clearTimeout(advanceTimer);
    };
  }, [navigate, application]);

  if (!application) {
    navigate('/');
    return null;
  }

  const requiredDocs = application.documents.filter(d => d.required);
  const optionalDocs = application.documents.filter(d => !d.required);

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/apply/loan-type')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold font-serif">Documents you'll need</h1>
      </div>

      <div className="bg-progress-bg rounded-xl p-4 mb-6 flex gap-3">
        <AlertCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-foreground font-medium mb-1">You don't need to upload now</p>
          <p className="text-sm text-muted-foreground">This is a preview of what you'll need.</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Required Documents</h2>
        <div className="space-y-2">
          {requiredDocs.map((doc) => (
            <div key={doc.id} className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="flex-1 font-medium text-foreground">{doc.name}</p>
              <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", doc.uploaded ? "bg-success-bg text-success" : "bg-muted")}>
                <CheckCircle2 className={cn("w-4 h-4", !doc.uploaded && "text-muted-foreground/30")} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {optionalDocs.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Optional</h2>
          <div className="space-y-2">
            {optionalDocs.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border/50">
                <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-muted-foreground/70" />
                </div>
                <p className="font-medium text-muted-foreground">{doc.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto space-y-3">
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-3">
          <span>Continuing in {countdown}s</span>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" style={{ animationDelay: '0.2s' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
        <Button className="w-full h-12" onClick={() => navigate('/apply/form')}>
          Continue now <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
