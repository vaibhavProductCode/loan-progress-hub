import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLoan } from '@/contexts/LoanContext';
import { cn } from '@/lib/utils';

type FormStep = 'personal' | 'employment' | 'income' | 'review';

const steps: { id: FormStep; label: string }[] = [
  { id: 'personal', label: 'Personal' },
  { id: 'employment', label: 'Employment' },
  { id: 'income', label: 'Income' },
  { id: 'review', label: 'Review' },
];

export function ApplicationForm() {
  const [currentStep, setCurrentStep] = useState<FormStep>('personal');
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', dateOfBirth: '', address: '',
    employer: '', designation: '', workExperience: '',
    monthlyIncome: '', loanAmount: '', loanPurpose: '',
  });
  const navigate = useNavigate();
  const { updateApplicationState, currentApplicationId } = useLoan();

  const currentIndex = steps.findIndex(s => s.id === currentStep);
  const isLastStep = currentStep === 'review';
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState(3);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Auto-advance through form steps (demo mode - 3 seconds per step)
  useEffect(() => {
    setAutoAdvanceCountdown(3);
    
    const countdownTimer = setInterval(() => {
      setAutoAdvanceCountdown(prev => Math.max(0, prev - 1));
    }, 1000);

    const timer = setTimeout(() => {
      handleNext();
    }, 3000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(countdownTimer);
    };
  }, [currentStep]);

  const handleNext = () => {
    if (isLastStep) {
      if (currentApplicationId) {
        updateApplicationState(currentApplicationId, 'submitted');
      }
      navigate('/apply/submitted');
    } else {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handleBack = () => {
    if (currentIndex === 0) {
      navigate('/apply/documents');
    } else {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'personal':
        return (
          <div className="space-y-4">
            <div><Label htmlFor="fullName">Full Name (as per PAN)</Label><Input id="fullName" placeholder="Enter your full name" value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} className="mt-1.5" /></div>
            <div><Label htmlFor="email">Email Address</Label><Input id="email" type="email" placeholder="Enter your email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="mt-1.5" /></div>
            <div><Label htmlFor="phone">Mobile Number</Label><Input id="phone" type="tel" placeholder="Enter 10-digit mobile number" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className="mt-1.5" /></div>
            <div><Label htmlFor="dob">Date of Birth</Label><Input id="dob" type="date" value={formData.dateOfBirth} onChange={(e) => handleInputChange('dateOfBirth', e.target.value)} className="mt-1.5" /></div>
          </div>
        );
      case 'employment':
        return (
          <div className="space-y-4">
            <div><Label htmlFor="employer">Employer / Business Name</Label><Input id="employer" placeholder="Enter employer or business name" value={formData.employer} onChange={(e) => handleInputChange('employer', e.target.value)} className="mt-1.5" /></div>
            <div><Label htmlFor="designation">Designation / Role</Label><Input id="designation" placeholder="Enter your current role" value={formData.designation} onChange={(e) => handleInputChange('designation', e.target.value)} className="mt-1.5" /></div>
            <div><Label htmlFor="experience">Work Experience (years)</Label><Input id="experience" type="number" placeholder="Total years of experience" value={formData.workExperience} onChange={(e) => handleInputChange('workExperience', e.target.value)} className="mt-1.5" /></div>
          </div>
        );
      case 'income':
        return (
          <div className="space-y-4">
            <div><Label htmlFor="income">Monthly Income (₹)</Label><Input id="income" type="number" placeholder="Enter your monthly income" value={formData.monthlyIncome} onChange={(e) => handleInputChange('monthlyIncome', e.target.value)} className="mt-1.5" /></div>
            <div><Label htmlFor="loanAmount">Loan Amount Required (₹)</Label><Input id="loanAmount" type="number" placeholder="Enter desired loan amount" value={formData.loanAmount} onChange={(e) => handleInputChange('loanAmount', e.target.value)} className="mt-1.5" /></div>
            <div><Label htmlFor="purpose">Loan Purpose</Label><Input id="purpose" placeholder="What will the loan be used for?" value={formData.loanPurpose} onChange={(e) => handleInputChange('loanPurpose', e.target.value)} className="mt-1.5" /></div>
          </div>
        );
      case 'review':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-xl p-4 space-y-3">
              <ReviewItem label="Full Name" value={formData.fullName || '—'} />
              <ReviewItem label="Email" value={formData.email || '—'} />
              <ReviewItem label="Phone" value={formData.phone || '—'} />
              <ReviewItem label="Employer" value={formData.employer || '—'} />
              <ReviewItem label="Monthly Income" value={formData.monthlyIncome ? `₹${formData.monthlyIncome}` : '—'} />
              <ReviewItem label="Loan Amount" value={formData.loanAmount ? `₹${formData.loanAmount}` : '—'} />
              <ReviewItem label="Purpose" value={formData.loanPurpose || '—'} />
            </div>
            <p className="text-sm text-muted-foreground text-center">Please review your details before submitting.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={handleBack}><ArrowLeft className="w-5 h-5" /></Button>
        <div>
          <p className="text-sm text-muted-foreground">Step {currentIndex + 1} of {steps.length}</p>
          <h1 className="text-xl font-semibold font-serif">{steps[currentIndex].label} Details</h1>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {steps.map((step, index) => (
          <div key={step.id} className={cn("flex-1 h-1.5 rounded-full transition-colors", index <= currentIndex ? "bg-primary" : "bg-border")} />
        ))}
      </div>
      
      <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-4">
        <span>Auto-advancing in {autoAdvanceCountdown}s</span>
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" style={{ animationDelay: '0.2s' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>

      <div className="flex-1">{renderStepContent()}</div>

      <div className="mt-6">
        <Button className="w-full h-12" onClick={handleNext}>
          {isLastStep ? 'Submit Application' : 'Continue'}
          {isLastStep ? <Check className="w-5 h-5 ml-2" /> : <ArrowRight className="w-5 h-5 ml-2" />}
        </Button>
      </div>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
