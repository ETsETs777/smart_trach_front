import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import toast from 'react-hot-toast'
import { handleApolloError, logError } from './errorHandler'
import i18n from '@/i18n/config'

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:5000/graphql',
  credentials: 'include',
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('auth_token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach((error) => {
      logError(error, operation?.operationName)
      const errorInfo = handleApolloError({ graphQLErrors: [error] } as any)
      
      // Don't show toast for authentication errors (will be handled by ProtectedRoute)
      if (errorInfo.code !== 'UNAUTHENTICATED') {
        // Try to translate error message, fallback to original
        const translatedMessage = i18n.exists(errorInfo.message) 
          ? i18n.t(errorInfo.message)
          : errorInfo.message
        toast.error(translatedMessage)
      }
    })
  }

  if (networkError) {
    logError(networkError as Error, operation?.operationName)
    const errorInfo = handleApolloError({ networkError } as any)
    
    // Translate error message
    const translatedMessage = i18n.exists(errorInfo.message) 
      ? i18n.t(errorInfo.message)
      : errorInfo.message
    toast.error(translatedMessage)
  }
})

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          wastePhoto: {
            merge: true,
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
})

