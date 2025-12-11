import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { ArrowLeft, Recycle, Users, Globe2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function AboutPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          На главную
        </Button>

        <div className="flex items-center gap-4">
          <Recycle className="w-10 h-10 text-green-500" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900">О компании Smart Trash</h1>
            <p className="text-gray-600 mt-1">
              Мы помогаем офисам и бизнес‑центрам внедрять культуру осознанного обращения с отходами.
            </p>
          </div>
        </div>

        <Card className="p-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Наша миссия</h2>
          <p className="text-gray-700 leading-relaxed">
            Сделать раздельный сбор отходов в офисе таким же простым и привычным, как отправить сообщение
            в мессенджере. Без долгих инструкций и споров у урны — система сама подскажет, куда выбросить
            конкретный предмет и как его подготовить.
          </p>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Для сотрудников</h3>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              Убираем барьер «не знаю, куда это выбросить». Простые подсказки, геймификация, рейтинг и
              ачивки мотивируют участвовать в экопрограмме компании каждый день.
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Globe2 className="w-6 h-6 text-emerald-500" />
              <h3 className="text-lg font-semibold text-gray-900">Для бизнеса и планеты</h3>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              Smart Trash помогает компании выполнять ESG‑цели, снижать количество смешанных отходов и
              показывать реальные цифры по вовлеченности сотрудников и переработке.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}


