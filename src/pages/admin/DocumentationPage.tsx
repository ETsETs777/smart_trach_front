import { motion } from 'framer-motion'
import { ArrowLeft, Book, Code, Database, Settings, Users, BarChart3, Award, Trash2, QrCode, Bell, Shield, FileText, Download, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import GreenGradientBackground from '@/components/ui/GreenGradientBackground'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function DocumentationPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const sections = [
    {
      icon: Users,
      title: t('admin.docs.employeeManagement'),
      description: t('admin.docs.employeeManagementDesc'),
      color: 'text-green-600',
      features: [
        'Add new employees via email invitation',
        'Confirm employee registration and activation',
        'View employee activity statistics and performance metrics',
        'Manage employee roles and permissions',
        'Remove employees from the company',
        'Track employee achievements and points',
        'Export employee data and reports'
      ],
      actions: [
        { label: 'Go to Employees', path: '/admin/employees' }
      ]
    },
    {
      icon: Settings,
      title: t('admin.docs.collectionAreas'),
      description: t('admin.docs.collectionAreasDesc'),
      color: 'text-blue-600',
      features: [
        'Create new collection areas with custom names and descriptions',
        'Configure containers for each area (plastic, paper, glass, organic, etc.)',
        'Generate QR codes for quick access to each area',
        'View statistics and usage data per area',
        'Manage area settings and container types',
        'Set up collection schedules and reminders',
        'Monitor waste collection efficiency by area'
      ],
      actions: [
        { label: 'Manage Areas', path: '/admin/areas' }
      ]
    },
    {
      icon: BarChart3,
      title: t('admin.docs.analytics'),
      description: t('admin.docs.analyticsDesc'),
      color: 'text-purple-600',
      features: [
        'Comprehensive sorting statistics and trends',
        'Container usage by type and location',
        'Employee leaderboard and rankings',
        'Export data in CSV, Excel, and PDF formats',
        'Real-time analytics dashboard',
        'Historical data comparison',
        'Custom date range filtering',
        'Visual charts and graphs'
      ],
      actions: [
        { label: 'View Analytics', path: '/admin/analytics' }
      ]
    },
    {
      icon: Database,
      title: t('admin.docs.companySettings'),
      description: t('admin.docs.companySettingsDesc'),
      color: 'text-orange-600',
      features: [
        'Edit company name, description, and contact information',
        'Upload and manage company logo',
        'Configure email notifications and alerts',
        'Manage API integrations and webhooks',
        'Set up company-wide policies and rules',
        'Configure data retention and backup settings',
        'Manage user permissions and access levels'
      ],
      actions: [
        { label: 'Company Settings', path: '/admin/settings' }
      ]
    },
    {
      icon: Award,
      title: 'Achievements System',
      description: 'Create and manage achievement system to motivate employees and gamify waste sorting.',
      color: 'text-yellow-600',
      features: [
        'Create custom achievements with different criteria',
        'Set up point rewards for various actions',
        'Track employee progress towards achievements',
        'Display achievement notifications and celebrations',
        'Manage achievement categories and tiers',
        'View employee achievement history',
        'Export achievement statistics'
      ],
      actions: [
        { label: 'Manage Achievements', path: '/admin/achievements' }
      ]
    },
    {
      icon: Trash2,
      title: 'Waste Classification',
      description: 'AI-powered waste classification system with detailed disposal instructions.',
      color: 'text-emerald-600',
      features: [
        'Automatic waste type recognition using AI',
        'Detailed disposal instructions for each waste type',
        'Photo upload and analysis functionality',
        'History of all classified waste items',
        'Search and filter waste history',
        'Export waste classification reports',
        'Integration with collection areas'
      ],
      actions: [
        { label: 'View History', path: '/history' }
      ]
    },
    {
      icon: QrCode,
      title: 'QR Code System',
      description: 'Generate and manage QR codes for quick access to collection areas.',
      color: 'text-indigo-600',
      features: [
        'Generate unique QR codes for each collection area',
        'Download QR codes in various formats (PNG, SVG, PDF)',
        'Print-ready QR code templates',
        'Track QR code usage and scans',
        'Manage QR code expiration and access',
        'Customize QR code appearance and size'
      ],
      actions: []
    },
    {
      icon: Bell,
      title: 'Notifications & Alerts',
      description: 'Configure notification settings and alerts for important events.',
      color: 'text-pink-600',
      features: [
        'Email notifications for employee registrations',
        'Alerts for achievement unlocks',
        'Weekly and monthly statistics reports',
        'Container capacity warnings',
        'System maintenance notifications',
        'Custom notification rules and triggers'
      ],
      actions: []
    }
  ]

  return (
    <GreenGradientBackground>
      <div className="min-h-screen p-8 landscape:px-16 text-white">
        <div className="max-w-6xl mx-auto">
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
              <Book className="w-12 h-12" />
              {t('admin.docs.title')}
            </h1>
            <p className="text-white/95 text-lg">
              Comprehensive documentation and guides for all system features and capabilities
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {sections.map((section, index) => {
              const Icon = section.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-white/95 backdrop-blur-md border-2 border-white/30 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <Icon className={`w-8 h-8 ${section.color}`} />
                      <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
                    </div>
                    <p className="text-gray-700 mb-4 flex-grow">{section.description}</p>
                    
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Key Features:
                      </h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                        {section.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))}
                      </ul>
                    </div>

                    {section.actions.length > 0 && (
                      <div className="flex gap-2 mt-auto">
                        {section.actions.map((action, idx) => (
                          <Button
                            key={idx}
                            onClick={() => navigate(action.path)}
                            variant="outline"
                            size="sm"
                            className="border-green-500 text-green-600 hover:bg-green-50"
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <Card className="p-6 bg-white/95 backdrop-blur-md border-2 border-white/30">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-600" />
              Security & Privacy
            </h2>
            <p className="text-gray-700 mb-4">
              Your data is protected with industry-standard security measures:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>End-to-end encryption for all data transmissions</li>
              <li>GDPR and data protection compliance</li>
              <li>Regular security audits and updates</li>
              <li>Secure authentication with JWT tokens</li>
              <li>Role-based access control (RBAC)</li>
              <li>Data backup and disaster recovery</li>
            </ul>
          </Card>
        </div>
      </div>
    </GreenGradientBackground>
  )
}
