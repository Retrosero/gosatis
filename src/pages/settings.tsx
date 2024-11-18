import { useTheme } from '../providers/theme-provider';
import { useSettings } from '../hooks/use-settings';
import { Sun, Moon, Sidebar, Menu } from 'lucide-react';

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { navigationType, setNavigationType } = useSettings();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Ayarlar</h1>

      <div className="max-w-2xl space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4">Görünüm</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Tema
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                    theme === 'light'
                      ? 'border-primary-600 text-primary-600 bg-primary-50 dark:bg-primary-900/50'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Sun className="w-5 h-5" />
                  <span>Açık</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'border-primary-600 text-primary-600 bg-primary-50 dark:bg-primary-900/50'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Moon className="w-5 h-5" />
                  <span>Koyu</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Navigasyon Tipi
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setNavigationType('sidebar')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                    navigationType === 'sidebar'
                      ? 'border-primary-600 text-primary-600 bg-primary-50 dark:bg-primary-900/50'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Sidebar className="w-5 h-5" />
                  <span>Kenar Çubuğu</span>
                </button>
                <button
                  onClick={() => setNavigationType('bottom')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                    navigationType === 'bottom'
                      ? 'border-primary-600 text-primary-600 bg-primary-50 dark:bg-primary-900/50'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Menu className="w-5 h-5" />
                  <span>Alt Menü</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}