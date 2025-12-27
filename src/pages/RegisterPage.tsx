import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { toastError, toastSuccess } from '@/lib/utils/toast'
import { validateFile } from '@/lib/utils/fileValidation'
import { checkPasswordStrength, getPasswordStrengthColor, getPasswordStrengthProgress } from '@/lib/utils/passwordStrength'
import { getCsrfToken } from '@/lib/auth/csrf'
import { withRateLimit, RATE_LIMITS } from '@/lib/utils/rateLimiter'
import { REGISTER_ADMIN } from '@/lib/graphql/mutations'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Recycle, User, Mail, Lock, Building, FileText, Upload, ArrowLeft, X } from 'lucide-react'
import GreenGradientBackground from '@/components/ui/GreenGradientBackground'

interface RegisterFormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  companyName: string
  companyDescription?: string
  logoId?: string
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [registerAdmin, { loading }] = useMutation(REGISTER_ADMIN)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [passwordStrength, setPasswordStrength] = useState<ReturnType<typeof checkPasswordStrength> | null>(null)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>()

  const password = watch('password')

  // Check password strength on change
  useEffect(() => {
    if (password && password.length > 0) {
      const strength = checkPasswordStrength(password)
      setPasswordStrength(strength)
    } else {
      setPasswordStrength(null)
    }
  }, [password])

  const handleLogoUpload = async (file: File) => {
    try {
      const validationResult = await validateFile(file, {
        maxSizeMB: 5,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      })
      if (!validationResult.valid) {
        toastError(validationResult.error || 'Неверный формат файла')
        return null
      }

      const formData = new FormData()
      formData.append('file', file)

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
      const csrfToken = await getCsrfToken()
      const response = await fetch(`${apiUrl}/images/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include cookies
        headers: {
          ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
        },
      })

      if (!response.ok) {
        throw new Error('Ошибка загрузки логотипа')
      }

      const data = await response.json()
      setLogoPreview(URL.createObjectURL(file))
      return data.id
    } catch (error) {
      toastError('Не удалось загрузить логотип')
      return null
    }
  }

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { data: result } = await withRateLimit(
        'REGISTER',
        () =>
          registerAdmin({
            variables: {
              input: {
                fullName: data.fullName.trim(),
                email: data.email.trim().toLowerCase(),
                password: data.password,
                companyName: data.companyName.trim(),
                companyDescription: data.companyDescription?.trim() || null,
                logoId: data.logoId || null,
              },
            },
          }),
        RATE_LIMITS.REGISTER.maxRequests,
        RATE_LIMITS.REGISTER.windowMs,
      )

      if (result?.registerAdmin) {
        toastSuccess('Регистрация успешна! Проверьте email для подтверждения.')
        navigate('/confirm-email', { state: { email: data.email } })
      }
    } catch (error: any) {
      console.error('Register error:', error)
      const errorMessage = error?.graphQLErrors?.[0]?.message || error?.message || 'Ошибка регистрации'
      toastError(errorMessage)
    }
  }

  return (
    <GreenGradientBackground>
      <div className="min-h-screen flex items-center justify-center p-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <Card className="p-8 border-gray-200 bg-white shadow-xl">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <Recycle className="w-10 h-10 text-green-500" />
              <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Smart Trash
              </span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Регистрация компании</h1>
            <p className="text-gray-600">Создайте аккаунт администратора и зарегистрируйте свою компанию</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Личные данные */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Личные данные</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    ФИО администратора
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="fullName"
                      type="text"
                      {...register('fullName', {
                        required: 'ФИО обязательно',
                        minLength: {
                          value: 2,
                          message: 'Минимум 2 символа',
                        },
                      })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      placeholder="Иванов Иван Иванович"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                  )}
                </div>

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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                          value: 8,
                          message: 'Пароль должен быть не менее 8 символов',
                        },
                        validate: (value) => {
                          const strength = checkPasswordStrength(value)
                          if (!strength.meetsRequirements) {
                            return strength.feedback[0] || 'Пароль не соответствует требованиям'
                          }
                          return true
                        },
                      })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  {passwordStrength && password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-medium ${getPasswordStrengthColor(passwordStrength.label)} px-2 py-1 rounded`}>
                          {passwordStrength.label === 'very-strong' && 'Очень сильный'}
                          {passwordStrength.label === 'strong' && 'Сильный'}
                          {passwordStrength.label === 'good' && 'Хороший'}
                          {passwordStrength.label === 'fair' && 'Средний'}
                          {passwordStrength.label === 'weak' && 'Слабый'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {Math.round(getPasswordStrengthProgress(passwordStrength))}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            passwordStrength.label === 'very-strong' || passwordStrength.label === 'strong'
                              ? 'bg-green-500'
                              : passwordStrength.label === 'good'
                              ? 'bg-blue-500'
                              : passwordStrength.label === 'fair'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${getPasswordStrengthProgress(passwordStrength)}%` }}
                        />
                      </div>
                      {passwordStrength.feedback.length > 0 && (
                        <ul className="mt-2 text-xs text-gray-600 space-y-1">
                          {passwordStrength.feedback.map((msg, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className={passwordStrength.meetsRequirements ? 'text-green-500' : 'text-red-500'}>
                                {passwordStrength.meetsRequirements ? '✓' : '✗'}
                              </span>
                              <span>{msg}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Подтверждение пароля
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="confirmPassword"
                      type="password"
                      {...register('confirmPassword', {
                        required: 'Подтвердите пароль',
                        validate: (value) =>
                          value === password || 'Пароли не совпадают',
                      })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Данные компании */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Данные компании</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Название компании *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="companyName"
                      type="text"
                      {...register('companyName', {
                        required: 'Название компании обязательно',
                        minLength: {
                          value: 2,
                          message: 'Минимум 2 символа',
                        },
                      })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      placeholder="ООО Моя Компания"
                    />
                  </div>
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Описание компании (опционально)
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      id="companyDescription"
                      {...register('companyDescription')}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Краткое описание вашей компании..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Логотип компании (опционально)
                  </label>
                  {logoPreview ? (
                    <div className="relative inline-block">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-32 h-32 object-cover rounded-xl border-2 border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setLogoPreview(null)
                          setValue('logoId', undefined)
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-500 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">Нажмите для загрузки</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const logoId = await handleLogoUpload(file)
                            if (logoId) {
                              setValue('logoId', logoId)
                            }
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={loading}
            >
              Зарегистрироваться
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">
                Войти
              </Link>
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 mt-4 text-sm text-gray-600 hover:text-gray-800"
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


                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Логотип компании (опционально)
                  </label>
                  {logoPreview ? (
                    <div className="relative inline-block">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-32 h-32 object-cover rounded-xl border-2 border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setLogoPreview(null)
                          setValue('logoId', undefined)
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-500 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">Нажмите для загрузки</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const logoId = await handleLogoUpload(file)
                            if (logoId) {
                              setValue('logoId', logoId)
                            }
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={loading}
            >
              Зарегистрироваться
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">
                Войти
              </Link>
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 mt-4 text-sm text-gray-600 hover:text-gray-800"
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


                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Логотип компании (опционально)
                  </label>
                  {logoPreview ? (
                    <div className="relative inline-block">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-32 h-32 object-cover rounded-xl border-2 border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setLogoPreview(null)
                          setValue('logoId', undefined)
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-500 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">Нажмите для загрузки</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const logoId = await handleLogoUpload(file)
                            if (logoId) {
                              setValue('logoId', logoId)
                            }
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={loading}
            >
              Зарегистрироваться
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">
                Войти
              </Link>
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 mt-4 text-sm text-gray-600 hover:text-gray-800"
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

