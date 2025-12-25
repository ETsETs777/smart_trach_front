import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { CONFIRM_EMAIL } from '@/lib/graphql/mutations'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import GreenGradientBackground from '@/components/ui/GreenGradientBackground'
import { tokenStorage } from '@/lib/auth/tokenStorage'

export default function ConfirmEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const email = (location.state as any)?.email || ''
  const [token, setToken] = useState('')
  const [confirmEmail, { loading }] = useMutation(CONFIRM_EMAIL)

  const handleConfirm = async () => {
    if (!token.trim()) {
      toast.error('Введите токен подтверждения')
      return
    }

    try {
      const { data } = await confirmEmail({
        variables: {
          input: {
            token: token.trim(),
          },
        },
      })

      if (data?.confirmEmail?.jwtToken) {
        tokenStorage.setTokens({
          accessToken: data.confirmEmail.jwtToken,
          role: data.confirmEmail.role || undefined,
          expiresAt: data.confirmEmail.tokenExpiresAt ? new Date(data.confirmEmail.tokenExpiresAt).getTime() : undefined,
        })
        toast.success('Email подтверждён! Добро пожаловать!')
        
        // Редирект в зависимости от роли
        if (data.confirmEmail.role === 'ADMIN_COMPANY') {
          navigate('/admin/dashboard')
        } else {
          navigate('/employee/dashboard')
        }
      }
    } catch (error: any) {
      console.error('Confirm email error:', error)
      const errorMessage = error?.graphQLErrors?.[0]?.message || error?.message || 'Ошибка подтверждения'
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
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4"
              >
                <Mail className="w-10 h-10 text-green-600" />
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Подтвердите email</h1>
              <p className="text-gray-600">
                Мы отправили код подтверждения на <strong className="text-gray-800">{email}</strong>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Введите код из письма для завершения регистрации
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                  Код подтверждения
                </label>
                <input
                  id="token"
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-center text-2xl tracking-widest text-gray-800"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>

              <Button
                onClick={handleConfirm}
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={loading}
              >
                <CheckCircle className="w-5 h-5 mr-2 inline" />
                Подтвердить
              </Button>

              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Не получили письмо? Проверьте папку "Спам" или{' '}
                  <button className="text-green-600 hover:text-green-700 font-semibold">
                    отправить повторно
                  </button>
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Вернуться на главную
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </GreenGradientBackground>
  )
}

