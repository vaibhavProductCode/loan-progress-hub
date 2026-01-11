import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ShieldCheck, Building2, User, Check, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useLoan } from '@/contexts/LoanContext';
import { cn } from '@/lib/utils';

type OnboardingStep = 'aadhaar' | 'bank' | 'confirmation';

const BANKS = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Punjab National Bank',
  'Bank of Baroda',
  'Canara Bank',
  'Union Bank of India',
  'IndusInd Bank',
];

const BRANCHES: Record<string, string[]> = {
  'State Bank of India': ['Mumbai Main Branch', 'Delhi Central', 'Bangalore IT Park', 'Chennai Anna Nagar'],
  'HDFC Bank': ['Mumbai BKC', 'Delhi CP', 'Bangalore Koramangala', 'Chennai T Nagar'],
  'ICICI Bank': ['Mumbai Nariman Point', 'Delhi Connaught Place', 'Bangalore MG Road', 'Chennai Adyar'],
  'Axis Bank': ['Mumbai Fort', 'Delhi Nehru Place', 'Bangalore Indiranagar', 'Chennai Nungambakkam'],
  'Kotak Mahindra Bank': ['Mumbai Worli', 'Delhi GK', 'Bangalore HSR Layout', 'Chennai Mylapore'],
  'Punjab National Bank': ['Mumbai Andheri', 'Delhi Karol Bagh', 'Bangalore Whitefield', 'Chennai Kilpauk'],
  'Bank of Baroda': ['Mumbai Churchgate', 'Delhi Janpath', 'Bangalore Jayanagar', 'Chennai Egmore'],
  'Canara Bank': ['Mumbai Bandra', 'Delhi Saket', 'Bangalore BTM', 'Chennai Velachery'],
  'Union Bank of India': ['Mumbai Colaba', 'Delhi Dwarka', 'Bangalore Marathahalli', 'Chennai Porur'],
  'IndusInd Bank': ['Mumbai Lower Parel', 'Delhi Vasant Vihar', 'Bangalore Electronic City', 'Chennai OMR'],
};

