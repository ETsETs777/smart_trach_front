import { motion } from 'framer-motion'
import { ArrowLeft, Info, Target, Zap, Shield, Globe, Database, Cpu, Lock, Users, BarChart3, Award } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import GreenGradientBackground from '@/components/ui/GreenGradientBackground'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function AboutSystemPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const features = [
    {
      icon: Target,
      title: 'System Purpose',
      description: 'Smart Trash helps companies efficiently manage waste sorting, increasing environmental responsibility and reducing negative impact on the environment. Our platform enables organizations to track, analyze, and optimize their waste management processes.',
      details: [
        'Reduce environmental footprint',
        'Comply with waste management regulations',
        'Improve corporate sustainability metrics',
        'Engage employees in eco-friendly practices'
      ]
    },
    {
      icon: Zap,
      title: 'Technology Stack',
      description: 'We use cutting-edge technologies: artificial intelligence for waste recognition, cloud computing, and mobile applications for ease of use. Built with modern frameworks for scalability and performance.',
      details: [
        'AI-powered waste classification (GigaChat)',
        'GraphQL API with subscriptions for real-time updates',
        'Real-time analytics and reporting',
        'Mobile-responsive web interface',
        'Cloud-based infrastructure',
        'Structured logging with Pino',
        'Performance monitoring and optimization',
        'Pagination for large datasets'
      ]
    },
    {
      icon: Shield,
      title: 'Security & Privacy',
      description: 'All data is protected with modern encryption methods. We comply with all data protection requirements including GDPR, ensuring your company and employee data remains secure.',
      details: [
        'End-to-end encryption',
        'GDPR compliant',
        'Regular security audits',
        'JWT-based authentication with refresh tokens',
        'Role-based access control',
        'Rate limiting and DDoS protection',
        'Audit logging for all user actions',
        'Data backup and recovery'
      ]
    },
    {
      icon: Globe,
      title: 'Scalability',
      description: 'The system easily scales and can be adapted to the needs of companies of any size - from small businesses to large corporations. Our infrastructure handles growth seamlessly.',
      details: [
        'Multi-tenant architecture',
        'Horizontal scaling support',
        'Cloud-native design',
        'Handles thousands of users',
        'Unlimited data storage',
        'Global deployment options'
      ]
    },
    {
      icon: Database,
      title: 'Data Management',
      description: 'Comprehensive data management with PostgreSQL database, MinIO for file storage, and Redis for caching. All data is backed up regularly and can be exported at any time.',
      details: [
        'PostgreSQL relational database',
        'MinIO S3-compatible storage',
        'Redis caching layer',
        'Automated backups',
        'Data export capabilities (CSV, Excel, PDF)',
        'Structured audit logs with Pino',
        'DataLoader for GraphQL optimization',
        'Pagination support for large datasets'
      ]
    },
    {
      icon: Cpu,
      title: 'AI & Machine Learning',
      description: 'Advanced AI capabilities powered by GigaChat for accurate waste classification. The system learns and improves over time, providing increasingly accurate results.',
      details: [
        'Real-time image analysis',
        'Multi-category classification',
        'Learning and improvement',
        'High accuracy rates',
        'Fast processing times',
        'Continuous model updates',
        'WebSocket notifications for status updates',
        'Real-time achievement and leaderboard updates'
      ]
    }
  ]

  const stats = [
    { label: 'System Version', value: '1.2.0', icon: Info },
    { label: 'Release Date', value: 'January 2025', icon: Info },
    { label: 'License', value: 'Proprietary', icon: Lock },
    { label: 'Platform', value: 'Web & Mobile', icon: Globe }
  ]

  const capabilities = [
    { icon: Users, text: 'Unlimited employees per company' },
    { icon: BarChart3, text: 'Real-time analytics and reporting' },
    { icon: Award, text: 'Gamification with real-time achievement notifications' },
    { icon: Database, text: 'Comprehensive data management with pagination' },
    { icon: Zap, text: 'Performance monitoring and optimization' },
    { icon: Shield, text: 'Advanced security with audit logging' }
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
              <Info className="w-12 h-12" />
              About System
            </h1>
            <p className="text-white/95 text-lg">Information about the Smart Trash platform</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 bg-white/95 backdrop-blur-md border-2 border-white/30 text-center">
                    <Icon className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 bg-white/95 backdrop-blur-md border-2 border-white/30 h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="w-8 h-8 text-green-600" />
                      <h3 className="text-xl font-bold text-gray-800">{feature.title}</h3>
                    </div>
                    <p className="text-gray-700 mb-4">{feature.description}</p>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Key Features:</h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                        {feature.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <Card className="p-6 bg-white/95 backdrop-blur-md border-2 border-white/30">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">System Capabilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {capabilities.map((cap, index) => {
                const Icon = cap.icon
                return (
                  <div key={index} className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">{cap.text}</span>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </GreenGradientBackground>
  )
}
