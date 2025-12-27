import { Navigate, useLocation } from 'react-router-dom'
import { ReactNode, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_ME } from '@/lib/graphql/queries'
import LoadingSpinner from './ui/LoadingSpinner'
import { tokenStorage } from '@/lib/auth/tokenStorage'
import { useSessionTimeout } from '@/hooks/useSessionTimeout'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'ADMIN_COMPANY' | 'EMPLOYEE'
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const token = tokenStorage.getAccessToken()
  const storedRole = tokenStorage.getRole() as 'ADMIN_COMPANY' | 'EMPLOYEE' | null
  const [resolvedRole, setResolvedRole] = useState<typeof storedRole>(storedRole)

  // Enable session timeout for authenticated users
  useSessionTimeout({
    timeoutMinutes: 30, // 30 minutes
    warningMinutes: 5, // Warn 5 minutes before
    enabled: !!token,
    onTimeout: () => {
      navigate('/login', { state: { from: location } })
    },
  })

  const shouldFetchProfile = !!token && !storedRole
  const { data, loading } = useQuery(GET_ME, {
    skip: !shouldFetchProfile,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (data?.me?.role) {
      tokenStorage.setRole(data.me.role)
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
      return <LoadingSpinner fullScreen text="Загрузка..." />
    }

    if (resolvedRole && resolvedRole !== requiredRole) {
      const fallbackPath = resolvedRole === 'ADMIN_COMPANY' ? '/admin/dashboard' : '/employee/dashboard'
      return <Navigate to={fallbackPath} replace />
    }
  }

  return <>{children}</>
}


      return <LoadingSpinner fullScreen text="Загрузка..." />
    }

    if (resolvedRole && resolvedRole !== requiredRole) {
      const fallbackPath = resolvedRole === 'ADMIN_COMPANY' ? '/admin/dashboard' : '/employee/dashboard'
      return <Navigate to={fallbackPath} replace />
    }
  }

  return <>{children}</>
}


      return <LoadingSpinner fullScreen text="Загрузка..." />
    }

    if (resolvedRole && resolvedRole !== requiredRole) {
      const fallbackPath = resolvedRole === 'ADMIN_COMPANY' ? '/admin/dashboard' : '/employee/dashboard'
      return <Navigate to={fallbackPath} replace />
    }
  }

  return <>{children}</>
}