export function OnboardingScreen() {
  const [step, setStep] = useState<OnboardingStep>('aadhaar');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarConsent, setAadhaarConsent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [bankSearch, setBankSearch] = useState('');
  const [branchSearch, setBranchSearch] = useState('');
  const [isExiting, setIsExiting] = useState(false);
  
  const navigate = useNavigate();
  const { completeOnboarding } = useLoan();

  // Format Aadhaar with spaces
  const formatAadhaar = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 12);
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.slice(i, i + 4));
    }
    return parts.join(' ');
  };

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAadhaar(e.target.value);
    setAadhaarNumber(formatted);
  };

  const handleAadhaarSubmit = () => {
    if (aadhaarNumber.replace(/\s/g, '').length !== 12 || !aadhaarConsent) return;
    
    setIsVerifying(true);
    // Simulate verification (3 seconds demo mode)
    setTimeout(() => {
      setIsVerifying(false);
      setStep('bank');
    }, 3000);
  };

  const handleBankSubmit = () => {
    if (!selectedBank || !selectedBranch) return;
    setStep('confirmation');
  };

  // Auto-advance from confirmation after 3 seconds
  useEffect(() => {
    if (step === 'confirmation') {
      const timer = setTimeout(() => {
        handleComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleComplete = () => {
    const last4 = aadhaarNumber.replace(/\s/g, '').slice(-4);
    setIsExiting(true);
    
    setTimeout(() => {
      completeOnboarding({
        name: 'User',
        aadhaarLast4: last4,
        bankName: selectedBank,
        bankBranch: selectedBranch,
        isVerified: true,
      });
      navigate('/');
    }, 300);
  };

  const filteredBanks = BANKS.filter(bank => 
    bank.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const availableBranches = selectedBank ? (BRANCHES[selectedBank] || []) : [];
  const filteredBranches = availableBranches.filter(branch =>
    branch.toLowerCase().includes(branchSearch.toLowerCase())
  );

  // Render based on step
  if (step === 'aadhaar') {
    return (
      <div className={cn(
        "min-h-screen flex flex-col px-6 py-8 bg-background transition-opacity duration-300",
        isExiting ? 'opacity-0' : 'opacity-100'
      )}>
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          <div className="flex-1 h-1 bg-primary rounded-full" />
          <div className="flex-1 h-1 bg-border rounded-full" />
          <div className="flex-1 h-1 bg-border rounded-full" />
        </div>

        {/* Icon */}
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>

        {/* Content */}
        <h1 className="text-2xl font-semibold text-foreground mb-2 font-serif">
          Verify your identity
        </h1>
        <p className="text-muted-foreground mb-8">
          Enter your 12-digit Aadhaar number to verify your identity securely.
        </p>

        <div className="space-y-6 flex-1">
          <div>
            <Label htmlFor="aadhaar" className="text-sm font-medium">
              Aadhaar Number
            </Label>
            <Input
              id="aadhaar"
              type="text"
              placeholder="XXXX XXXX XXXX"
              value={aadhaarNumber}
              onChange={handleAadhaarChange}
              className="mt-2 h-12 text-lg tracking-wider"
              maxLength={14}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Your Aadhaar is used only for verification. We do not store it.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox 
              id="consent" 
              checked={aadhaarConsent}
              onCheckedChange={(checked) => setAadhaarConsent(checked === true)}
            />
            <label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed">
              I consent to verify my identity using Aadhaar eKYC and understand my data will be processed securely.
            </label>
          </div>
        </div>

        {/* CTA */}
        <Button 
          className="w-full h-12 mt-auto"
          disabled={aadhaarNumber.replace(/\s/g, '').length !== 12 || !aadhaarConsent || isVerifying}
          onClick={handleAadhaarSubmit}
        >
          {isVerifying ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Verifying...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    );
  }

  if (step === 'bank') {
    return (
      <div className={cn(
        "min-h-screen flex flex-col px-6 py-8 bg-background transition-opacity duration-300",
        isExiting ? 'opacity-0' : 'opacity-100'
      )}>
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          <div className="flex-1 h-1 bg-primary rounded-full" />
          <div className="flex-1 h-1 bg-primary rounded-full" />
          <div className="flex-1 h-1 bg-border rounded-full" />
        </div>

        {/* Back button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-fit mb-4 -ml-2"
          onClick={() => setStep('aadhaar')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Icon */}
        <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6">
          <Building2 className="w-8 h-8 text-secondary" />
        </div>

        {/* Content */}
        <h1 className="text-2xl font-semibold text-foreground mb-2 font-serif">
          Select your bank
        </h1>
        <p className="text-muted-foreground mb-6">
          Choose your primary bank for loan disbursement.
        </p>

        <div className="space-y-6 flex-1 overflow-hidden flex flex-col">
          {/* Bank Selection */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Bank Name</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search bank..."
                value={bankSearch}
                onChange={(e) => setBankSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="mt-2 max-h-32 overflow-y-auto border rounded-lg">
              {filteredBanks.map(bank => (
                <button
                  key={bank}
                  onClick={() => {
                    setSelectedBank(bank);
                    setSelectedBranch('');
                    setBankSearch('');
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center justify-between",
                    selectedBank === bank && "bg-primary/10 text-primary"
                  )}
                >
                  {bank}
                  {selectedBank === bank && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Branch Selection */}
          {selectedBank && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Branch</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search branch..."
                  value={branchSearch}
                  onChange={(e) => setBranchSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="mt-2 max-h-32 overflow-y-auto border rounded-lg">
                {filteredBranches.map(branch => (
                  <button
                    key={branch}
                    onClick={() => {
                      setSelectedBranch(branch);
                      setBranchSearch('');
                    }}
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center justify-between",
                      selectedBranch === branch && "bg-primary/10 text-primary"
                    )}
                  >
                    {branch}
                    {selectedBranch === branch && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <Button 
          className="w-full h-12 mt-4"
          disabled={!selectedBank || !selectedBranch}
          onClick={handleBankSubmit}
        >
          Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    );
  }

  // Confirmation step with auto-advance
  return (
    <div className={cn(
      "min-h-screen flex flex-col px-6 py-8 bg-background transition-opacity duration-300",
      isExiting ? 'opacity-0' : 'opacity-100'
    )}>
      {/* Progress */}
      <div className="flex gap-2 mb-8">
        <div className="flex-1 h-1 bg-primary rounded-full" />
        <div className="flex-1 h-1 bg-primary rounded-full" />
        <div className="flex-1 h-1 bg-primary rounded-full" />
      </div>

      {/* Icon */}
      <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mb-6">
        <User className="w-8 h-8 text-success" />
      </div>

      {/* Content */}
      <h1 className="text-2xl font-semibold text-foreground mb-2 font-serif">
        Profile confirmed
      </h1>
      <p className="text-muted-foreground mb-8">
        Your information has been verified successfully.
      </p>

      <div className="flex-1 space-y-4">
        {/* Aadhaar Summary */}
        <div className="p-4 bg-muted/50 rounded-xl">
          <p className="text-sm text-muted-foreground mb-1">Aadhaar Number</p>
          <p className="font-medium text-foreground">XXXX XXXX {aadhaarNumber.slice(-4)}</p>
        </div>

        {/* Bank Summary */}
        <div className="p-4 bg-muted/50 rounded-xl">
          <p className="text-sm text-muted-foreground mb-1">Bank</p>
          <p className="font-medium text-foreground">{selectedBank}</p>
          <p className="text-sm text-muted-foreground mt-2 mb-1">Branch</p>
          <p className="font-medium text-foreground">{selectedBranch}</p>
        </div>

        {/* Verification Badge */}
        <div className="flex items-center gap-3 p-4 bg-success-bg rounded-xl">
          <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="font-medium text-success">Identity Verified</p>
            <p className="text-sm text-muted-foreground">Your Aadhaar has been verified successfully</p>
          </div>
        </div>
      </div>

      {/* Auto-advance indicator */}
      <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm pb-8">
        <span>Moving to home</span>
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary lp-animate-pulse-soft" style={{ animationDelay: '0s' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-secondary lp-animate-pulse-soft" style={{ animationDelay: '0.2s' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-secondary lp-animate-pulse-soft" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
}
