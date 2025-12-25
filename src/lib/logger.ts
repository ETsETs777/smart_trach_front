/**
 * Centralized logging utility
 * Replaces console.log/error/warn with a structured logging system
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogEntry {
  level: LogLevel
  message: string
  context?: string
  error?: Error
  metadata?: Record<string, any>
  timestamp: string
}

class Logger {
  private isDevelopment = import.meta.env.DEV
  private isProduction = import.meta.env.PROD

  private formatMessage(entry: LogEntry): string {
    const parts = [
      `[${entry.timestamp}]`,
      `[${entry.level.toUpperCase()}]`,
      entry.context ? `[${entry.context}]` : '',
      entry.message,
    ].filter(Boolean)

    return parts.join(' ')
  }

  private log(level: LogLevel, message: string, context?: string, error?: Error, metadata?: Record<string, any>) {
    const entry: LogEntry = {
      level,
      message,
      context,
      error,
      metadata,
      timestamp: new Date().toISOString(),
    }

    // In development, log to console with colors
    if (this.isDevelopment) {
      const formattedMessage = this.formatMessage(entry)
      
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formattedMessage, metadata || '')
          break
        case LogLevel.INFO:
          console.info(formattedMessage, metadata || '')
          break
        case LogLevel.WARN:
          console.warn(formattedMessage, metadata || '')
          break
        case LogLevel.ERROR:
          console.error(formattedMessage, error || '', metadata || '')
          break
      }
    }

    // In production, send to error tracking service
    if (this.isProduction && level === LogLevel.ERROR) {
      // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
      // Example:
      // if (window.Sentry) {
      //   window.Sentry.captureException(error || new Error(message), {
      //     contexts: { custom: { context, metadata } },
      //   })
      // }
    }

    // Store logs in localStorage for debugging (optional, can be disabled in production)
    if (this.isDevelopment) {
      this.storeLog(entry)
    }
  }

  private storeLog(entry: LogEntry) {
    try {
      const logs = this.getStoredLogs()
      logs.push(entry)
      
      // Keep only last 100 logs
      if (logs.length > 100) {
        logs.shift()
      }
      
      localStorage.setItem('app_logs', JSON.stringify(logs))
    } catch (error) {
      // Ignore localStorage errors
    }
  }

  private getStoredLogs(): LogEntry[] {
    try {
      const stored = localStorage.getItem('app_logs')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  debug(message: string, context?: string, metadata?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, context, undefined, metadata)
  }

  info(message: string, context?: string, metadata?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context, undefined, metadata)
  }

  warn(message: string, context?: string, metadata?: Record<string, any>) {
    this.log(LogLevel.WARN, message, context, undefined, metadata)
  }

  error(message: string, error?: Error, context?: string, metadata?: Record<string, any>) {
    this.log(LogLevel.ERROR, message, context, error, metadata)
  }

  // Helper method for logging GraphQL errors
  graphqlError(operation: string, error: any, context?: string) {
    this.error(
      `GraphQL error in ${operation}`,
      error instanceof Error ? error : new Error(JSON.stringify(error)),
      context,
      {
        operation,
        graphqlErrors: error.graphQLErrors,
        networkError: error.networkError,
      }
    )
  }

  // Helper method for logging API errors
  apiError(endpoint: string, error: any, context?: string) {
    this.error(
      `API error: ${endpoint}`,
      error instanceof Error ? error : new Error(JSON.stringify(error)),
      context,
      {
        endpoint,
        status: error.status,
        statusText: error.statusText,
      }
    )
  }

  // Get stored logs (for debugging)
  getLogs(): LogEntry[] {
    return this.getStoredLogs()
  }

  // Clear stored logs
  clearLogs() {
    try {
      localStorage.removeItem('app_logs')
    } catch {
      // Ignore
    }
  }
}

export const logger = new Logger()

// Export default instance
export default logger

