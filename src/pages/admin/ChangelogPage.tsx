import { motion } from 'framer-motion'
import { ArrowLeft, GitBranch, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import GreenGradientBackground from '@/components/ui/GreenGradientBackground'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function ChangelogPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const changelog = [
    {
      version: '1.0.0',
      date: '2024-12-23',
      changes: [
        'First version of Smart Trash system',
        'Admin dashboard added',
        'Analytics system implemented',
        'Employee management added',
        'AI integration for waste recognition',
        'Achievements system and gamification'
      ]
    }
  ]

  return (
    <GreenGradientBackground>
      <div className="min-h-screen p-8 landscape:px-16 text-white">
        <div className="max-w-4xl mx-auto">
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
              {t('admin.changelog.title')}
            </h1>
            <p className="text-white/95 text-lg">{t('admin.changelog.subtitle')}</p>
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
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      <GitBranch className="w-6 h-6 text-green-600" />
                      {t('admin.changelog.version')} {release.version}
                    </h2>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{release.date}</span>
                    </div>
                  </div>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {release.changes.map((change, changeIndex) => (
                      <li key={changeIndex}>{change}</li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </GreenGradientBackground>
  )
}

