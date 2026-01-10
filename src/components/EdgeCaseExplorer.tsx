import { X, Play, Trash2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useLoan } from '@/contexts/LoanContext';
import { EdgeCaseScenario, edgeCaseConfigs, LoanType, EmploymentType } from '@/types/loan';

interface EdgeCaseExplorerProps {
  onClose: () => void;
}

export function EdgeCaseExplorer({ onClose }: EdgeCaseExplorerProps) {
  const { 
    selectedEdgeCases, 
    toggleEdgeCase, 
    runAllEdgeCases, 
    clearAllApplications,
    startApplication,
    updateApplicationState,
  } = useLoan();

  const handleRunSelected = () => {
    const loanTypes: LoanType[] = ['personal', 'business', 'auto'];
    const employmentTypes: EmploymentType[] = ['salaried', 'self-employed', 'gig-msme'];

    selectedEdgeCases.forEach((scenario, index) => {
      const config = edgeCaseConfigs[scenario];
      const loanType = loanTypes[index % loanTypes.length];
      const employmentType = employmentTypes[index % employmentTypes.length];
      
      const appId = startApplication(loanType, employmentType, scenario);
      
      // Simulate progression
      setTimeout(() => {
        updateApplicationState(appId, 'submitted');
        setTimeout(() => {
          if (config.targetState !== 'submitted') {
            updateApplicationState(appId, config.targetState);
          }
        }, 200);
      }, 100 + index * 100);
    });
    
    onClose();
  };

  const handleTriggerSingle = (scenario: EdgeCaseScenario) => {
    const config = edgeCaseConfigs[scenario];
    const appId = startApplication('personal', 'salaried', scenario);
    
    setTimeout(() => {
      updateApplicationState(appId, 'submitted');
      setTimeout(() => {
        if (config.targetState !== 'submitted') {
          updateApplicationState(appId, config.targetState);
        }
      }, 200);
    }, 100);
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col bg-background animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-warning" />
            <h2 className="text-lg font-semibold">Edge Case Explorer</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Scenarios List */}
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-sm text-muted-foreground mb-4">
            Select scenarios to test or trigger them individually.
          </p>
          
          <div className="space-y-3">
            {Object.entries(edgeCaseConfigs).map(([key, config]) => {
              const scenario = key as EdgeCaseScenario;
              const isSelected = selectedEdgeCases.includes(scenario);
              
              return (
                <div 
                  key={key} 
                  className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <Checkbox 
                    checked={isSelected}
                    onCheckedChange={() => toggleEdgeCase(scenario)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{config.name}</p>
                    <p className="text-xs text-muted-foreground">{config.description}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleTriggerSingle(scenario)}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t space-y-2">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleRunSelected}
              disabled={selectedEdgeCases.length === 0}
            >
              <Play className="w-4 h-4 mr-2" />
              Run Selected ({selectedEdgeCases.length})
            </Button>
            <Button 
              variant="default" 
              className="flex-1"
              onClick={() => {
                runAllEdgeCases();
                onClose();
              }}
            >
              <Zap className="w-4 h-4 mr-2" />
              Run All
            </Button>
          </div>
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={() => {
              clearAllApplications();
              onClose();
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Applications
          </Button>
        </div>
      </Card>
    </div>
  );
}
