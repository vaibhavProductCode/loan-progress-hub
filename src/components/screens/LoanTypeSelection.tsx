import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Briefcase, Car, User, Building2, UserCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLoan } from '@/contexts/LoanContext';
import { LoanType, EmploymentType } from '@/types/loan';
import { cn } from '@/lib/utils';

interface SelectionOption {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

const loanTypes: SelectionOption[] = [
  { id: 'personal', label: 'Personal Loan', description: 'For personal expenses, emergencies, or consolidation', icon: User },
  { id: 'business', label: 'Business Loan', description: 'For business growth, equipment, or working capital', icon: Briefcase },
  { id: 'auto', label: 'Auto Loan', description: 'For purchasing a new or used vehicle', icon: Car },
];

const employmentTypes: SelectionOption[] = [
  { id: 'salaried', label: 'Salaried', description: 'Regular employment with monthly salary', icon: Building2 },
  { id: 'self-employed', label: 'Self-Employed', description: 'Own business or freelance work', icon: UserCheck },
  { id: 'gig-msme', label: 'Gig / MSME', description: 'Gig economy or micro/small business', icon: Users },
];

export function LoanTypeSelection() {
  const [step, setStep] = useState<'loan' | 'employment'>('loan');
  const [selectedLoan, setSelectedLoan] = useState<LoanType | null>(null);
  const [selectedEmployment, setSelectedEmployment] = useState<EmploymentType | null>(null);
  const navigate = useNavigate();
  const { startApplication } = useLoan();

  const handleContinue = () => {
    if (step === 'loan' && selectedLoan) {
      setStep('employment');
    } else if (step === 'employment' && selectedLoan && selectedEmployment) {
      startApplication(selectedLoan, selectedEmployment);
      navigate('/apply/user-details');
    }
  };

  const handleBack = () => {
    if (step === 'employment') {
      setStep('loan');
    } else {
      navigate('/');
    }
  };

  const options = step === 'loan' ? loanTypes : employmentTypes;
  const selected = step === 'loan' ? selectedLoan : selectedEmployment;
  const setSelected = step === 'loan' 
    ? (id: string) => setSelectedLoan(id as LoanType)
    : (id: string) => setSelectedEmployment(id as EmploymentType);

  // Auto-advance after selection
  useEffect(() => {
    if (selected) {
      const timer = setTimeout(() => {
        handleContinue();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [selected, step]);

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <p className="text-sm text-muted-foreground">
            Step {step === 'loan' ? '1' : '2'} of 2
          </p>
          <h1 className="text-xl font-semibold font-serif">
            {step === 'loan' ? 'Select loan type' : 'Your employment'}
          </h1>
        </div>
      </div>

      {/* Options */}
      <div className="flex-1 space-y-3">
        {options.map((option) => {
          const isSelected = selected === option.id;
          return (
            <button
              key={option.id}
              onClick={() => setSelected(option.id)}
              className={cn(
                "w-full p-4 rounded-xl border-2 transition-all duration-200 text-left flex items-start gap-4",
                isSelected 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/30 hover:bg-muted/50"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                isSelected 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              )}>
                <option.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className={cn(
                  "font-semibold mb-1",
                  isSelected ? "text-primary" : "text-foreground"
                )}>
                  {option.label}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Continue button */}
      <div className="mt-6">
        <Button 
          className="w-full h-12"
          disabled={!selected}
          onClick={handleContinue}
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
