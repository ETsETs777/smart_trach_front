import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Card from './ui/Card'
import Button from './ui/Button'
import { performanceMonitor, PerformanceReport } from '@/lib/performanceMonitor'
import { Activity, Download, Trash2, RefreshCw, TrendingUp, Clock, HardDrive } from 'lucide-react'

export default function PerformanceMonitor() {
  const [report, setReport] = useState<PerformanceReport | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const updateReport = () => {
      setReport(performanceMonitor.getReport())
    }

    updateReport()
    const interval = setInterval(updateReport, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const handleClear = () => {
    performanceMonitor.clearMetrics()
    setReport(performanceMonitor.getReport())
  }

  const handleExport = () => {
    const data = performanceMonitor.exportMetrics()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `performance-report-${new Date().toISOString()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!report) return null

  const formatBytes = (bytes?: number) => {
    if (!bytes) return 'N/A'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const formatTime = (ms?: number) => {
    if (!ms) return 'N/A'
    if (ms < 1000) return `${Math.round(ms)} ms`
    return `${(ms / 1000).toFixed(2)} s`
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-800">Performance Monitor</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExport}
            title="Export performance report"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            title="Clear metrics"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-600">Avg Response</span>
          </div>
          <div className="text-lg font-semibold text-gray-800">
            {formatTime(report.summary.averageResponseTime)}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <HardDrive className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-600">Memory</span>
          </div>
          <div className="text-lg font-semibold text-gray-800">
            {formatBytes(report.summary.memoryUsage)}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-600">Page Load</span>
          </div>
          <div className="text-lg font-semibold text-gray-800">
            {formatTime(report.summary.pageLoadTime)}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-600">Total Metrics</span>
          </div>
          <div className="text-lg font-semibold text-gray-800">
            {report.summary.totalMetrics}
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4"
        >
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent Metrics</h4>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {report.metrics.slice(-20).reverse().map((metric, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{metric.name}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(metric.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-800">
                    {metric.value.toFixed(2)} {metric.unit}
                  </div>
                  {metric.metadata && Object.keys(metric.metadata).length > 0 && (
                    <div className="text-xs text-gray-500">
                      {Object.entries(metric.metadata)
                        .slice(0, 2)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </Card>
  )
}

