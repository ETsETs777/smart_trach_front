import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { LOGIN } from '@/lib/graphql/mutations'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Recycle, Mail, Lock, ArrowLeft } from 'lucide-react'
import { useWasteStore } from '@/store/useWasteStore'
import GreenGradientBackground from '@/components/ui/GreenGradientBackground'

interface LoginFormData {
  email: string
  password: string
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { setCompanyId } = useWasteStore()
  const [login, { loading }] = useMutation(LOGIN)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    try {
      const { data: result } = await login({
        variables: {
          input: {
            email: data.email.trim().toLowerCase(),
            password: data.password,
          },
        },
      })

      if (result?.login?.jwtToken) {
        // Сохраняем токен
        localStorage.setItem('auth_token', result.login.jwtToken)
        localStorage.setItem('auth_role', result.login.role || '')
        
        // Устанавливаем companyId если есть
        const company = result.login.createdCompanies?.[0] || result.login.employeeCompanies?.[0]
        if (company?.id) {
          setCompanyId(company.id)
        }

        toast.success('Вход выполнен успешно!')
        
        // Редирект в зависимости от роли
        if (result.login.role === 'ADMIN_COMPANY') {
          navigate('/admin/dashboard')
        } else {
          navigate('/employee/dashboard')
        }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      const errorMessage = error?.graphQLErrors?.[0]?.message || error?.message || 'Ошибка входа'
      toast.error(errorMessage)
    }
  }

  return (
    <GreenGradientBackground>
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 border-gray-200 bg-white shadow-xl">
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-3 mb-6">
                <Recycle className="w-10 h-10 text-green-600" />
                <span className="text-3xl font-bold text-gray-800">
                  Smart Trash
                </span>
              </Link>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Вход в систему</h1>
              <p className="text-gray-600">Войдите в свой аккаунт</p>
            </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email обязателен',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Некорректный email',
                    },
                  })}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-gray-800 placeholder-gray-400"
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  {...register('password', {
                    required: 'Пароль обязателен',
                    minLength: {
                      value: 6,
                      message: 'Пароль должен быть не менее 6 символов',
                    },
                  })}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-gray-800 placeholder-gray-400"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={loading}
            >
              Войти
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Нет аккаунта?{' '}
              <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold underline">
                Зарегистрироваться
              </Link>
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
              Вернуться на главную
            </Link>
          </div>
        </Card>
      </motion.div>
      </div>
    </GreenGradientBackground>
  )
}

