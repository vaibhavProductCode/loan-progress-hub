import { useState, useEffect } from 'react';
import { Phone, ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { cn } from '@/lib/utils';

type LoginStep = 'phone' | 'otp';

interface LoginScreenProps {
  onComplete: () => void;
}

export function LoginScreen({ onComplete }: LoginScreenProps) {
  const [step, setStep] = useState<LoginStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Format phone number
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    return digits;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(formatPhone(e.target.value));
  };

  const handleSendOTP = () => {
    if (phoneNumber.length !== 10) return;
    
    setIsSending(true);
    // Auto-advance to OTP screen after 1.5 seconds
    setTimeout(() => {
      setIsSending(false);
      setStep('otp');
    }, 1500);
  };

  // Auto-verify OTP when 6 digits entered
  useEffect(() => {
    if (otp.length === 6 && step === 'otp') {
      setIsVerifying(true);
      // Auto-verify after 2 seconds (demo mode)
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(onComplete, 300);
      }, 2000);
    }
  }, [otp, step, onComplete]);

  if (step === 'phone') {
    return (
      <div className={cn(
        "min-h-screen flex flex-col px-6 py-8 bg-background transition-opacity duration-300",
        isExiting ? 'opacity-0' : 'opacity-100'
      )}>
        {/* Icon */}
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 mt-12">
          <Phone className="w-8 h-8 text-primary" />
        </div>

        {/* Content */}
        <h1 className="text-2xl font-bold text-foreground mb-2 font-serif">
          Enter your mobile number
        </h1>
        <p className="text-muted-foreground mb-8">
          We'll send you a verification code
        </p>

        <div className="space-y-6 flex-1">
          <div>
            <Label htmlFor="phone" className="text-sm font-medium">
              Mobile Number
            </Label>
            <div className="flex mt-2">
              <div className="h-12 px-4 flex items-center bg-muted rounded-l-lg border border-r-0 border-input">
                <span className="text-muted-foreground">+91</span>
              </div>
              <Input
                id="phone"
                type="tel"
                placeholder="9876543210"
                value={phoneNumber}
                onChange={handlePhoneChange}
                className="h-12 text-lg rounded-l-none"
                maxLength={10}
              />
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
            <Shield className="w-5 h-5 text-primary mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Your number is secure. We only use it for verification and important updates.
            </p>
          </div>
        </div>

        {/* CTA */}
        <Button 
          className="w-full h-14 mt-auto text-base font-semibold rounded-xl"
          disabled={phoneNumber.length !== 10 || isSending}
          onClick={handleSendOTP}
        >
          {isSending ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Sending OTP...
            </>
          ) : (
            <>
              Send OTP
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    );
  }

  // OTP Step
  return (
    <div className={cn(
      "min-h-screen flex flex-col px-6 py-8 bg-background transition-opacity duration-300",
      isExiting ? 'opacity-0' : 'opacity-100'
    )}>
      {/* Icon */}
      <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 mt-12">
        <Shield className="w-8 h-8 text-secondary" />
      </div>

      {/* Content */}
      <h1 className="text-2xl font-bold text-foreground mb-2 font-serif">
        Verify your number
      </h1>
      <p className="text-muted-foreground mb-8">
        Enter the 6-digit code sent to +91 {phoneNumber}
      </p>

      <div className="flex-1">
        <div className="flex justify-center mb-8">
          <InputOTP 
            maxLength={6} 
            value={otp}
            onChange={setOtp}
            disabled={isVerifying}
          >
            <InputOTPGroup className="gap-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <InputOTPSlot 
                  key={index} 
                  index={index} 
                  className="w-12 h-14 text-xl rounded-lg border-2"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {isVerifying && (
          <div className="flex items-center justify-center gap-2 text-secondary animate-fade-in-up">
            <div className="w-5 h-5 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
            <span>Verifying...</span>
          </div>
        )}

        {!isVerifying && (
          <p className="text-center text-muted-foreground text-sm">
            Didn't receive the code?{' '}
            <button className="text-secondary font-medium hover:underline">
              Resend
            </button>
          </p>
        )}
      </div>

      {/* Auto-advance indicator */}
      <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm pb-8">
        <span>Demo: Enter any 6 digits</span>
      </div>
    </div>
  );
}
