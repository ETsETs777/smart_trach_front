import { motion } from 'framer-motion'
import { ArrowLeft, HelpCircle, MessageCircle, Mail, Phone, Clock, Video, FileText, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import GreenGradientBackground from '@/components/ui/GreenGradientBackground'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function HelpPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const faqItems = [
    {
      question: t('admin.help.faq.addEmployee.q'),
      answer: t('admin.help.faq.addEmployee.a'),
      category: 'Employees'
    },
    {
      question: t('admin.help.faq.createArea.q'),
      answer: t('admin.help.faq.createArea.a'),
      category: 'Areas'
    },
    {
      question: t('admin.help.faq.viewStats.q'),
      answer: t('admin.help.faq.viewStats.a'),
      category: 'Analytics'
    },
    {
      question: t('admin.help.faq.changeSettings.q'),
      answer: t('admin.help.faq.changeSettings.a'),
      category: 'Settings'
    },
    {
      question: t('admin.help.faq.noInvite.q'),
      answer: t('admin.help.faq.noInvite.a'),
      category: 'Troubleshooting'
    },
    {
      question: 'How do I reset an employee password?',
      answer: 'Go to Employees page, find the employee, click on their profile, and use the "Reset Password" option. An email with reset instructions will be sent to the employee.',
      category: 'Employees'
    },
    {
      question: 'Can I export analytics data?',
      answer: 'Yes! In the Analytics page, you can export data in multiple formats including CSV, Excel, and PDF. Use the export button in the top right corner of the analytics dashboard.',
      category: 'Analytics'
    },
    {
      question: 'How do I create custom achievements?',
      answer: 'Navigate to Achievements page, click "Create Achievement", fill in the details including name, description, criteria, and point rewards. You can set up various criteria like number of classifications, specific waste types, etc.',
      category: 'Achievements'
    },
    {
      question: 'What file formats are supported for company logo?',
      answer: 'We support PNG, JPG, JPEG, and SVG formats. Recommended size is 512x512 pixels for best quality. Maximum file size is 5MB.',
      category: 'Settings'
    },
    {
      question: 'How do I generate QR codes for collection areas?',
      answer: 'Go to Collection Areas page, select an area, and click "Generate QR Code". You can download the QR code in PNG, SVG, or PDF format for printing.',
      category: 'Areas'
    }
  ]

  const quickLinks = [
    { label: 'Documentation', path: '/admin/docs', icon: FileText },
    { label: 'Getting Started Guide', path: '/admin/guide', icon: Video },
    { label: 'API Documentation', path: '/admin/api-docs', icon: ExternalLink },
    { label: 'System Updates', path: '/admin/changelog', icon: FileText }
  ]

  return (
    <GreenGradientBackground>
      <div className="min-h-screen p-8 landscape:px-16 text-white">
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/dashboard')}
            className="mb-6 bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('common.back')}
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-4 flex items-center gap-4">
              <HelpCircle className="w-12 h-12" />
              {t('admin.help.title')}
            </h1>
            <p className="text-white/95 text-lg">{t('admin.help.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {quickLinks.map((link, index) => {
              const Icon = link.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    onClick={() => navigate(link.path)}
                    variant="ghost"
                    className="w-full bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 backdrop-blur-md h-auto p-4 flex items-center gap-3"
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Button>
                </motion.div>
              )
            })}
          </div>

          <Card className="p-6 bg-white/95 backdrop-blur-md border-2 border-white/30 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-l-4 border-green-500 pl-4 py-2"
                >
                  <div className="flex items-start gap-2 mb-1">
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{item.question}</h3>
                  <p className="text-gray-700">{item.answer}</p>
                </motion.div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 bg-white/95 backdrop-blur-md border-2 border-white/30">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-green-600" />
                {t('admin.help.contactSupport')}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-gray-800 font-medium">{t('admin.help.supportEmail')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-gray-800 font-medium">{t('admin.help.supportPhone')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Support Hours</p>
                    <p className="text-gray-800 font-medium">{t('admin.help.supportHours')}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/95 backdrop-blur-md border-2 border-white/30">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Additional Resources</h2>
              <div className="space-y-3">
                <p className="text-gray-700 mb-4">
                  Need more help? Check out these additional resources:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>Video tutorials and guides</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>Community forum and discussions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>Knowledge base articles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>System status and updates</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </GreenGradientBackground>
  )
}
