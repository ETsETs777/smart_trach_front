import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { ArrowLeft, Building2, BarChart3, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ForCompaniesPage() {
  const navigate = useNavigate()

  const benefits = [
    {
      icon: BarChart3,
      title: 'Понятная аналитика',
      description:
        'Сколько сортировок в день, какие контейнеры используются чаще, кто из сотрудников самый активный.',
    },
    {
      icon: Trophy,
      title: 'Геймификация и вовлечение',
      description:
        'Лидеры, ачивки и очки помогают сделать экопрограмму частью корпоративной культуры, а не разовой акцией.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          На главную
        </Button>

        <div className="flex items-center gap-4">
          <Building2 className="w-10 h-10 text-green-500" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Smart Trash для компаний</h1>
            <p className="text-gray-600 mt-1">
              Инструмент для HR, ESG и экопрограмм, который реально используют сотрудники.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Запуск за несколько дней</h3>
            <p className="text-sm text-gray-700">
              Собираем требования, настраиваем схему контейнеров под ваш офис и выдаём инструкцию по
              установке планшетов.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Поддержка нескольких площадок</h3>
            <p className="text-sm text-gray-700">
              Управляйте несколькими офисами и областями сбора из одной админ‑панели, сравнивайте команд и
              города.
            </p>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Отчёты для ESG и CSR</h3>
            <p className="text-sm text-gray-700">
              Экспортируйте данные по сортировкам и активности сотрудников для годовых нефинансовых
              отчётов.
            </p>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {benefits.map((item) => {
            const Icon = item.icon
            return (
              <Card key={item.title} className="p-6 flex gap-4">
                <Icon className="w-8 h-8 text-emerald-500 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
                </div>
              </Card>
            )
          })}
        </div>

        <Card className="p-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              Хотите пилот в вашей компании?
            </h3>
            <p className="text-sm text-gray-700">
              Оставьте заявку — мы поможем подобрать сценарий запуска и подготовить коммуникации для
              сотрудников.
            </p>
          </div>
          <Button variant="primary" size="lg" onClick={() => navigate('/contacts')}>
            Оставить заявку
          </Button>
        </Card>
      </div>
    </div>
  )
}


