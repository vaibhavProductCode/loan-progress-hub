import { User, LogOut, Shield, Building2, Phone, ChevronRight, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLoan } from '@/contexts/LoanContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ProfileScreen() {
  const navigate = useNavigate();
  const { userProfile, logout } = useLoan();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background pb-24">
      {/* Header */}
      <div className="px-6 pt-6 pb-8 bg-gradient-to-br from-primary/5 to-secondary/5">
        <h1 className="text-2xl font-bold text-foreground font-serif mb-6">Profile</h1>
        
        {/* User Card */}
        <div className="bg-card rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">
                {userProfile?.name || 'User'}
              </h2>
              <p className="text-muted-foreground text-sm">
                Verified User
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 space-y-6">
        {/* Account Details */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
            Account Details
          </h3>
          <div className="bg-card rounded-xl overflow-hidden shadow-sm">
            {/* Phone */}
            <div className="flex items-center gap-4 p-4 border-b border-border">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Mobile Number</p>
                <p className="font-medium text-foreground">+91 XXXXX X{userProfile?.aadhaarLast4?.slice(-4) || '1234'}</p>
              </div>
            </div>

            {/* Aadhaar */}
            <div className="flex items-center gap-4 p-4 border-b border-border">
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Aadhaar Number</p>
                <p className="font-medium text-foreground">XXXX XXXX {userProfile?.aadhaarLast4 || '1234'}</p>
              </div>
              <span className="text-xs text-success bg-success/10 px-2 py-1 rounded-full">Verified</span>
            </div>

            {/* Bank */}
            <div className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Bank Account</p>
                <p className="font-medium text-foreground">{userProfile?.bankName || 'HDFC Bank'}</p>
                <p className="text-sm text-muted-foreground">{userProfile?.bankBranch || 'Mumbai Main Branch'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
            Quick Actions
          </h3>
          <div className="bg-card rounded-xl overflow-hidden shadow-sm">
            <button 
              onClick={() => navigate('/help')}
              className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="flex-1 text-left font-medium text-foreground">Help & Support</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </section>
      </div>

      {/* Logout Button */}
      <div className="px-6 pb-6">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full h-12 text-destructive border-destructive/30 hover:bg-destructive/10"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Log out
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Log out?</AlertDialogTitle>
              <AlertDialogDescription>
                You'll need to log in again to access your applications.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout} className="bg-destructive hover:bg-destructive/90">
                Log out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
