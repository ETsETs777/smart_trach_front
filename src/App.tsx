import { ApolloProvider } from '@apollo/client'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { apolloClient } from './lib/apollo'
import ProtectedRoute from './components/ProtectedRoute'
import PageTransition from './components/ui/PageTransition'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Lazy loading для всех страниц
const LandingPage = lazy(() => import('./pages/LandingPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const ConfirmEmailPage = lazy(() => import('./pages/ConfirmEmailPage'))
const HomePage = lazy(() => import('./pages/HomePage'))
const PublicModePage = lazy(() => import('./pages/PublicModePage'))
const BarcodeScannerPage = lazy(() => import('./pages/BarcodeScannerPage'))
const ResultPage = lazy(() => import('./pages/ResultPage'))
const EmployeeRegisterPage = lazy(() => import('./pages/EmployeeRegisterPage'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const EmployeeDashboard = lazy(() => import('./pages/EmployeeDashboard'))
const CollectionAreasPage = lazy(() => import('./pages/CollectionAreasPage'))
const EmployeesPage = lazy(() => import('./pages/EmployeesPage'))
const CompanySettingsPage = lazy(() => import('./pages/CompanySettingsPage'))
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'))
const BinsManagementPage = lazy(() => import('./pages/BinsManagementPage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const WasteHistoryPage = lazy(() => import('./pages/WasteHistoryPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'))
const ForCompaniesPage = lazy(() => import('./pages/ForCompaniesPage'))
const ContactsPage = lazy(() => import('./pages/ContactsPage'))
const DocumentationPage = lazy(() => import('./pages/admin/DocumentationPage'))
const HelpPage = lazy(() => import('./pages/admin/HelpPage'))
const AboutSystemPage = lazy(() => import('./pages/admin/AboutSystemPage'))
const ApiDocsPage = lazy(() => import('./pages/admin/ApiDocsPage'))
const ChangelogPage = lazy(() => import('./pages/admin/ChangelogPage'))
const GuidePage = lazy(() => import('./pages/admin/GuidePage'))

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <div className="min-h-screen">
          <PageTransition>
            <Suspense fallback={<LoadingSpinner fullScreen text="Загрузка..." />}>
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
            <Route
              path="/admin/docs"
              element={
                <ProtectedRoute requiredRole="ADMIN_COMPANY">
                  <DocumentationPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/help"
              element={
                <ProtectedRoute requiredRole="ADMIN_COMPANY">
                  <HelpPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/about-system"
              element={
                <ProtectedRoute requiredRole="ADMIN_COMPANY">
                  <AboutSystemPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/api-docs"
              element={
                <ProtectedRoute requiredRole="ADMIN_COMPANY">
                  <ApiDocsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/changelog"
              element={
                <ProtectedRoute requiredRole="ADMIN_COMPANY">
                  <ChangelogPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/guide"
              element={
                <ProtectedRoute requiredRole="ADMIN_COMPANY">
                  <GuidePage />
                </ProtectedRoute>
              }
            />
            </Routes>
          </Suspense>
        </PageTransition>
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

