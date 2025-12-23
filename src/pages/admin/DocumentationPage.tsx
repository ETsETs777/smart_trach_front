import { motion } from 'framer-motion'
import { ArrowLeft, Book, Code, Database, Settings, Users, BarChart3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import GreenGradientBackground from '@/components/ui/GreenGradientBackground'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function DocumentationPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

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
              <Book className="w-12 h-12" />
              {t('admin.docs.title')}
            </h1>
            <p className="text-white/95 text-lg">{t('admin.docs.subtitle')}</p>
          </motion.div>

          <div className="space-y-6">
            <Card className="p-6 bg-white/95 backdrop-blur-md border-2 border-white/30">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-green-600" />
                {t('admin.docs.employeeManagement')}
              </h2>
              <p className="text-gray-700 mb-4">
                {t('admin.docs.employeeManagementDesc')}
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Добавление новых сотрудников через email</li>
                <li>Подтверждение регистрации сотрудников</li>
                <li>Просмотр статистики активности</li>
                <li>Удаление сотрудников из компании</li>
              </ul>
            </Card>

            <Card className="p-6 bg-white/95 backdrop-blur-md border-2 border-white/30">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Settings className="w-6 h-6 text-blue-600" />
                {t('admin.docs.collectionAreas')}
              </h2>
              <p className="text-gray-700 mb-4">
                {t('admin.docs.collectionAreasDesc')}
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Создание новых областей сбора</li>
                <li>Настройка контейнеров для каждой области</li>
                <li>Просмотр статистики по областям</li>
                <li>QR-коды для быстрого доступа</li>
              </ul>
            </Card>

            <Card className="p-6 bg-white/95 backdrop-blur-md border-2 border-white/30">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-purple-600" />
                {t('admin.docs.analytics')}
              </h2>
              <p className="text-gray-700 mb-4">
                {t('admin.docs.analyticsDesc')}
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Общая статистика сортировок</li>
                <li>Использование контейнеров по типам</li>
                <li>Рейтинг сотрудников</li>
                <li>Экспорт данных в различных форматах</li>
              </ul>
            </Card>

            <Card className="p-6 bg-white/95 backdrop-blur-md border-2 border-white/30">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Database className="w-6 h-6 text-orange-600" />
                {t('admin.docs.companySettings')}
              </h2>
              <p className="text-gray-700 mb-4">
                {t('admin.docs.companySettingsDesc')}
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Редактирование названия и описания компании</li>
                <li>Загрузка логотипа компании</li>
                <li>Настройка уведомлений</li>
                <li>Управление интеграциями</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </GreenGradientBackground>
  )
}

