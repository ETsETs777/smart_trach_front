import { useState, useRef, useEffect } from 'react'
import QRCode from 'qrcode'
import { QrCode, Download, Printer, FileImage, FileText, File } from 'lucide-react'
import Button from './ui/Button'
import Card from './ui/Card'
import { useTranslation } from 'react-i18next'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

interface QRCodeGeneratorProps {
  data: string
  title?: string
  size?: number
  onDownload?: (format: 'png' | 'svg' | 'pdf') => void
}

export default function QRCodeGenerator({ data, title, size = 256, onDownload }: QRCodeGeneratorProps) {
  const { t } = useTranslation()
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    generateQRCode()
  }, [data, size])

  const generateQRCode = async () => {
    try {
      setLoading(true)
      const url = await QRCode.toDataURL(data, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
      setQrDataUrl(url)

      // Also generate SVG
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, data, {
          width: size,
          margin: 2,
        })
      }
    } catch (error) {
      console.error('Error generating QR code:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadPNG = async () => {
    if (!qrDataUrl) return

    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = `${title || 'qrcode'}-${Date.now()}.png`
    link.click()
    onDownload?.('png')
  }

  const downloadSVG = async () => {
    try {
      const svg = await QRCode.toString(data, { type: 'svg', width: size, margin: 2 })
      const blob = new Blob([svg], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${title || 'qrcode'}-${Date.now()}.svg`
      link.click()
      URL.revokeObjectURL(url)
      onDownload?.('svg')
    } catch (error) {
      console.error('Error downloading SVG:', error)
    }
  }

  const downloadPDF = async () => {
    if (!containerRef.current) return

    try {
      const canvas = await html2canvas(containerRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('portrait', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight) * 0.9
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = (pdfHeight - imgHeight * ratio) / 2

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      pdf.save(`${title || 'qrcode'}-${Date.now()}.pdf`)
      onDownload?.('pdf')
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }

  const printQR = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              font-family: Arial, sans-serif;
            }
            h2 { margin-bottom: 20px; }
            img { max-width: 400px; }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <h2>${title || 'QR Code'}</h2>
          <img src="${qrDataUrl}" alt="QR Code" />
          <p style="margin-top: 20px; font-size: 12px;">Scan this QR code to access: ${data}</p>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6" ref={containerRef}>
      {title && (
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{title}</h3>
      )}
      <div className="flex flex-col items-center gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <img src={qrDataUrl} alt="QR Code" className="w-full h-auto" />
          <canvas ref={canvasRef} className="hidden" />
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            onClick={downloadPNG}
            variant="outline"
            size="sm"
            className="border-green-500 text-green-600 hover:bg-green-50"
          >
            <FileImage className="w-4 h-4 mr-2" />
            PNG
          </Button>
          <Button
            onClick={downloadSVG}
            variant="outline"
            size="sm"
            className="border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            <FileText className="w-4 h-4 mr-2" />
            SVG
          </Button>
          <Button
            onClick={downloadPDF}
            variant="outline"
            size="sm"
            className="border-red-500 text-red-600 hover:bg-red-50"
          >
            <File className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button
            onClick={printQR}
            variant="outline"
            size="sm"
            className="border-purple-500 text-purple-600 hover:bg-purple-50"
          >
            <Printer className="w-4 h-4 mr-2" />
            {t('common.print')}
          </Button>
        </div>
        <p className="text-xs text-gray-500 text-center max-w-xs">
          {t('qrcode.scanHint', { data })}
        </p>
      </div>
    </Card>
  )
}


