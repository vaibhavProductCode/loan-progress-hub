import { ReactNode } from 'react';
import { BottomNavigation } from './BottomNavigation';

interface MobileLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

export function MobileLayout({ children, hideNav = false }: MobileLayoutProps) {
  return (
    <div className="lp-container">
      <main className={hideNav ? "" : "lp-safe-bottom"}>
        {children}
      </main>
      {!hideNav && <BottomNavigation />}
    </div>
  );
}
