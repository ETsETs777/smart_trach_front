import { GraphQLError } from 'graphql'
import { ApolloError } from '@apollo/client'

export interface ErrorInfo {
  message: string
  code?: string
  field?: string
  retryable?: boolean
}

/**
 * Maps GraphQL error codes to user-friendly messages
 */
const errorMessages: Record<string, string> = {
  UNAUTHENTICATED: 'errors.unauthenticated',
  FORBIDDEN: 'errors.forbidden',
  NOT_FOUND: 'errors.notFound',
  VALIDATION_ERROR: 'errors.validationError',
  INTERNAL_ERROR: 'errors.internalError',
  NETWORK_ERROR: 'errors.networkError',
  TIMEOUT: 'errors.timeout',
}

/**
 * Extracts user-friendly error message from GraphQL error
 */
export function extractErrorMessage(error: GraphQLError | Error): ErrorInfo {
  // GraphQL error
  if ('extensions' in error) {
    const graphQLError = error as GraphQLError
    const code = graphQLError.extensions?.code as string
    const field = graphQLError.extensions?.field as string
    
    // Return the GraphQL message (translation will be handled by components)
    const message = graphQLError.message

    return {
      message,
      code,
      field,
      retryable: code === 'NETWORK_ERROR' || code === 'TIMEOUT',
    }
  }

  // Regular Error
  return {
    message: error.message || 'An unknown error occurred',
    retryable: false,
  }
}

/**
 * Handles Apollo errors and returns user-friendly information
 */
export function handleApolloError(error: ApolloError): ErrorInfo {
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    return extractErrorMessage(error.graphQLErrors[0])
  }

  if (error.networkError) {
    const networkError = error.networkError as any
    
    if (networkError.statusCode === 401) {
      return {
        message: 'errors.unauthenticated',
        code: 'UNAUTHENTICATED',
        retryable: false,
      }
    }

    if (networkError.statusCode === 403) {
      return {
        message: 'errors.forbidden',
        code: 'FORBIDDEN',
        retryable: false,
      }
    }

    if (networkError.statusCode >= 500) {
      return {
        message: 'errors.serverError',
        code: 'SERVER_ERROR',
        retryable: true,
      }
    }

    return {
      message: 'errors.networkError',
      code: 'NETWORK_ERROR',
      retryable: true,
    }
  }

  return {
    message: 'errors.unknown',
    retryable: false,
  }
}

/**
 * Logs error for debugging (can be extended to send to error tracking service)
 */
export function logError(error: Error | ApolloError, context?: string) {
  const errorInfo = error instanceof ApolloError 
    ? handleApolloError(error)
    : extractErrorMessage(error)

  // Use logger instead of console.error
  import('./logger').then(({ logger }) => {
    logger.error(
      errorInfo.message,
      error instanceof Error ? error : new Error(JSON.stringify(error)),
      context,
      {
        code: errorInfo.code,
        field: errorInfo.field,
        originalError: error,
      }
    )
  })
  
  // Keep console.error for immediate debugging in development
  if (import.meta.env.DEV) {
    console.error(`[Error${context ? ` in ${context}` : ''}]:`, {
      message: errorInfo.message,
      code: errorInfo.code,
      field: errorInfo.field,
      originalError: error,
    })
  }

  // TODO: Send to error tracking service (Sentry, etc.)
  // if (import.meta.env.PROD) {
  //   Sentry.captureException(error, { extra: { context, errorInfo } })
  // }
}

