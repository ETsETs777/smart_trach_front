import { ApolloProvider } from '@apollo/client'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { apolloClient } from './lib/apollo'
import ProtectedRoute from './components/ProtectedRoute'
import PageTransition from './components/ui/PageTransition'
import LoadingSpinner from './components/ui/LoadingSpinner'
import { ThemeProvider } from './components/ThemeProvider'
import ErrorBoundary from './components/ErrorBoundary'
import { pushNotificationService } from './lib/pushNotifications'
import { useEffect } from 'react'

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
      // Initialize push notifications on app load
      useEffect(() => {
        pushNotificationService.initialize().catch((error) => {
          console.warn('Failed to initialize push notifications:', error)
        })
      }, [])

      // Initialize CSRF token on app load
      useEffect(() => {
        initializeCsrfToken().catch((error) => {
          console.warn('Failed to initialize CSRF token:', error)
        })
      }, [])

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ApolloProvider client={apolloClient}>
          {/* Skip to main content link for accessibility */}
          <a href="#main-content" className="skip-to-main">
            Skip to main content
          </a>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
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
                  <Suspense fallback={<LoadingSpinner fullScreen text="Загрузка..." />}>
                  <HomePage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/result/:wastePhotoId"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingSpinner fullScreen text="Загрузка..." />}>
                  <ResultPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingSpinner fullScreen text="Загрузка..." />}>
                  <LeaderboardPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="ADMIN_COMPANY">
                  <Suspense fallback={<LoadingSpinner fullScreen text="Загрузка..." />}>
                  <AdminDashboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/dashboard"
              element={
                <ProtectedRoute requiredRole="EMPLOYEE">
                  <Suspense fallback={<LoadingSpinner fullScreen text="Загрузка..." />}>
                  <EmployeeDashboard />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingSpinner fullScreen text="Загрузка..." />}>
                  <ProfilePage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingSpinner fullScreen text="Загрузка..." />}>
                  <WasteHistoryPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/areas"
              element={
                <ProtectedRoute requiredRole="ADMIN_COMPANY">
                  <Suspense fallback={<LoadingSpinner fullScreen text="Загрузка..." />}>
                  <CollectionAreasPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/employees"
              element={
                <ProtectedRoute requiredRole="ADMIN_COMPANY">
                  <Suspense fallback={<LoadingSpinner fullScreen text="Загрузка..." />}>
                  <EmployeesPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute requiredRole="ADMIN_COMPANY">
                  <Suspense fallback={<LoadingSpinner fullScreen text="Загрузка..." />}>
                  <CompanySettingsPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bins"
              element={
                <ProtectedRoute requiredRole="ADMIN_COMPANY">
                  <Suspense fallback={<LoadingSpinner fullScreen text="Загрузка..." />}>
                  <BinsManagementPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute requiredRole="ADMIN_COMPANY">
                  <Suspense fallback={<LoadingSpinner fullScreen text="Загрузка..." />}>
                  <AnalyticsPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/achievements"
              element={
                <ProtectedRoute requiredRole="ADMIN_COMPANY">
                  <Suspense fallback={<LoadingSpinner fullScreen text="Загрузка..." />}>
                  <AchievementsPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="ADMIN_COMPANY">
                  <Suspense fallback={<LoadingSpinner fullScreen text="Загрузка..." />}>
                  <AdminPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/docs"
              element={
                <ProtectedRoute requiredRole="ADMIN_COMPANY">
                  <Suspense fallback={<LoadingSpinner fullScreen text="Загрузка..." />}>
                    <DocumentationPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/help"
              element={
                <ProtectedRoute requiredRole="ADMIN_COMPANY">
                  <Suspense fallback={<LoadingSpinner fullScreen text="Загрузка..." />}>
                    <HelpPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/about-system"
              element={
                <ProtectedRoute requiredRole="ADMIN_COMPANY">
                  <Suspense fallback={<LoadingSpinner fullScreen text="Загрузка..." />}>
                    <AboutSystemPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/api-docs"
              element={
                <ProtectedRoute requiredRole="ADMIN_COMPANY">
                  <Suspense fallback={<LoadingSpinner fullScreen text="Загрузка..." />}>
                    <ApiDocsPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/changelog"
              element={
                <ProtectedRoute requiredRole="ADMIN_COMPANY">
                  <Suspense fallback={<LoadingSpinner fullScreen text="Загрузка..." />}>
                    <ChangelogPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/guide"
              element={
                <ProtectedRoute requiredRole="ADMIN_COMPANY">
                  <Suspense fallback={<LoadingSpinner fullScreen text="Загрузка..." />}>
                    <GuidePage />
                  </Suspense>
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
                    background: 'var(--color-bg-primary)',
                    color: 'var(--color-text-primary)',
                    border: '1px solid var(--color-border-light)',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#22c55e',
                      secondary: '#fff',
                    },
                    style: {
                      background: 'var(--color-bg-primary)',
                      color: 'var(--color-text-primary)',
                      border: '1px solid var(--color-success)',
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                    style: {
                      background: 'var(--color-bg-primary)',
                      color: 'var(--color-text-primary)',
                      border: '1px solid var(--color-error)',
                    },
                  },
                  warning: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#f59e0b',
                      secondary: '#fff',
                    },
                    style: {
                      background: 'var(--color-bg-primary)',
                      color: 'var(--color-text-primary)',
                      border: '1px solid var(--color-warning)',
                    },
                  },
                }}
              />
            </BrowserRouter>
          </ApolloProvider>
        </ThemeProvider>
      </ErrorBoundary>
  )
}

export default App

