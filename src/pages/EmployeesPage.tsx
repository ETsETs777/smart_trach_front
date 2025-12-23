import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { GET_COMPANY_EMPLOYEES } from '@/lib/graphql/queries'
import {
  CREATE_EMPLOYEE,
  CONFIRM_EMPLOYEE,
  UPDATE_EMPLOYEE,
  REMOVE_EMPLOYEE_FROM_COMPANY,
} from '@/lib/graphql/mutations'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import SkeletonLoader from '@/components/ui/SkeletonLoader'
import { Plus, UserCheck, UserX, Edit, Trash2, ArrowLeft, X, Mail, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useWasteStore } from '@/store/useWasteStore'

interface EmployeeFormData {
  firstName: string
  lastName: string
  email: string
  isRegistered?: boolean
}

export default function EmployeesPage() {
  const navigate = useNavigate()
  const { companyId } = useWasteStore()
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const { data, loading, refetch } = useQuery(GET_COMPANY_EMPLOYEES, {
    variables: { companyId: companyId || 'default-company-id' },
    skip: !companyId,
  })

  const [createEmployee] = useMutation(CREATE_EMPLOYEE, {
    onCompleted: () => {
      toast.success('Сотрудник создан! Приглашение отправлено на email.')
      setIsCreating(false)
      refetch()
    },
    onError: (error) => {
      toast.error(error.message || 'Ошибка создания сотрудника')
    },
  })

  const [confirmEmployee] = useMutation(CONFIRM_EMPLOYEE, {
    onCompleted: () => {
      toast.success('Сотрудник подтверждён!')
      refetch()
    },
    onError: (error) => {
      toast.error(error.message || 'Ошибка подтверждения')
    },
  })

  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE, {
    onCompleted: () => {
      toast.success('Данные сотрудника обновлены!')
      setEditingId(null)
      refetch()
    },
    onError: (error) => {
      toast.error(error.message || 'Ошибка обновления')
    },
  })

  const [removeEmployee] = useMutation(REMOVE_EMPLOYEE_FROM_COMPANY, {
    onCompleted: () => {
      toast.success('Сотрудник удалён из компании!')
      refetch()
    },
    onError: (error) => {
      toast.error(error.message || 'Ошибка удаления')
    },
  })

  const { register, handleSubmit, formState: { errors } } = useForm<EmployeeFormData>()

  const onSubmit = async (data: EmployeeFormData) => {
    if (!companyId) {
      toast.error('Компания не выбрана')
      return
    }

    try {
      if (editingId) {
        await updateEmployee({
          variables: {
            input: {
              employeeId: editingId,
              companyId,
              fullName: `${data.firstName} ${data.lastName}`,
            },
          },
        })
      } else {
        await createEmployee({
          variables: {
            input: {
              companyId,
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email.trim().toLowerCase(),
              isRegistered: data.isRegistered || false,
            },
          },
        })
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleConfirm = async (userId: string, isConfirmed: boolean) => {
    if (!companyId) return

    try {
      await confirmEmployee({
        variables: {
          input: {
            employeeId: userId,
            companyId,
            isConfirmed: !isConfirmed,
          },
        },
      })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого сотрудника из компании?')) {
      return
    }

    if (!companyId) return

    try {
      await removeEmployee({
        variables: {
          input: {
            userId,
            companyId,
          },
        },
      })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const employees = data?.companyEmployees || []

  return (
    <div className="min-h-screen p-8 landscape:px-16 bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button
              onClick={() => navigate('/admin/dashboard')}
              variant="ghost"
              size="lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Назад
            </Button>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-4">
              Сотрудники
            </h1>
            <p className="text-gray-600 mt-2">Управление сотрудниками компании</p>
          </div>
          <Button
            onClick={() => setIsCreating(true)}
            variant="primary"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Добавить сотрудника
          </Button>
        </div>

        {/* Create/Edit Form */}
        <AnimatePresence>
          {(isCreating || editingId) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <Card className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingId ? 'Редактировать сотрудника' : 'Добавить нового сотрудника'}
                  </h2>
                  <button
                    onClick={() => {
                      setIsCreating(false)
                      setEditingId(null)
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Имя *
                      </label>
                      <input
                        {...register('firstName', { required: 'Имя обязательно' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        placeholder="Иван"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Фамилия *
                      </label>
                      <input
                        {...register('lastName', { required: 'Фамилия обязательна' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        placeholder="Иванов"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        {...register('email', {
                          required: 'Email обязателен',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Некорректный email',
                          },
                        })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        placeholder="ivan@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                    >
                      {editingId ? 'Сохранить' : 'Создать и отправить приглашение'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setIsCreating(false)
                        setEditingId(null)
                      }}
                    >
                      Отмена
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Employees List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <SkeletonLoader key={i} variant="card" className="bg-white" />
            ))}
          </div>
        ) : employees.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Нет сотрудников</h2>
            <p className="text-gray-600 mb-6">
              Добавьте первого сотрудника в вашу компанию
            </p>
            <Button onClick={() => setIsCreating(true)} variant="primary" size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Добавить сотрудника
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {employees.map((employee: any) => (
              <motion.div
                key={employee.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                      {employee.fullName?.[0] || employee.email[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-800">
                          {employee.fullName || `${employee.firstName} ${employee.lastName}`}
                        </h3>
                        {!employee.isEmailConfirmed && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            Email не подтверждён
                          </span>
                        )}
                        {!employee.isEmployeeConfirmed && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Ожидает подтверждения
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4" />
                        {employee.email}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Роль: {employee.role === 'EMPLOYEE' ? 'Сотрудник' : 'Администратор'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!employee.isEmployeeConfirmed && (
                      <Button
                        onClick={() => handleConfirm(employee.id, employee.isEmployeeConfirmed)}
                        variant="outline"
                        size="sm"
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Подтвердить
                      </Button>
                    )}
                    {employee.isEmployeeConfirmed && (
                      <Button
                        onClick={() => handleConfirm(employee.id, employee.isEmployeeConfirmed)}
                        variant="ghost"
                        size="sm"
                      >
                        <UserX className="w-4 h-4 mr-2" />
                        Отменить
                      </Button>
                    )}
                    <button
                      onClick={() => setEditingId(employee.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(employee.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

