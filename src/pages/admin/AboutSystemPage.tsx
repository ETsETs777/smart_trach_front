import { motion } from 'framer-motion'
import { ArrowLeft, Info, Target, Zap, Shield, Globe } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import GreenGradientBackground from '@/components/ui/GreenGradientBackground'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function AboutSystemPage() {
  const navigate = useNavigate()

  const features = [
    {
      icon: Target,
      title: 'Цель системы',
      description: 'Smart Trash помогает компаниям эффективно управлять сортировкой отходов, повышая экологическую ответственность и снижая негативное воздействие на окружающую среду.'
    },
    {
      icon: Zap,
      title: 'Технологии',
      description: 'Используем современные технологии: искусственный интеллект для распознавания отходов, облачные вычисления и мобильные приложения для удобства использования.'
    },
    {
      icon: Shield,
      title: 'Безопасность',
      description: 'Все данные защищены современными методами шифрования. Мы соблюдаем все требования по защите персональных данных.'
    },
    {
      icon: Globe,
      title: 'Масштабируемость',
      description: 'Система легко масштабируется и может быть адаптирована под нужды компаний любого размера - от малого бизнеса до крупных корпораций.'
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
              <Info className="w-12 h-12" />
              О системе
            </h1>
            <p className="text-white/95 text-lg">Информация о платформе Smart Trash</p>
          </motion.div>

          <Card className="p-6 bg-white/95 backdrop-blur-md border-2 border-white/30 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Версия системы</h2>
            <p className="text-gray-700 mb-2">
              <strong>Версия:</strong> 1.0.0
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Дата релиза:</strong> 2024
            </p>
            <p className="text-gray-700">
              <strong>Лицензия:</strong> Proprietary
            </p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <p className="text-gray-700">{feature.description}</p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </GreenGradientBackground>
  )
}

