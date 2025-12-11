import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { UPDATE_SELF } from '@/lib/graphql/mutations'
import { GET_ME } from '@/lib/graphql/queries'
import { ArrowLeft, User, Lock, Upload, X } from 'lucide-react'

interface ProfileFormData {
  fullName?: string
  password?: string
  logoId?: string | null
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const { data: meData, loading: meLoading } = useQuery(GET_ME)
  const [updateSelf, { loading }] = useMutation(UPDATE_SELF, {
    onCompleted: () => {
      toast.success('Профиль обновлён')
    },
    onError: (error) => toast.error(error.message || 'Ошибка обновления профиля'),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>()

  const me = meData?.me
  const companyName =
    me?.createdCompanies?.[0]?.name || me?.employeeCompanies?.[0]?.name || 'Компания не выбрана'

  useEffect(() => {
    if (me?.logo?.url) {
      setLogoPreview(me.logo.url)
    }
  }, [me])

  const handleLogoUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
      const response = await fetch(`${apiUrl}/images/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Ошибка загрузки аватара')
      }

      const data = await response.json()
      setLogoPreview(URL.createObjectURL(file))
      setLogoFile(file)
      return data.id
    } catch (error) {
      toast.error('Не удалось загрузить аватар')
      return null
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    try {
      let logoId: string | null | undefined = data.logoId ?? null
      if (logoFile) {
        const uploadedLogoId = await handleLogoUpload(logoFile)
        if (uploadedLogoId) logoId = uploadedLogoId
      }

      await updateSelf({
        variables: {
          input: {
            fullName: data.fullName?.trim() || null,
            password: data.password?.trim() || null,
            logoId: logoId ?? null,
          },
        },
      })
    } catch (error) {
      console.error(error)
    }
  }

  if (meLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 landscape:px-16 bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-3xl mx-auto">
        <Button onClick={() => navigate(-1)} variant="ghost" size="lg" className="mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Назад
        </Button>

        <Card className="p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Мой профиль</h1>
          <p className="text-gray-600 mb-1">
            {me?.email} · {me?.role}
          </p>
          <p className="text-sm text-gray-500 mb-6">{companyName}</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ФИО
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  {...register('fullName')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  defaultValue={me?.fullName || ''}
                  placeholder="Иванов Иван Иванович"
                />
              </div>
              {errors.fullName && (
                <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Новый пароль (опционально)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  {...register('password', {
                    minLength: { value: 6, message: 'Минимум 6 символов' },
                  })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Аватар (опционально)
              </label>
              {logoPreview ? (
                <div className="relative inline-block">
                  <img
                    src={logoPreview}
                    alt="Avatar preview"
                    className="w-24 h-24 object-cover rounded-xl border-2 border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setLogoPreview(null)
                      setLogoFile(null)
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-500 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-3 pb-4">
                    <Upload className="w-6 h-6 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">Загрузить аватар</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setLogoFile(file)
                        setLogoPreview(URL.createObjectURL(file))
                      }
                    }}
                  />
                </label>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" variant="primary" size="lg" isLoading={loading}>
                Сохранить
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={() => navigate(-1)}>
                Отмена
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

