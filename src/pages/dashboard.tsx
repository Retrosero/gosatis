import { BarChart3, Users, ShoppingCart, Wallet } from 'lucide-react';

const metrics = [
  {
    label: 'Toplam Müşteri',
    value: '1,234',
    change: '+12%',
    icon: Users,
  },
  {
    label: 'Ürün Sayısı',
    value: '456',
    change: '+5%',
    icon: ShoppingCart,
  },
  {
    label: 'Aylık Sipariş',
    value: '789',
    change: '+18%',
    icon: BarChart3,
  },
  {
    label: 'Toplam Ciro',
    value: '₺123.456',
    change: '+25%',
    icon: Wallet,
  },
];

export function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {metric.label}
                  </p>
                  <p className="text-2xl font-bold mt-1">{metric.value}</p>
                </div>
                <div className="bg-primary-50 dark:bg-primary-900/50 p-3 rounded-lg">
                  <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 dark:text-green-400">
                  {metric.change}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                  vs geçen ay
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}