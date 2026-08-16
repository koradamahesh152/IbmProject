import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute, AdminRoute } from '@/components/ProtectedRoute';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { CreateScenarioPage } from '@/pages/CreateScenarioPage';
import { ScenarioListPage } from '@/pages/ScenarioListPage';
import { ScenarioDetailsPage } from '@/pages/ScenarioDetailsPage';
import { ResultsPage } from '@/pages/ResultsPage';
import { CostComparisonPage } from '@/pages/CostComparisonPage';
import { TechnicalComparisonPage } from '@/pages/TechnicalComparisonPage';
import { ModelComparisonPage } from '@/pages/ModelComparisonPage';
import { ReportPage } from '@/pages/ReportPage';
import { UserManagementPage } from '@/pages/UserManagementPage';
import { AuditLogsPage } from '@/pages/AuditLogsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { LearnCloudPage } from '@/pages/LearnCloudPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/scenarios" element={<ProtectedRoute><ScenarioListPage /></ProtectedRoute>} />
          <Route path="/scenarios/create" element={<ProtectedRoute><CreateScenarioPage /></ProtectedRoute>} />
          <Route path="/scenarios/:id" element={<ProtectedRoute><ScenarioDetailsPage /></ProtectedRoute>} />
          <Route path="/scenarios/:id/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
          <Route path="/scenarios/:id/cost" element={<ProtectedRoute><CostComparisonPage /></ProtectedRoute>} />
          <Route path="/scenarios/:id/technical" element={<ProtectedRoute><TechnicalComparisonPage /></ProtectedRoute>} />
          <Route path="/scenarios/:id/models" element={<ProtectedRoute><ModelComparisonPage /></ProtectedRoute>} />
          <Route path="/scenarios/:id/report" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
          <Route path="/learn" element={<ProtectedRoute><LearnCloudPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin/users" element={<AdminRoute><UserManagementPage /></AdminRoute>} />
          <Route path="/admin/audit-logs" element={<AdminRoute><AuditLogsPage /></AdminRoute>} />

          {/* Fallback */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
