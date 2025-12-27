import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react'
import Button from './ui/Button'
import Card from './ui/Card'
import logger from '@/lib/logger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  retryCount: number
}

export default class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Send to error tracking service if available
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, { 
        contexts: { react: errorInfo },
        tags: { component: 'ErrorBoundary' }
      })
    }

    // Log to our logger service
    try {
      logger.error('ErrorBoundary caught error', error, 'ErrorBoundary', {
        componentStack: errorInfo.componentStack,
        retryCount: this.state.retryCount,
      })
    } catch (e) {
      // Logger might not be available, ignore
      console.error('Failed to log error:', e)
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    this.setState((prevState) => ({
      error,
      errorInfo,
      retryCount: prevState.retryCount,
    }))
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
    }
  }

  handleReset = () => {
    // Clear any pending retry
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
      this.retryTimeoutId = null
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    })
  }

  handleRetry = () => {
    const { retryCount } = this.state
    
    // Limit retries to prevent infinite loops
    if (retryCount >= 3) {
      logger.warn('Max retry count reached', new Error('Max retries'), 'ErrorBoundary')
      return
    }

    // Wait a bit before retrying
    this.retryTimeoutId = setTimeout(() => {
      this.setState((prevState) => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
      }))
    }, 1000)
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  handleReportError = () => {
    const { error, errorInfo } = this.state
    if (!error) return

    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    }

    // Create mailto link with error details
    const subject = encodeURIComponent('Error Report - Smart Trash')
    const body = encodeURIComponent(JSON.stringify(errorReport, null, 2))
    window.location.href = `mailto:support@smarttrash.ru?subject=${subject}&body=${body}`
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
          <Card className="max-w-2xl w-full p-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-red-100 rounded-full p-4">
                  <AlertTriangle className="w-12 h-12 text-red-600" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Что-то пошло не так
              </h1>
              
              <p className="text-gray-600 mb-6">
                Произошла непредвиденная ошибка. Мы уже работаем над её исправлением.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
                  <p className="text-sm font-mono text-red-600 mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="text-xs text-gray-600">
                      <summary className="cursor-pointer mb-2">Stack trace</summary>
                      <pre className="overflow-auto max-h-48">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={this.handleRetry}
                  variant="primary"
                  size="lg"
                  disabled={this.state.retryCount >= 3}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {this.state.retryCount >= 3 ? 'Превышен лимит попыток' : 'Попробовать снова'}
                </Button>
                
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  size="lg"
                >
                  <Home className="w-4 h-4 mr-2" />
                  На главную
                </Button>

                <Button
                  onClick={this.handleReportError}
                  variant="ghost"
                  size="lg"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Сообщить об ошибке
                </Button>
              </div>

              {this.state.retryCount > 0 && (
                <p className="text-xs text-gray-500 text-center mt-4">
                  Попыток восстановления: {this.state.retryCount}/3
                </p>
              )}
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}


    }

    // Create mailto link with error details
    const subject = encodeURIComponent('Error Report - Smart Trash')
    const body = encodeURIComponent(JSON.stringify(errorReport, null, 2))
    window.location.href = `mailto:support@smarttrash.ru?subject=${subject}&body=${body}`
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
          <Card className="max-w-2xl w-full p-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-red-100 rounded-full p-4">
                  <AlertTriangle className="w-12 h-12 text-red-600" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Что-то пошло не так
              </h1>
              
              <p className="text-gray-600 mb-6">
                Произошла непредвиденная ошибка. Мы уже работаем над её исправлением.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
                  <p className="text-sm font-mono text-red-600 mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="text-xs text-gray-600">
                      <summary className="cursor-pointer mb-2">Stack trace</summary>
                      <pre className="overflow-auto max-h-48">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={this.handleRetry}
                  variant="primary"
                  size="lg"
                  disabled={this.state.retryCount >= 3}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {this.state.retryCount >= 3 ? 'Превышен лимит попыток' : 'Попробовать снова'}
                </Button>
                
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  size="lg"
                >
                  <Home className="w-4 h-4 mr-2" />
                  На главную
                </Button>

                <Button
                  onClick={this.handleReportError}
                  variant="ghost"
                  size="lg"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Сообщить об ошибке
                </Button>
              </div>

              {this.state.retryCount > 0 && (
                <p className="text-xs text-gray-500 text-center mt-4">
                  Попыток восстановления: {this.state.retryCount}/3
                </p>
              )}
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}


    }

    // Create mailto link with error details
    const subject = encodeURIComponent('Error Report - Smart Trash')
    const body = encodeURIComponent(JSON.stringify(errorReport, null, 2))
    window.location.href = `mailto:support@smarttrash.ru?subject=${subject}&body=${body}`
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
          <Card className="max-w-2xl w-full p-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-red-100 rounded-full p-4">
                  <AlertTriangle className="w-12 h-12 text-red-600" />
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Что-то пошло не так
              </h1>
              
              <p className="text-gray-600 mb-6">
                Произошла непредвиденная ошибка. Мы уже работаем над её исправлением.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
                  <p className="text-sm font-mono text-red-600 mb-2">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="text-xs text-gray-600">
                      <summary className="cursor-pointer mb-2">Stack trace</summary>
                      <pre className="overflow-auto max-h-48">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={this.handleRetry}
                  variant="primary"
                  size="lg"
                  disabled={this.state.retryCount >= 3}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {this.state.retryCount >= 3 ? 'Превышен лимит попыток' : 'Попробовать снова'}
                </Button>
                
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  size="lg"
                >
                  <Home className="w-4 h-4 mr-2" />
                  На главную
                </Button>

                <Button
                  onClick={this.handleReportError}
                  variant="ghost"
                  size="lg"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Сообщить об ошибке
                </Button>
              </div>

              {this.state.retryCount > 0 && (
                <p className="text-xs text-gray-500 text-center mt-4">
                  Попыток восстановления: {this.state.retryCount}/3
                </p>
              )}
            </div>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

