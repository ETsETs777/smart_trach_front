/**
 * Performance Monitoring Utility
 * Tracks and logs performance metrics for the application
 */

import logger from './logger'

export interface PerformanceMetric {
  name: string
  value: number
  unit: 'ms' | 'bytes' | 'count'
  timestamp: number
  metadata?: Record<string, any>
}

export interface PerformanceReport {
  metrics: PerformanceMetric[]
  summary: {
    totalMetrics: number
    averageResponseTime?: number
    memoryUsage?: number
    pageLoadTime?: number
  }
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private maxMetrics = 1000 // Keep last 1000 metrics
  private enabled = true

  constructor() {
    // Enable performance monitoring in production or when explicitly enabled
    this.enabled = import.meta.env.PROD || localStorage.getItem('perf_monitoring') === 'true'
    
    if (this.enabled) {
      this.initializeMonitoring()
    }
  }

  private initializeMonitoring() {
    // Monitor page load performance
    if (typeof window !== 'undefined' && window.performance) {
      window.addEventListener('load', () => {
        this.measurePageLoad()
      })

      // Monitor memory usage (if available)
      if ('memory' in performance) {
        this.startMemoryMonitoring()
      }

      // Monitor long tasks
      if ('PerformanceObserver' in window) {
        this.observeLongTasks()
      }
    }
  }

  /**
   * Measure page load time
   */
  private measurePageLoad() {
    if (!window.performance || !window.performance.timing) return

    const timing = window.performance.timing
    const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

    if (navigation) {
      const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart
      const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart
      const firstPaint = this.getFirstPaint()
      const firstContentfulPaint = this.getFirstContentfulPaint()

      this.recordMetric({
        name: 'page_load_time',
        value: pageLoadTime,
        unit: 'ms',
        metadata: {
          domContentLoaded,
          firstPaint,
          firstContentfulPaint,
        },
      })

      logger.info('Page load performance', {
        pageLoadTime,
        domContentLoaded,
        firstPaint,
        firstContentfulPaint,
      })
    }
  }

  /**
   * Get First Paint time
   */
  private getFirstPaint(): number | undefined {
    const paintEntries = window.performance.getEntriesByType('paint')
    const firstPaint = paintEntries.find((entry) => entry.name === 'first-paint')
    return firstPaint ? Math.round(firstPaint.startTime) : undefined
  }

  /**
   * Get First Contentful Paint time
   */
  private getFirstContentfulPaint(): number | undefined {
    const paintEntries = window.performance.getEntriesByType('paint')
    const fcp = paintEntries.find((entry) => entry.name === 'first-contentful-paint')
    return fcp ? Math.round(fcp.startTime) : undefined
  }

  /**
   * Start monitoring memory usage
   */
  private startMemoryMonitoring() {
    setInterval(() => {
      const memory = (performance as any).memory
      if (memory) {
        const used = memory.usedJSHeapSize
        const total = memory.totalJSHeapSize
        const limit = memory.jsHeapSizeLimit

        this.recordMetric({
          name: 'memory_usage',
          value: used,
          unit: 'bytes',
          metadata: {
            total,
            limit,
            percentage: (used / limit) * 100,
          },
        })

        // Warn if memory usage is high
        if (used / limit > 0.8) {
          logger.warn('High memory usage detected', {
            used,
            total,
            limit,
            percentage: (used / limit) * 100,
          })
        }
      }
    }, 30000) // Check every 30 seconds
  }

  /**
   * Observe long tasks (tasks that take more than 50ms)
   */
  private observeLongTasks() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            this.recordMetric({
              name: 'long_task',
              value: entry.duration,
              unit: 'ms',
              metadata: {
                startTime: entry.startTime,
                name: entry.name,
              },
            })

            logger.warn('Long task detected', {
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name,
            })
          }
        }
      })

      observer.observe({ entryTypes: ['longtask'] })
    } catch (e) {
      // Long task observer not supported
      logger.debug('Long task observer not supported', e)
    }
  }

  /**
   * Record a performance metric
   */
  recordMetric(metric: Omit<PerformanceMetric, 'timestamp'>) {
    if (!this.enabled) return

    const fullMetric: PerformanceMetric = {
      ...metric,
      timestamp: Date.now(),
    }

    this.metrics.push(fullMetric)

    // Keep only last maxMetrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift()
    }

    // Log important metrics
    if (metric.name.includes('api_response') || metric.name.includes('page_load')) {
      logger.debug('Performance metric recorded', fullMetric)
    }
  }

  /**
   * Measure API response time
   */
  measureApiCall(operationName: string, startTime: number, endTime?: number) {
    const duration = endTime ? endTime - startTime : Date.now() - startTime

    this.recordMetric({
      name: 'api_response_time',
      value: duration,
      unit: 'ms',
      metadata: {
        operation: operationName,
      },
    })

    // Warn if API call is slow
    if (duration > 2000) {
      logger.warn('Slow API call detected', {
        operation: operationName,
        duration,
      })
    }

    return duration
  }

  /**
   * Measure component render time
   */
  measureRender(componentName: string, startTime: number, endTime?: number) {
    const duration = endTime ? endTime - startTime : Date.now() - startTime

    this.recordMetric({
      name: 'component_render_time',
      value: duration,
      unit: 'ms',
      metadata: {
        component: componentName,
      },
    })

    // Warn if render is slow
    if (duration > 100) {
      logger.warn('Slow component render detected', {
        component: componentName,
        duration,
      })
    }

    return duration
  }

  /**
   * Get performance report
   */
  getReport(): PerformanceReport {
    const apiMetrics = this.metrics.filter((m) => m.name === 'api_response_time')
    const memoryMetrics = this.metrics.filter((m) => m.name === 'memory_usage')
    const pageLoadMetrics = this.metrics.filter((m) => m.name === 'page_load_time')

    const averageResponseTime =
      apiMetrics.length > 0
        ? apiMetrics.reduce((sum, m) => sum + m.value, 0) / apiMetrics.length
        : undefined

    const latestMemory = memoryMetrics.length > 0 ? memoryMetrics[memoryMetrics.length - 1] : undefined
    const latestPageLoad = pageLoadMetrics.length > 0 ? pageLoadMetrics[pageLoadMetrics.length - 1] : undefined

    return {
      metrics: this.metrics.slice(-100), // Last 100 metrics
      summary: {
        totalMetrics: this.metrics.length,
        averageResponseTime,
        memoryUsage: latestMemory?.value,
        pageLoadTime: latestPageLoad?.value,
      },
    }
  }

  /**
   * Clear all metrics
   */
  clearMetrics() {
    this.metrics = []
    logger.info('Performance metrics cleared')
  }

  /**
   * Enable/disable monitoring
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled
    if (enabled) {
      this.initializeMonitoring()
    }
  }

  /**
   * Export metrics as JSON
   */
  exportMetrics(): string {
    return JSON.stringify(this.getReport(), null, 2)
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor()

// React hook for measuring component performance
export function usePerformanceMeasure(componentName: string) {
  const startTime = Date.now()

  return {
    endMeasure: () => {
      performanceMonitor.measureRender(componentName, startTime)
    },
  }
}

