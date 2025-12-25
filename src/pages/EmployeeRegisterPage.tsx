import { useMutation } from '@apollo/client'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { REGISTER_EMPLOYEE } from '@/lib/graphql/mutations'
import { useWasteStore } from '@/store/useWasteStore'
import { ArrowLeft, Mail, Lock, User } from 'lucide-react'
import GreenGradientBackground from '@/components/ui/GreenGradientBackground'

interface EmployeeRegisterForm {
  fullName: string
  email: string
  password: string
}

export default function EmployeeRegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { companyId } = useWasteStore()
  const inviteCompanyId = searchParams.get('companyId') || companyId

  const [registerEmployee, { loading }] = useMutation(REGISTER_EMPLOYEE, {
    onCompleted: () => {
      toast.success('Сотрудник зарегистрирован, проверьте почту для подтверждения')
      navigate('/login')
    },
    onError: (error) => toast.error(error.message || 'Ошибка регистрации'),
  })

  const { register, handleSubmit, formState: { errors } } = useForm<EmployeeRegisterForm>()

  const onSubmit = async (data: EmployeeRegisterForm) => {
    if (!inviteCompanyId) {
      toast.error('Company ID not specified')
      return
    }
    await registerEmployee({
      variables: {
        input: {
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          companyId: inviteCompanyId,
        },
      },
    })
  }

  return (
    <GreenGradientBackground>
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-lg p-8 border-gray-200 bg-white shadow-xl">
          <Button onClick={() => navigate('/')} variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t('common.back')}
          </Button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Employee Registration</h1>
          <p className="text-sm text-gray-600 mb-6">Join the company and start sorting waste</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-3 pl-9 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                placeholder={t('common.name')}
                {...register('fullName', { required: t('common.required') })}
              />
              {errors.fullName && <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>}
            </div>

            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-3 pl-9 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                placeholder="Email"
                type="email"
                {...register('email', { required: t('common.required') })}
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
            </div>

            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-3 pl-9 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                placeholder={t('common.password')}
                type="password"
                {...register('password', { required: t('common.required'), minLength: { value: 6, message: 'Minimum 6 characters' } })}
              />
              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>
              {t('common.register')}
            </Button>
          </form>
        </Card>
      </div>
    </GreenGradientBackground>
  )
}


