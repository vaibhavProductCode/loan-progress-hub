import { Bell, FileText, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { useLoan } from '@/contexts/LoanContext';
import { cn } from '@/lib/utils';
import logo from '@/assets/loanpulse-logo.png';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'action-required':
      return { icon: AlertCircle, color: 'bg-warning-bg text-warning' };
    case 'state-change':
      return { icon: FileText, color: 'bg-progress-bg text-secondary' };
    case 'eta-delay':
      return { icon: Clock, color: 'bg-muted text-muted-foreground' };
    case 'disbursement':
      return { icon: CheckCircle2, color: 'bg-success-bg text-success' };
    default:
      return { icon: Bell, color: 'bg-muted text-muted-foreground' };
  }
};

const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export function NotificationsScreen() {
  const { notifications, markNotificationRead } = useLoan();

  return (
    <div className="min-h-screen flex flex-col px-6 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <img src={logo} alt="LoanPulse" className="h-7" />
      </div>

      <h1 className="text-xl font-semibold font-serif mb-6">Notifications</h1>

      {notifications.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="font-semibold text-foreground mb-2">No notifications yet</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            When there are updates to your application, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const { icon: Icon, color } = getNotificationIcon(notification.type);
            
            return (
              <button
                key={notification.id}
                onClick={() => markNotificationRead(notification.id)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-colors",
                  notification.read 
                    ? "bg-card border-border" 
                    : "bg-primary/5 border-primary/20"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={cn(
                        "font-semibold text-foreground",
                        !notification.read && "text-primary"
                      )}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
