import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import GreenGradientBackground from '@/components/ui/GreenGradientBackground'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function GuidePage() {
  const navigate = useNavigate()

  const steps = [
    {
      title: 'Настройка компании',
      description: 'Заполните информацию о компании, загрузите логотип и настройте основные параметры.',
      action: 'Перейти в настройки'
    },
    {
      title: 'Создание областей сбора',
      description: 'Создайте области сбора отходов в вашей компании и настройте контейнеры для каждой области.',
      action: 'Управление областями'
    },
    {
      title: 'Добавление сотрудников',
      description: 'Пригласите сотрудников в систему, отправив им приглашения на регистрацию.',
      action: 'Управление сотрудниками'
    },
    {
      title: 'Настройка достижений',
      description: 'Создайте систему достижений для мотивации сотрудников к активной сортировке отходов.',
      action: 'Управление достижениями'
    },
    {
      title: 'Мониторинг и аналитика',
      description: 'Отслеживайте статистику сортировок, активность сотрудников и эффективность программы.',
      action: 'Просмотр аналитики'
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
            Назад
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-4 flex items-center gap-4">
              <BookOpen className="w-12 h-12" />
              Руководство по началу работы
            </h1>
            <p className="text-white/95 text-lg">Пошаговая инструкция по настройке системы</p>
          </motion.div>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-white/95 backdrop-blur-md border-2 border-white/30">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
                      </div>
                      <p className="text-gray-700 mb-3">{step.description}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-500 text-green-600 hover:bg-green-50"
                      >
                        {step.action}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </GreenGradientBackground>
  )
}

