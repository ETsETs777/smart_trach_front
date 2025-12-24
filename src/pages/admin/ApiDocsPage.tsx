import { motion } from 'framer-motion'
import { ArrowLeft, Code, Terminal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import GreenGradientBackground from '@/components/ui/GreenGradientBackground'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function ApiDocsPage() {
  const navigate = useNavigate()

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
              <Code className="w-12 h-12" />
              API Документация
            </h1>
            <p className="text-white/95 text-lg">Документация по GraphQL API</p>
          </motion.div>

          <Card className="p-6 bg-white/95 backdrop-blur-md border-2 border-white/30 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">GraphQL Endpoint</h2>
            </div>
            <code className="block p-4 bg-gray-100 rounded-lg text-gray-800 mb-4">
              POST http://localhost:5000/graphql
            </code>
            <p className="text-gray-700 mb-4">
              Система использует GraphQL API для всех операций. Вы можете использовать GraphQL Playground для тестирования запросов.
            </p>
            <Button
              onClick={() => window.open('http://localhost:5000/graphql', '_blank')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Открыть GraphQL Playground
            </Button>
          </Card>

          <Card className="p-6 bg-white/95 backdrop-blur-md border-2 border-white/30">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Основные запросы</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Аутентификация</h3>
                <code className="block p-3 bg-gray-100 rounded text-sm text-gray-800">
                  mutation Login($input: LoginInput!) {'{'} login(input: $input) {'{'} jwtToken {'}'} {'}'}
                </code>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Аналитика компании</h3>
                <code className="block p-3 bg-gray-100 rounded text-sm text-gray-800">
                  query GetAnalytics($companyId: String!) {'{'} companyAnalytics(companyId: $companyId) {'{'} binUsage leaderboard {'}'} {'}'}
                </code>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">Создание сотрудника</h3>
                <code className="block p-3 bg-gray-100 rounded text-sm text-gray-800">
                  mutation CreateEmployee($input: EmployeeCreateInput!) {'{'} createEmployee(input: $input) {'{'} id email {'}'} {'}'}
                </code>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </GreenGradientBackground>
  )
}

