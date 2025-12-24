import { motion } from 'framer-motion'
import { ArrowLeft, Code, Terminal, Book, Copy, Check, ExternalLink, Key, Database, User, BarChart3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import GreenGradientBackground from '@/components/ui/GreenGradientBackground'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function ApiDocsPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const queries = [
    {
      id: 'auth',
      title: 'Authentication',
      icon: Key,
      description: 'User authentication and authorization',
      examples: [
        {
          name: 'Login',
          query: `mutation Login($input: LoginInput!) {
  login(input: $input) {
    id
    email
    fullName
    role
    jwtToken
    isEmailConfirmed
    createdCompanies {
      id
      name
    }
  }
}`,
          variables: `{
  "input": {
    "email": "admin@smarttrash.ru",
    "password": "admin123"
  }
}`
        },
        {
          name: 'Get Current User',
          query: `query GetMe {
  me {
    id
    email
    fullName
    role
    createdCompanies {
      id
      name
      logo {
        id
        url
      }
    }
    employeeCompanies {
      id
      name
    }
  }
}`
        }
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: BarChart3,
      description: 'Company analytics and statistics',
      examples: [
        {
          name: 'Company Analytics',
          query: `query GetCompanyAnalytics($companyId: String!) {
  companyAnalytics(companyId: $companyId) {
    binUsage {
      binType
      count
    }
    leaderboard {
      employee {
        id
        fullName
        email
      }
      totalClassifiedPhotos
      rank
    }
    hallOfFame {
      employee {
        id
        fullName
      }
      achievement {
        id
        title
      }
    }
    areas {
      id
      name
      binCount
    }
  }
}`,
          variables: `{
  "companyId": "your-company-id"
}`
        }
      ]
    },
    {
      id: 'employees',
      title: 'Employee Management',
      icon: User,
      description: 'Create and manage employees',
      examples: [
        {
          name: 'Create Employee',
          query: `mutation CreateEmployee($input: EmployeeCreateInput!) {
  createEmployee(input: $input) {
    id
    email
    fullName
    role
    isEmailConfirmed
  }
}`,
          variables: `{
  "input": {
    "email": "employee@example.com",
    "fullName": "John Doe",
    "companyId": "your-company-id"
  }
}`
        },
        {
          name: 'Get Employees',
          query: `query GetEmployees($companyId: String!) {
  employees(companyId: $companyId) {
    id
    email
    fullName
    role
    isActive
    totalClassifiedPhotos
  }
}`
        }
      ]
    },
    {
      id: 'company',
      title: 'Company Management',
      icon: Database,
      description: 'Company settings and information',
      examples: [
        {
          name: 'Get Company',
          query: `query GetCompany($id: String!) {
  company(id: $id) {
    id
    name
    description
    logo {
      id
      url
    }
    createdBy {
      id
      email
    }
  }
}`,
          variables: `{
  "id": "your-company-id"
}`
        },
        {
          name: 'Update Company',
          query: `mutation UpdateCompany($input: CompanyUpdateInput!) {
  updateCompany(input: $input) {
    id
    name
    description
  }
}`
        }
      ]
    }
  ]

  return (
    <GreenGradientBackground>
      <div className="min-h-screen p-8 landscape:px-16 text-white">
        <div className="max-w-6xl mx-auto">
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
              <Code className="w-12 h-12" />
              API Documentation
            </h1>
            <p className="text-white/95 text-lg">Complete GraphQL API reference and examples</p>
          </motion.div>

          <Card className="p-6 bg-white/95 backdrop-blur-md border-2 border-white/30 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">GraphQL Endpoint</h2>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <code className="flex-1 p-4 bg-gray-100 rounded-lg text-gray-800 font-mono text-sm">
                POST http://localhost:5000/graphql
              </code>
              <Button
                onClick={() => copyToClipboard('http://localhost:5000/graphql', 'endpoint')}
                variant="outline"
                size="sm"
                className="border-green-500 text-green-600 hover:bg-green-50"
              >
                {copied === 'endpoint' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-gray-700 mb-4">
              The system uses GraphQL API for all operations. You can use GraphQL Playground for testing queries and mutations.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => window.open('http://localhost:5000/graphql', '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open GraphQL Playground
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open('https://graphql.org/learn/', '_blank')}
                className="border-green-500 text-green-600 hover:bg-green-50"
              >
                <Book className="w-4 h-4 mr-2" />
                Learn GraphQL
              </Button>
            </div>
          </Card>

          <div className="space-y-6">
            {queries.map((category, categoryIndex) => {
              const Icon = category.icon
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: categoryIndex * 0.1 }}
                >
                  <Card className="p-6 bg-white/95 backdrop-blur-md border-2 border-white/30">
                    <div className="flex items-center gap-3 mb-4">
                      <Icon className="w-6 h-6 text-green-600" />
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">{category.title}</h2>
                        <p className="text-gray-600 text-sm">{category.description}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {category.examples.map((example, exampleIndex) => (
                        <div key={exampleIndex} className="border-t border-gray-200 pt-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-gray-800">{example.name}</h3>
                            <Button
                              onClick={() => copyToClipboard(example.query, `${category.id}-${exampleIndex}`)}
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:bg-green-50"
                            >
                              {copied === `${category.id}-${exampleIndex}` ? (
                                <>
                                  <Check className="w-4 h-4 mr-1" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4 mr-1" />
                                  Copy
                                </>
                              )}
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Query:</p>
                              <code className="block p-3 bg-gray-100 rounded text-sm text-gray-800 font-mono overflow-x-auto">
                                {example.query}
                              </code>
                            </div>
                            {example.variables && (
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Variables:</p>
                                <code className="block p-3 bg-gray-100 rounded text-sm text-gray-800 font-mono overflow-x-auto">
                                  {example.variables}
                                </code>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          <Card className="p-6 bg-white/95 backdrop-blur-md border-2 border-white/30 mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication</h2>
            <p className="text-gray-700 mb-4">
              All API requests require authentication. Include the JWT token in the Authorization header:
            </p>
            <code className="block p-4 bg-gray-100 rounded-lg text-gray-800 font-mono text-sm">
              Authorization: Bearer YOUR_JWT_TOKEN
            </code>
            <p className="text-gray-600 text-sm mt-4">
              Get your token by logging in through the login mutation or the web interface.
            </p>
          </Card>
        </div>
      </div>
    </GreenGradientBackground>
  )
}
