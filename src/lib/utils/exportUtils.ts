import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * Export data to Excel (XLSX) format
 */
export function exportToExcel(data: any[], filename: string = 'export.xlsx', sheetName: string = 'Sheet1') {
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  XLSX.writeFile(workbook, filename)
}

/**
 * Export data to CSV format
 */
export function exportToCSV(data: any[], filename: string = 'export.csv') {
  if (data.length === 0) return

  const headers = Object.keys(data[0])
  const rows = data.map(row => headers.map(header => row[header] || ''))
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * Export HTML element to PDF
 */
export async function exportToPDF(
  element: HTMLElement,
  filename: string = 'export.pdf',
  options: {
    width?: number
    height?: number
    format?: [number, number]
    orientation?: 'portrait' | 'landscape'
  } = {}
) {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  })

  const imgData = canvas.toDataURL('image/png')
  const { width, height } = options.format 
    ? { width: options.format[0], height: options.format[1] }
    : { width: canvas.width, height: canvas.height }

  const pdf = new jsPDF({
    orientation: options.orientation || (width > height ? 'landscape' : 'portrait'),
    unit: 'px',
    format: options.format || [width, height],
  })

  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()
  const imgWidth = canvas.width
  const imgHeight = canvas.height
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
  const imgX = (pdfWidth - imgWidth * ratio) / 2
  const imgY = 0

  pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
  pdf.save(filename)
}

/**
 * Export analytics data to PDF with charts
 */
export async function exportAnalyticsToPDF(
  title: string,
  data: {
    bins?: any[]
    leaderboard?: any[]
    stats?: Record<string, number>
  },
  filename: string = 'analytics-report.pdf'
) {
  const pdf = new jsPDF('landscape', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 10
  let yPos = margin

  // Title
  pdf.setFontSize(20)
  pdf.text(title, pageWidth / 2, yPos, { align: 'center' })
  yPos += 10

  // Date
  pdf.setFontSize(12)
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos, { align: 'center' })
  yPos += 15

  // Stats
  if (data.stats) {
    pdf.setFontSize(16)
    pdf.text('Statistics', margin, yPos)
    yPos += 8

    pdf.setFontSize(12)
    Object.entries(data.stats).forEach(([key, value]) => {
      pdf.text(`${key}: ${value}`, margin + 5, yPos)
      yPos += 7
    })
    yPos += 5
  }

  // Bins data
  if (data.bins && data.bins.length > 0) {
    pdf.setFontSize(16)
    pdf.text('Container Usage', margin, yPos)
    yPos += 8

    pdf.setFontSize(10)
    data.bins.forEach((bin: any) => {
      if (yPos > pageHeight - 20) {
        pdf.addPage()
        yPos = margin
      }
      pdf.text(`${bin.binType}: ${bin.count} (${bin.percent || 0}%)`, margin + 5, yPos)
      yPos += 7
    })
    yPos += 5
  }

  // Leaderboard
  if (data.leaderboard && data.leaderboard.length > 0) {
    if (yPos > pageHeight - 30) {
      pdf.addPage()
      yPos = margin
    }

    pdf.setFontSize(16)
    pdf.text('Top Employees', margin, yPos)
    yPos += 8

    pdf.setFontSize(10)
    data.leaderboard.slice(0, 10).forEach((entry: any, index: number) => {
      if (yPos > pageHeight - 20) {
        pdf.addPage()
        yPos = margin
      }
      const name = entry.employee?.fullName || `User ${index + 1}`
      const count = entry.totalClassifiedPhotos || 0
      pdf.text(`${index + 1}. ${name}: ${count} sortings`, margin + 5, yPos)
      yPos += 7
    })
  }

  pdf.save(filename)
}

