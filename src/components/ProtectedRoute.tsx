import { Navigate, useLocation } from 'react-router-dom'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_ME } from '@/lib/graphql/queries'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'ADMIN_COMPANY' | 'EMPLOYEE'
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const location = useLocation()
  const token = localStorage.getItem('auth_token')
  const storedRole = localStorage.getItem('auth_role') as 'ADMIN_COMPANY' | 'EMPLOYEE' | null
  const [resolvedRole, setResolvedRole] = useState<typeof storedRole>(storedRole)

  const shouldFetchProfile = !!token && !storedRole
  const { data, loading } = useQuery(GET_ME, {
    skip: !shouldFetchProfile,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (data?.me?.role) {
      localStorage.setItem('auth_role', data.me.role)
      setResolvedRole(data.me.role)
    }
  }, [data?.me?.role])

  if (!token) {
    // Сохраняем путь для редиректа после входа
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole) {
    // Если роли нет, но идёт загрузка профиля — показываем лоадер
    if (!resolvedRole && loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent" />
        </div>
      )
    }

    if (resolvedRole && resolvedRole !== requiredRole) {
      const fallbackPath = resolvedRole === 'ADMIN_COMPANY' ? '/admin/dashboard' : '/employee/dashboard'
      return <Navigate to={fallbackPath} replace />
    }
  }

  return <>{children}</>
}

