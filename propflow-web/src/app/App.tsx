import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import PropertiesPage from '../features/properties/PropertiesPage';
import UnitsPage from '../features/units/UnitsPage';
import TenantsPage from '../features/tenants/TenantsPage';
import ContractsPage from '../features/contracts/ContractsPage';
import PaymentsPage from '../features/payments/PaymentsPage';
import MaintenancePage from '../features/maintenance/MaintenancePage';
import LeadsPage from '../features/leads/LeadsPage';
import ProductivityPage from '../features/productivity/ProductivityPage';
import Layout from './Layout';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="leads" element={<LeadsPage />} />
        <Route path="productivity" element={<ProductivityPage />} />
        <Route path="properties" element={<PropertiesPage />} />
        <Route path="units" element={<UnitsPage />} />
        <Route path="tenants" element={<TenantsPage />} />
        <Route path="contracts" element={<ContractsPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="maintenance" element={<MaintenancePage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  // Static demo (GitHub Pages) uses hash routing so deep links work without
  // server rewrites; the normal app uses browser history.
  const Router = import.meta.env.VITE_DEMO_MODE === 'true' ? HashRouter : BrowserRouter;
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
