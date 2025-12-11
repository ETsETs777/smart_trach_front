import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { ArrowLeft, Camera, List, QrCode, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function HowItWorksPage() {
  const navigate = useNavigate()

  const steps = [
    {
      title: 'Планшет над урной',
      description: 'На кронштейне над блоком контейнеров закрепляется планшет с нашим веб‑приложением.',
    },
    {
      title: 'Определение отхода',
      description:
        'Сотрудник подносит предмет к камере, делает фото или выбирает тип вручную. В будущем — сканирует штрих‑код.',
    },
    {
      title: 'Подсказка и инструкции',
      description:
        'Система подсвечивает нужный контейнер на схеме, показывает краткие шаги: что нужно снять, ополоснуть, сложить.',
    },
    {
      title: 'Геймификация и аналитика',
      description:
        'За каждую корректную сортировку начисляются очки, а администратор видит аналитику по сотрудникам и контейнерам.',
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
          <Camera className="w-10 h-10 text-green-500" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Как работает Smart Trash</h1>
            <p className="text-gray-600 mt-1">
              Пошагово — от планшета над урной до отчётов для HR и ESG‑отчётности.
            </p>
          </div>
        </div>

        <Card className="p-8 grid md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-500" />
              По фото
            </h3>
            <p className="text-sm text-gray-700">
              Сфотографируйте предмет, и AI (GigaChat) подскажет тип отхода и подходящий контейнер.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <List className="w-5 h-5 text-blue-500" />
              Вручную
            </h3>
            <p className="text-sm text-gray-700">
              Если камера недоступна, выберите тип отхода из удобного списка с примерами.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-purple-500" />
              По коду
            </h3>
            <p className="text-sm text-gray-700">
              Поддержка штрих‑кодов и QR в разработке — для типовых офисных товаров и упаковки.
            </p>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((step, index) => (
            <Card key={step.title} className="p-6">
              <div className="text-sm font-semibold text-emerald-600 mb-1">Шаг {index + 1}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{step.description}</p>
            </Card>
          ))}
        </div>

        <Card className="p-6 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              Готовы подключить Smart Trash в вашей компании?
            </h3>
            <p className="text-sm text-gray-700">
              Зарегистрируйтесь сейчас или перейдите в демо‑режим, чтобы посмотреть сценарий работы.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="primary" size="lg" onClick={() => navigate('/register')}>
              Подключить компанию
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/demo')}>
              Попробовать демо
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}


