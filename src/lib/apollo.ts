import { ApolloClient, InMemoryCache, createHttpLink, from, split } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { ApolloLink } from '@apollo/client'
import toast from 'react-hot-toast'
import { handleApolloError, logError } from './errorHandler'
import i18n from '@/i18n/config'
import { performanceMonitor } from './performanceMonitor'
import { tokenStorage } from './auth/tokenStorage'
import { getCsrfToken } from './auth/csrf'

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:5000/graphql',
  credentials: 'include',
})

// WebSocket link for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: (import.meta.env.VITE_GRAPHQL_WS_URL || 'ws://localhost:5000/graphql').replace('http://', 'ws://').replace('https://', 'wss://'),
    connectionParams: () => {
      const token = tokenStorage.getAccessToken()
      return {
        authorization: token ? `Bearer ${token}` : '',
      }
    },
    shouldRetry: () => true,
  })
)

const authLink = setContext(async (_, { headers }) => {
  const token = tokenStorage.getAccessToken()
  const csrfToken = await getCsrfToken()
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
    },
  }
})

// Split link: use WebSocket for subscriptions, HTTP for queries/mutations
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink)
)

// Performance monitoring link
const performanceLink = new ApolloLink((operation, forward) => {
  const startTime = Date.now()
  operation.setContext({ startTime })

  return forward(operation).map((response) => {
    const operationName = operation.operationName || 'unknown'
    performanceMonitor.measureApiCall(operationName, startTime)
    return response
  })
})

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  // Measure API call even on error
  const startTime = operation?.getContext()?.startTime
  if (startTime) {
    const operationName = operation?.operationName || 'unknown'
    performanceMonitor.measureApiCall(operationName, startTime)
  }

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
  link: from([performanceLink, errorLink, splitLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          wastePhoto: {
            merge: true,
          },
          companyAnalytics: {
            // Cache analytics for 5 minutes
            merge: true,
          },
          company: {
            merge: true,
          },
          companies: {
            merge(existing = [], incoming) {
              return incoming
            },
          },
          publicCompanies: {
            merge(existing = [], incoming) {
              return incoming
            },
          },
          collectionAreas: {
            merge(existing = [], incoming) {
              return incoming
            },
          },
          collectionAreaBins: {
            merge(existing = [], incoming) {
              return incoming
            },
          },
        },
      },
      WastePhoto: {
        fields: {
          image: {
            merge: true,
          },
        },
      },
      Company: {
        fields: {
          employees: {
            merge(existing = [], incoming) {
              return incoming
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'cache-first', // Use cache first for better performance
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
})

