import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';
import { BottomNav } from './bottom-nav';
import { useSettings } from '../../hooks/use-settings';

export function Layout() {
  const { navigationType } = useSettings();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Navbar />
      <div className="flex">
        {navigationType === 'sidebar' && <Sidebar />}
        <main className={`flex-1 ${navigationType === 'bottom' ? 'pb-16' : ''}`}>
          <Outlet />
        </main>
      </div>
      {navigationType === 'bottom' && <BottomNav />}
    </div>
  );
}