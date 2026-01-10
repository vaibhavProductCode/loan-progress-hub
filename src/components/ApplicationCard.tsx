import { ChevronRight, AlertTriangle, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoanApplication, ApplicationState } from '@/types/loan';
import { useLoan } from '@/contexts/LoanContext';
import { cn } from '@/lib/utils';

interface ApplicationCardProps {
  application: LoanApplication;
  isCompleted?: boolean;
}

const stateConfig: Record<ApplicationState, { 
  label: string; 
  color: string; 
  icon: React.ElementType;
  badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline';
}> = {
  'draft': { label: 'Draft', color: 'text-muted-foreground', icon: Clock, badgeVariant: 'outline' },
  'submitted': { label: 'Processing', color: 'text-primary', icon: Loader2, badgeVariant: 'default' },
  'verification-in-progress': { label: 'Verifying', color: 'text-primary', icon: Loader2, badgeVariant: 'default' },
  'action-required': { label: 'Action Required', color: 'text-warning', icon: AlertTriangle, badgeVariant: 'secondary' },
  'verification-resumed': { label: 'Processing', color: 'text-primary', icon: Loader2, badgeVariant: 'default' },
  'review-in-progress': { label: 'Under Review', color: 'text-primary', icon: Clock, badgeVariant: 'default' },
  'approved': { label: 'Approved', color: 'text-success', icon: CheckCircle, badgeVariant: 'secondary' },
  'conditional-approval': { label: 'Conditional', color: 'text-warning', icon: AlertTriangle, badgeVariant: 'secondary' },
  'rejected': { label: 'Rejected', color: 'text-destructive', icon: XCircle, badgeVariant: 'destructive' },
  'disbursement-initiated': { label: 'Disbursing', color: 'text-success', icon: Loader2, badgeVariant: 'secondary' },
  'completed': { label: 'Completed', color: 'text-success', icon: CheckCircle, badgeVariant: 'secondary' },
  'closed-incomplete': { label: 'Closed', color: 'text-muted-foreground', icon: XCircle, badgeVariant: 'outline' },
};

const loanTypeLabels: Record<string, string> = {
  'personal': 'Personal Loan',
  'business': 'Business Loan',
  'auto': 'Auto Loan',
};

export function ApplicationCard({ application, isCompleted }: ApplicationCardProps) {
  const navigate = useNavigate();
  const { setCurrentApplication } = useLoan();
  const config = stateConfig[application.state];
  const IconComponent = config.icon;

  const handleClick = () => {
    setCurrentApplication(application.id);
    if (application.state === 'draft') {
      navigate('/apply/form');
    } else {
      navigate('/application');
    }
  };

  const needsAction = application.state === 'action-required' || application.state === 'conditional-approval';

  return (
    <Card 
      className={cn(
        "p-4 cursor-pointer hover:shadow-md transition-all",
        needsAction && "border-warning bg-warning-bg/30",
        isCompleted && "opacity-75"
      )}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Loan Type */}
          <p className="font-semibold text-foreground mb-1">
            {loanTypeLabels[application.loanType]}
          </p>
          
          {/* Application ID */}
          <p className="text-sm text-muted-foreground mb-2">
            {application.id}
          </p>
          
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <Badge 
              variant={config.badgeVariant}
              className={cn(
                "gap-1",
                application.state === 'action-required' && "bg-warning/20 text-warning border-warning",
                application.state === 'approved' && "bg-success/20 text-success border-success",
                application.state === 'completed' && "bg-success/20 text-success border-success",
              )}
            >
              <IconComponent className={cn(
                "w-3 h-3",
                (config.icon === Loader2) && "animate-spin"
              )} />
              {config.label}
            </Badge>
            
            {application.edgeCaseScenario && (
              <Badge variant="outline" className="text-xs">
                {application.edgeCaseScenario}
              </Badge>
            )}
          </div>
        </div>

        {/* Action Area */}
        <div className="flex flex-col items-end gap-2">
          {needsAction ? (
            <Button size="sm" variant="outline" className="text-warning border-warning">
              Resume Action
            </Button>
          ) : (
            <Button size="sm" variant="ghost">
              View Details
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
