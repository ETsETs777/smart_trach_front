import { motion } from 'framer-motion'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { ArrowLeft, Settings, BarChart3, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function AdminPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen p-8 landscape:px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Панель администратора
          </h1>
          <Button onClick={() => navigate('/')} variant="ghost" size="lg">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Назад
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <Card hover className="p-8 text-center cursor-pointer" onClick={() => {}}>
            <Settings className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Настройки</h2>
            <p className="text-gray-600">Управление контейнерами и областями сбора</p>
          </Card>

          <Card hover className="p-8 text-center cursor-pointer" onClick={() => {}}>
            <BarChart3 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Аналитика</h2>
            <p className="text-gray-600">Статистика и отчёты по использованию</p>
          </Card>

          <Card hover className="p-8 text-center cursor-pointer" onClick={() => {}}>
            <Users className="w-16 h-16 text-purple-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Сотрудники</h2>
            <p className="text-gray-600">Управление пользователями и правами</p>
          </Card>
        </div>

        <Card className="mt-8 p-8">
          <h2 className="text-2xl font-bold mb-4">Админ-панель в разработке</h2>
          <p className="text-gray-600">
            Полнофункциональная админ-панель будет доступна в следующих версиях приложения.
            Здесь вы сможете управлять контейнерами, просматривать детальную аналитику и настраивать систему.
          </p>
        </Card>
      </motion.div>
    </div>
  )
}

