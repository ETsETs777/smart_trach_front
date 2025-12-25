import { motion } from 'framer-motion'
import { ArrowLeft, GitBranch, Calendar, CheckCircle, Star, Zap, Bug, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import GreenGradientBackground from '@/components/ui/GreenGradientBackground'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function ChangelogPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const changelog = [
    {
      version: '1.2.0',
      date: '2025-01-25',
      type: 'release',
      changes: [
        { type: 'feature', text: 'Structured logging with Pino on backend' },
        { type: 'feature', text: 'Audit logging for user actions and admin operations' },
        { type: 'feature', text: 'Enhanced form validation with real-time feedback' },
        { type: 'feature', text: 'Touch gestures support for mobile devices' },
        { type: 'feature', text: 'Success animations for user feedback' },
        { type: 'improvement', text: 'Improved mobile responsiveness and touch targets' },
        { type: 'improvement', text: 'Enhanced form components with visual validation states' },
        { type: 'improvement', text: 'Better accessibility with ARIA attributes' },
        { type: 'improvement', text: 'Performance monitoring dashboard' }
      ]
    },
    {
      version: '1.1.0',
      date: '2025-01-20',
      type: 'release',
      changes: [
        { type: 'feature', text: 'Map improvements: clustering, search, filtering, routing' },
        { type: 'feature', text: 'WebSocket notifications for real-time updates' },
        { type: 'feature', text: 'Performance monitoring system' },
        { type: 'feature', text: 'Lazy loading for images' },
        { type: 'feature', text: 'Virtualized lists for better performance' },
        { type: 'feature', text: 'Enhanced GraphQL caching in Apollo Client' },
        { type: 'improvement', text: 'Accessibility improvements (ARIA, keyboard navigation)' },
        { type: 'improvement', text: 'Code splitting and optimization' },
        { type: 'improvement', text: 'Companies carousel on landing page' }
      ]
    },
    {
      version: '1.0.1',
      date: '2025-01-15',
      type: 'release',
      changes: [
        { type: 'feature', text: 'Rate limiting for API protection' },
        { type: 'feature', text: 'Refresh token mechanism for enhanced security' },
        { type: 'feature', text: 'DataLoader implementation for GraphQL N+1 optimization' },
        { type: 'improvement', text: 'Input validation with class-validator' },
        { type: 'improvement', text: 'Centralized error handling and logging' },
        { type: 'improvement', text: 'Error boundaries for React components' },
        { type: 'bug', text: 'Fixed white screen flash on page transitions' },
        { type: 'bug', text: 'Fixed React Router warnings' }
      ]
    },
    {
      version: '1.0.0',
      date: '2024-12-24',
      type: 'release',
      changes: [
        { type: 'feature', text: 'Initial release of Smart Trash system' },
        { type: 'feature', text: 'Admin dashboard with comprehensive analytics' },
        { type: 'feature', text: 'Employee management system' },
        { type: 'feature', text: 'Collection areas and container management' },
        { type: 'feature', text: 'AI-powered waste classification using GigaChat' },
        { type: 'feature', text: 'Achievement system and gamification' },
        { type: 'feature', text: 'Leaderboard and employee rankings' },
        { type: 'feature', text: 'QR code generation for collection areas' },
        { type: 'feature', text: 'Multilingual support (English, Russian)' },
        { type: 'feature', text: 'Real-time analytics and reporting' },
        { type: 'feature', text: 'Photo upload and waste classification' },
        { type: 'feature', text: 'Company settings and logo management' },
        { type: 'feature', text: 'Export functionality (CSV, Excel, PDF)' },
        { type: 'feature', text: 'Responsive design for all devices' },
        { type: 'feature', text: 'GraphQL API with Playground' }
      ]
    },
    {
      version: '0.9.0',
      date: '2024-12-20',
      type: 'beta',
      changes: [
        { type: 'feature', text: 'Beta testing phase' },
        { type: 'improvement', text: 'Performance optimizations' },
        { type: 'improvement', text: 'UI/UX improvements' },
        { type: 'bug', text: 'Fixed authentication issues' }
      ]
    },
    {
      version: '0.8.0',
      date: '2024-12-15',
      type: 'alpha',
      changes: [
        { type: 'feature', text: 'Alpha release' },
        { type: 'feature', text: 'Core functionality implementation' },
        { type: 'improvement', text: 'Database schema optimization' }
      ]
    }
  ]

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'feature':
        return <Plus className="w-4 h-4 text-green-600" />
      case 'improvement':
        return <Zap className="w-4 h-4 text-blue-600" />
      case 'bug':
        return <Bug className="w-4 h-4 text-red-600" />
      default:
        return <CheckCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'feature':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'improvement':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'bug':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <GreenGradientBackground>
      <div className="min-h-screen p-8 landscape:px-16 text-white">
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/dashboard')}
            className="mb-6 bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-4 flex items-center gap-4">
              <GitBranch className="w-12 h-12" />
              Changelog
            </h1>
            <p className="text-white/95 text-lg">System updates and version history</p>
          </motion.div>

          <div className="space-y-6">
            {changelog.map((release, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-white/95 backdrop-blur-md border-2 border-white/30">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                        {release.version.split('.')[0]}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                          <GitBranch className="w-6 h-6 text-green-600" />
                          Version {release.version}
                        </h2>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{release.date}</span>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            release.type === 'release' ? 'bg-green-100 text-green-800' :
                            release.type === 'beta' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {release.type.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {index === 0 && (
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="text-sm font-semibold">Latest</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    {release.changes.map((change, changeIndex) => (
                      <div
                        key={changeIndex}
                        className={`flex items-start gap-3 p-3 rounded-lg border ${getChangeColor(change.type)}`}
                      >
                        <div className="mt-0.5">
                          {getChangeIcon(change.type)}
                        </div>
                        <span className="flex-1 text-sm">{change.text}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="p-6 bg-white/95 backdrop-blur-md border-2 border-white/30 mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Development Roadmap</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold mb-2 text-green-700">✅ Completed Sprints</h3>
                <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                  <li><strong>Sprint 1:</strong> Input validation, error handling, error boundaries</li>
                  <li><strong>Sprint 2:</strong> Rate limiting, refresh tokens, DataLoader optimization</li>
                  <li><strong>Sprint 3:</strong> WebSocket notifications, map improvements, accessibility, performance monitoring</li>
                  <li><strong>Additional:</strong> Frontend optimization, UX improvements, structured logging</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-blue-700">🚀 Planned Features</h3>
                <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                  <li>Mobile applications (iOS and Android)</li>
                  <li>Advanced reporting and custom dashboards</li>
                  <li>Integration with external waste management systems</li>
                  <li>Multi-language support expansion</li>
                  <li>Advanced AI model training</li>
                  <li>API webhooks and integrations</li>
                  <li>Unit and integration tests</li>
                  <li>Redis caching for analytics</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </GreenGradientBackground>
  )
}
