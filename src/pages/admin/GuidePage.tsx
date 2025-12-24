import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, CheckCircle, ArrowRight, Settings, MapPin, Users, Award, BarChart3, Upload, QrCode, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import GreenGradientBackground from '@/components/ui/GreenGradientBackground'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function GuidePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const steps = [
    {
      number: 1,
      title: 'Company Setup',
      description: 'Configure your company profile, upload logo, and set up basic information. This is the foundation of your waste management system.',
      icon: Settings,
      path: '/admin/settings',
      details: [
        'Enter company name and description',
        'Upload company logo (PNG, JPG, SVG up to 5MB)',
        'Configure contact information',
        'Set up notification preferences',
        'Review and save company settings'
      ],
      tips: [
        'Use a high-quality logo for best display',
        'Keep company description concise but informative',
        'Enable notifications to stay updated'
      ]
    },
    {
      number: 2,
      title: 'Create Collection Areas',
      description: 'Set up collection areas in your company and configure containers for each area. This helps organize waste collection by location.',
      icon: MapPin,
      path: '/admin/areas',
      details: [
        'Click "Create Area" button',
        'Enter area name and description',
        'Add containers for each waste type (plastic, paper, glass, etc.)',
        'Generate QR codes for quick access',
        'Save and activate the area'
      ],
      tips: [
        'Create areas based on physical locations (offices, floors, departments)',
        'Generate QR codes and place them near collection points',
        'Use descriptive names for easy identification'
      ]
    },
    {
      number: 3,
      title: 'Add Employees',
      description: 'Invite employees to join the system by sending email invitations. Employees can then register and start using the platform.',
      icon: Users,
      path: '/admin/employees',
      details: [
        'Navigate to Employees page',
        'Click "Add Employee" or "Invite Employee"',
        'Enter employee email address',
        'System sends invitation email automatically',
        'Employee receives email and completes registration',
        'Confirm employee registration if needed'
      ],
      tips: [
        'Send invitations in batches for efficiency',
        'Follow up with employees who haven\'t registered',
        'Use clear email addresses to avoid typos'
      ]
    },
    {
      number: 4,
      title: 'Configure Achievements',
      description: 'Set up achievement system to motivate employees. Create custom achievements with different criteria and point rewards.',
      icon: Award,
      path: '/admin/achievements',
      details: [
        'Go to Achievements page',
        'Click "Create Achievement"',
        'Enter achievement name and description',
        'Set achievement criteria (e.g., 10 classifications)',
        'Configure point rewards',
        'Choose achievement category and icon',
        'Activate the achievement'
      ],
      tips: [
        'Start with simple achievements to encourage participation',
        'Gradually introduce more challenging achievements',
        'Use meaningful rewards to motivate employees'
      ]
    },
    {
      number: 5,
      title: 'Monitor Analytics',
      description: 'Track statistics, employee activity, and program effectiveness. Use analytics to make data-driven decisions.',
      icon: BarChart3,
      path: '/admin/analytics',
      details: [
        'View real-time dashboard statistics',
        'Check container usage by type',
        'Review employee leaderboard',
        'Export data for external analysis',
        'Filter data by date range',
        'Compare performance over time'
      ],
      tips: [
        'Check analytics regularly to track progress',
        'Export reports for management presentations',
        'Use filters to analyze specific time periods'
      ]
    },
    {
      number: 6,
      title: 'Start Using the System',
      description: 'Once setup is complete, employees can start uploading photos of waste for classification. The AI will identify the waste type and provide disposal instructions.',
      icon: Upload,
      path: '/tablet',
      details: [
        'Employees access the tablet interface',
        'Take or upload photo of waste item',
        'AI analyzes and classifies the waste',
        'System provides disposal instructions',
        'Employee receives points for correct classification',
        'Data is tracked in analytics'
      ],
      tips: [
        'Ensure good lighting for photos',
        'Take clear photos of waste items',
        'Follow disposal instructions provided'
      ]
    }
  ]

  const quickActions = [
    { label: 'Company Settings', path: '/admin/settings', icon: Settings },
    { label: 'Collection Areas', path: '/admin/areas', icon: MapPin },
    { label: 'Employees', path: '/admin/employees', icon: Users },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 }
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
              <BookOpen className="w-12 h-12" />
              Getting Started Guide
            </h1>
            <p className="text-white/95 text-lg">Step-by-step instructions for setting up and using the system</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    onClick={() => navigate(action.path)}
                    variant="ghost"
                    className="w-full bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 backdrop-blur-md h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm">{action.label}</span>
                  </Button>
                </motion.div>
              )
            })}
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-white/95 backdrop-blur-md border-2 border-white/30">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg">
                        {step.number}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Icon className="w-6 h-6 text-green-600" />
                          <h3 className="text-2xl font-bold text-gray-800">{step.title}</h3>
                        </div>
                        <p className="text-gray-700 mb-4">{step.description}</p>
                        
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Steps:
                          </h4>
                          <ol className="list-decimal list-inside text-gray-700 space-y-1 text-sm">
                            {step.details.map((detail, idx) => (
                              <li key={idx}>{detail}</li>
                            ))}
                          </ol>
                        </div>

                        {step.tips && step.tips.length > 0 && (
                          <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                            <h4 className="font-semibold text-green-800 mb-2 text-sm">💡 Tips:</h4>
                            <ul className="list-disc list-inside text-green-700 space-y-1 text-sm">
                              {step.tips.map((tip, idx) => (
                                <li key={idx}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <Button
                          onClick={() => navigate(step.path)}
                          variant="outline"
                          size="sm"
                          className="border-green-500 text-green-600 hover:bg-green-50"
                        >
                          Go to {step.title}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <Card className="p-6 bg-white/95 backdrop-blur-md border-2 border-white/30 mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Bell className="w-6 h-6 text-green-600" />
              Need Help?
            </h2>
            <p className="text-gray-700 mb-4">
              If you encounter any issues or have questions, don't hesitate to reach out:
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => navigate('/admin/help')}
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50"
              >
                Visit Help Center
              </Button>
              <Button
                onClick={() => navigate('/admin/docs')}
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50"
              >
                View Documentation
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </GreenGradientBackground>
  )
}
