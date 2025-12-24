/**
 * Print utilities for reports and data
 */

export function printElement(elementId: string, title?: string) {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error(`Element with id "${elementId}" not found`)
    return
  }

  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    console.error('Failed to open print window')
    return
  }

  const styles = Array.from(document.styleSheets)
    .map(sheet => {
      try {
        return Array.from(sheet.cssRules)
          .map(rule => rule.cssText)
          .join('\n')
      } catch (e) {
        return ''
      }
    })
    .join('\n')

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title || 'Print'}</title>
        <style>
          ${styles}
          @media print {
            body { margin: 0; padding: 20px; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
    </html>
  `)
  
  printWindow.document.close()
  printWindow.focus()
  
  setTimeout(() => {
    printWindow.print()
  }, 250)
}

export function printAnalyticsReport(data: {
  title: string
  stats?: Record<string, number>
  bins?: any[]
  leaderboard?: any[]
}) {
  const printContent = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1 style="text-align: center; margin-bottom: 30px;">${data.title}</h1>
      <p style="text-align: center; color: #666; margin-bottom: 30px;">
        Generated: ${new Date().toLocaleString()}
      </p>
      
      ${data.stats ? `
        <div style="margin-bottom: 30px;">
          <h2>Statistics</h2>
          <table style="width: 100%; border-collapse: collapse;">
            ${Object.entries(data.stats).map(([key, value]) => `
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">${key}</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${value}</td>
              </tr>
            `).join('')}
          </table>
        </div>
      ` : ''}
      
      ${data.bins && data.bins.length > 0 ? `
        <div style="margin-bottom: 30px;">
          <h2>Container Usage</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 8px; border: 1px solid #ddd;">Container Type</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Count</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Percentage</th>
              </tr>
            </thead>
            <tbody>
              ${data.bins.map((bin: any) => `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd;">${bin.binType}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${bin.count}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${bin.percent || 0}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}
      
      ${data.leaderboard && data.leaderboard.length > 0 ? `
        <div>
          <h2>Top Employees</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="padding: 8px; border: 1px solid #ddd;">Rank</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Name</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Sortings</th>
              </tr>
            </thead>
            <tbody>
              ${data.leaderboard.map((entry: any, index: number) => `
                <tr>
                  <td style="padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${entry.employee?.fullName || `User ${index + 1}`}</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${entry.totalClassifiedPhotos || 0}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}
    </div>
  `

  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${data.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px; border: 1px solid #ddd; }
          th { background-color: #f3f4f6; font-weight: bold; }
          @media print {
            body { margin: 0; padding: 20px; }
          }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `)
  
  printWindow.document.close()
  printWindow.focus()
  
  setTimeout(() => {
    printWindow.print()
  }, 250)
}

