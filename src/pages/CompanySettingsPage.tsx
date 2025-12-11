import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { GET_COMPANY } from '@/lib/graphql/queries'
import { UPDATE_COMPANY } from '@/lib/graphql/mutations'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { ArrowLeft, Building, Upload, X, QrCode, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useWasteStore } from '@/store/useWasteStore'

interface CompanyFormData {
  name: string
  description?: string
  logoId?: string
}

export default function CompanySettingsPage() {
  const navigate = useNavigate()
  const { companyId } = useWasteStore()
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)

  const { data, loading, refetch } = useQuery(GET_COMPANY, {
    variables: { id: companyId || 'default-company-id' },
    skip: !companyId,
  })

  const [updateCompany, { loading: updating }] = useMutation(UPDATE_COMPANY, {
    onCompleted: () => {
      toast.success('Настройки компании обновлены!')
      refetch()
    },
    onError: (error) => {
      toast.error(error.message || 'Ошибка обновления')
    },
  })

  const company = data?.company

  const { register, handleSubmit, formState: { errors } } = useForm<CompanyFormData>({
    defaultValues: {
      name: company?.name || '',
      description: company?.description || '',
    },
  })

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
        throw new Error('Ошибка загрузки логотипа')
      }

      const data = await response.json()
      setLogoPreview(URL.createObjectURL(file))
      setLogoFile(file)
      return data.id
    } catch (error) {
      toast.error('Не удалось загрузить логотип')
      return null
    }
  }

  const onSubmit = async (data: CompanyFormData) => {
    if (!companyId) {
      toast.error('Компания не выбрана')
      return
    }

    try {
      let logoId: string | undefined = company?.logo?.id

      // Загружаем новый логотип если есть
      if (logoFile) {
        const uploadedLogoId = await handleLogoUpload(logoFile)
        if (uploadedLogoId) {
          logoId = uploadedLogoId
        }
      }

      await updateCompany({
        variables: {
          input: {
            id: companyId,
            name: data.name,
            description: data.description || null,
            logoId: logoId || null,
          },
        },
      })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 landscape:px-16 bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button
            onClick={() => navigate('/admin/dashboard')}
            variant="ghost"
            size="lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Назад
          </Button>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-4">
            Настройки компании
          </h1>
          <p className="text-gray-600 mt-2">Управление информацией о компании</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Building className="w-6 h-6" />
              Основная информация
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название компании *
                </label>
                <input
                  {...register('name', { required: 'Название обязательно' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  placeholder="ООО Моя Компания"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Описание компании
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                  placeholder="Краткое описание вашей компании..."
                />
              </div>
            </div>
          </Card>

          <Card className="p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Upload className="w-6 h-6" />
              Логотип компании
            </h2>

            <div className="space-y-4">
              {(logoPreview || company?.logo?.url) && (
                <div className="relative inline-block">
                  <img
                    src={logoPreview || company?.logo?.url}
                    alt="Company logo"
                    className="w-32 h-32 object-cover rounded-xl border-2 border-gray-300"
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
              )}

              {!logoPreview && !company?.logo?.url && (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-500 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">Нажмите для загрузки логотипа</p>
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
          </Card>

          {company?.qrCode && (
            <Card className="p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <QrCode className="w-6 h-6" />
                QR-код компании
              </h2>
              <div className="flex items-center justify-center p-6 bg-white rounded-xl">
                <div className="text-center">
                  <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                    <QrCode className="w-24 h-24 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">QR-код: {company.qrCode}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Используйте этот код для быстрого доступа к вашей компании
                  </p>
                </div>
              </div>
            </Card>
          )}

          <div className="flex gap-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={updating}
            >
              <Save className="w-5 h-5 mr-2" />
              Сохранить изменения
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate('/admin/dashboard')}
            >
              Отмена
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

