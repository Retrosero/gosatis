import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart,
  FileText,
  Wallet, 
  Settings,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Müşteriler', path: '/customers' },
  { icon: ShoppingCart, label: 'Satışlar', path: '/sales' },
  { icon: FileText, label: 'Gün Sonu', path: '/daily-report' },
  { icon: Wallet, label: 'Ödemeler', path: '/payments' },
  { icon: Settings, label: 'Ayarlar', path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);

  return (
    <aside 
      className={cn(
        'relative bg-white dark:bg-gray-800 h-[calc(100vh-4rem)] border-r border-gray-200 dark:border-gray-700 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                'hover:bg-gray-100 dark:hover:bg-gray-700',
                isActive && 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {collapsed ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </button>
    </aside>
  );
}