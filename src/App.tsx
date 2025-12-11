import { ApolloProvider } from '@apollo/client'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { apolloClient } from './lib/apollo'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ConfirmEmailPage from './pages/ConfirmEmailPage'
import HomePage from './pages/HomePage'
import PublicModePage from './pages/PublicModePage'
import BarcodeScannerPage from './pages/BarcodeScannerPage'
import ResultPage from './pages/ResultPage'
import EmployeeRegisterPage from './pages/EmployeeRegisterPage'
import AdminDashboard from './pages/AdminDashboard'
import EmployeeDashboard from './pages/EmployeeDashboard'
import CollectionAreasPage from './pages/CollectionAreasPage'
import EmployeesPage from './pages/EmployeesPage'
import CompanySettingsPage from './pages/CompanySettingsPage'
import AchievementsPage from './pages/AchievementsPage'
import BinsManagementPage from './pages/BinsManagementPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ProfilePage from './pages/ProfilePage'
import WasteHistoryPage from './pages/WasteHistoryPage'
import AdminPage from './pages/AdminPage'
import LeaderboardPage from './pages/LeaderboardPage'
import AboutPage from './pages/AboutPage'
import HowItWorksPage from './pages/HowItWorksPage'
import ForCompaniesPage from './pages/ForCompaniesPage'
import ContactsPage from './pages/ContactsPage'

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <div className="min-h-screen">
          <Routes>
            {/* Публичные роуты */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/for-companies" element={<ForCompaniesPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/employee/register" element={<EmployeeRegisterPage />} />
            <Route path="/confirm-email" element={<ConfirmEmailPage />} />
            <Route path="/demo" element={<PublicModePage />} />
            <Route path="/barcode" element={<BarcodeScannerPage />} />
            
            {/* Защищённые роуты */}
            <Route
              path="/tablet"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/result/:wastePhotoId"
              element={
                <ProtectedRoute>
                  <ResultPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <LeaderboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="ADMIN_COMPANY">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/dashboard"
              element={
                <ProtectedRoute requiredRole="EMPLOYEE">
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <WasteHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/areas"
              element={
                <ProtectedRoute requiredRole="ADMIN_COMPANY">
                  <CollectionAreasPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/employees"
              element={
                <ProtectedRoute requiredRole="ADMIN_COMPANY">
                  <EmployeesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute requiredRole="ADMIN_COMPANY">
                  <CompanySettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bins"
              element={
                <ProtectedRoute requiredRole="ADMIN_COMPANY">
                  <BinsManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute requiredRole="ADMIN_COMPANY">
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/achievements"
              element={
                <ProtectedRoute requiredRole="ADMIN_COMPANY">
                  <AchievementsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="ADMIN_COMPANY">
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </BrowserRouter>
    </ApolloProvider>
  )
}

export default App

