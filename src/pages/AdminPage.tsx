import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { ArrowLeft, Settings, BarChart3, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function AdminPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="min-h-screen p-8 landscape:px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {t('admin.dashboard.title')}
          </h1>
          <Button onClick={() => navigate('/')} variant="ghost" size="lg">
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t('common.back')}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <Card hover className="p-8 text-center cursor-pointer" onClick={() => {}}>
            <Settings className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t('admin.dashboard.settings')}</h2>
            <p className="text-gray-600">{t('admin.dashboard.settingsDesc')}</p>
          </Card>

          <Card hover className="p-8 text-center cursor-pointer" onClick={() => {}}>
            <BarChart3 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t('admin.dashboard.analytics')}</h2>
            <p className="text-gray-600">{t('admin.dashboard.analyticsDesc')}</p>
          </Card>

          <Card hover className="p-8 text-center cursor-pointer" onClick={() => {}}>
            <Users className="w-16 h-16 text-purple-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t('admin.dashboard.employees')}</h2>
            <p className="text-gray-600">{t('admin.dashboard.employeesDesc')}</p>
          </Card>
        </div>

        <Card className="mt-8 p-8">
          <h2 className="text-2xl font-bold mb-4">Admin Panel in Development</h2>
          <p className="text-gray-600">
            Full-featured admin panel will be available in future versions of the application.
            Here you will be able to manage containers, view detailed analytics and configure the system.
          </p>
        </Card>
      </motion.div>
    </div>
  )
}

