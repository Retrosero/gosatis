import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout';
import { LoginPage } from '../pages/login';
import { DashboardPage } from '../pages/dashboard';
import { CustomersPage } from '../pages/customers';
import { CustomerDetailPage } from '../pages/customer-detail';
import { SalesPage } from '../pages/sales';
import { PaymentsPage } from '../pages/payments';
import { DailyReportPage } from '../pages/daily-report';
import { SettingsPage } from '../pages/settings';
import { useAuth } from '../hooks/use-auth';

export function AppRoutes() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/daily-report" element={<DailyReportPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}