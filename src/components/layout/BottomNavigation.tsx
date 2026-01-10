import { Home, FileText, Bell, HelpCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLoan } from '@/contexts/LoanContext';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  requiresApplication?: boolean;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'application', label: 'My Application', icon: FileText, path: '/application', requiresApplication: true },
  { id: 'notifications', label: 'Notifications', icon: Bell, path: '/notifications' },
  { id: 'help', label: 'Help', icon: HelpCircle, path: '/help' },
];

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeApplications, unreadCount } = useLoan();

  const hasApplication = activeApplications.length > 0;

  const filteredItems = navItems.filter(item => 
    !item.requiresApplication || hasApplication
  );

  return (
    <nav className="lp-bottom-nav z-50">
      <div className="max-w-md mx-auto flex items-center justify-around h-16">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          const showBadge = item.id === 'notifications' && unreadCount > 0;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-lg transition-colors relative",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                {showBadge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-warning text-warning-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-[11px]",
                isActive ? "font-semibold" : "font-medium"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
