import { motion } from 'framer-motion'
import { ArrowLeft, HelpCircle, MessageCircle, Mail, Phone } from 'lucide-react'
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
      answer: t('admin.help.faq.addEmployee.a')
    },
    {
      question: t('admin.help.faq.createArea.q'),
      answer: t('admin.help.faq.createArea.a')
    },
    {
      question: t('admin.help.faq.viewStats.q'),
      answer: t('admin.help.faq.viewStats.a')
    },
    {
      question: t('admin.help.faq.changeSettings.q'),
      answer: t('admin.help.faq.changeSettings.a')
    },
    {
      question: t('admin.help.faq.noInvite.q'),
      answer: t('admin.help.faq.noInvite.a')
    }
  ]

  return (
    <GreenGradientBackground>
      <div className="min-h-screen p-8 landscape:px-16 text-white">
        <div className="max-w-4xl mx-auto">
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

          <div className="space-y-6 mb-8">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-white/95 backdrop-blur-md border-2 border-white/30">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.question}</h3>
                  <p className="text-gray-700">{item.answer}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="p-6 bg-white/95 backdrop-blur-md border-2 border-white/30">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-green-600" />
              {t('admin.help.contactSupport')}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">{t('admin.help.supportEmail')}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">{t('admin.help.supportPhone')}</span>
              </div>
              <p className="text-gray-600 text-sm mt-4">
                {t('admin.help.supportHours')}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </GreenGradientBackground>
  )
}

