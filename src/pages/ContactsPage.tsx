import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ContactsPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="lg" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            На главную
          </Button>
        </div>

        <Card className="p-8 space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">Контакты</h1>
          <p className="text-gray-600">
            Напишите нам, если хотите протестировать Smart Trash в вашей компании или задать вопросы по внедрению.
          </p>

          <div className="space-y-4 text-gray-700">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-green-600 mt-1" />
              <div>
                <div className="font-semibold">Email</div>
                <div className="text-sm text-gray-600">eco@smart-trash.ru</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-green-600 mt-1" />
              <div>
                <div className="font-semibold">Телефон</div>
                <div className="text-sm text-gray-600">+7 (999) 000‑00‑00</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-green-600 mt-1" />
              <div>
                <div className="font-semibold">Локация</div>
                <div className="text-sm text-gray-600">Россия, офис в формате remote‑first</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}



