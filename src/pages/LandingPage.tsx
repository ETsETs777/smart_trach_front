import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Recycle, Camera, List, QrCode, Trophy, BarChart3, Users, Sparkles, ArrowRight, CheckCircle, Mail, AlertTriangle, XCircle, TrendingDown, HelpCircle, ArrowDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '@/components/ui/Button'
import CompaniesCarousel from '@/components/CompaniesCarousel'
import CompaniesCarouselBackground from '@/components/CompaniesCarouselBackground'
import ThemeToggle from '@/components/ThemeToggle'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function LandingPage() {
  const { t } = useTranslation()
  const features = [
    {
      icon: Camera,
      title: t('landing.features.photoDetection'),
      description: t('landing.features.photoDetectionDesc'),
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: List,
      title: t('landing.features.manualSelection'),
      description: t('landing.features.manualSelectionDesc'),
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: QrCode,
      title: t('landing.features.codeScanning'),
      description: t('landing.features.codeScanningDesc'),
      color: 'from-purple-500 to-pink-500',
    },
  ]

  const benefits = [
    t('landing.benefitsList.reducesErrors'),
    t('landing.benefitsList.fastProcess'),
    t('landing.benefitsList.motivates'),
    t('landing.benefitsList.analytics'),
  ]

  const steps = [
    {
      number: '1',
      title: t('landing.steps.step1'),
      description: t('landing.steps.step1Desc'),
    },
    {
      number: '2',
      title: t('landing.steps.step2'),
      description: t('landing.steps.step2Desc'),
    },
    {
      number: '3',
      title: t('landing.steps.step3'),
      description: t('landing.steps.step3Desc'),
    },
    {
      number: '4',
      title: t('landing.steps.step4'),
      description: t('landing.steps.step4Desc'),
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header>
        <nav className="glass fixed top-0 left-0 right-0 z-50 border-b border-white/20" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Recycle className="w-8 h-8 text-green-500" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Smart Trash
              </span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <LanguageSwitcher />
              <Link to="/login">
                <Button variant="ghost" size="md">
                  {t('landing.login')}
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="md">
                  {t('landing.registerCompany')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      </header>

      <main id="main-content">
        {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-white min-h-[600px]">
        {/* Companies Carousel Background */}
        <CompaniesCarouselBackground className="opacity-40" />
        
        {/* Subtle natural gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/70 via-blue-50/50 to-white/95 z-10"></div>
        <div className="absolute inset-0 opacity-25 z-10">
          <motion.div
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.15),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.15),transparent_50%)] bg-[length:200%_200%]"
          ></motion.div>
        </div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto text-center z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Recycle className="w-20 h-20 text-green-500" />
              </motion.div>
              <h1 className="text-6xl md:text-7xl font-bold text-green-600">
                Smart Trash
              </h1>
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-16 h-16 text-yellow-400" />
              </motion.div>
            </div>
            <h2 className="text-4xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
              Интерактивный помощник по раздельному сбору отходов
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
              Установите над урной планшет, который поможет определить тип отхода, 
              подскажет нужный контейнер и даст инструкции по подготовке. 
              С геймификацией и аналитикой для вашей компании.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/register">
                <Button variant="primary" size="xl">
                  {t('landing.startFree')}
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="outline" size="xl">
                  {t('landing.tryDemo')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

      {/* Problem Section */}
      <section className="relative py-24 px-6 overflow-hidden bg-white dark:bg-gray-900">
        {/* Subtle natural gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-blue-50/20 to-white"></div>
        <div className="absolute inset-0 opacity-40">
          <motion.div
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(34,197,94,0.08),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.08),transparent_50%)] bg-[length:200%_200%]"
          ></motion.div>
        </div>

        <div className="relative max-w-7xl mx-auto z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold mb-6"
            >
              {t('landing.challenge')}
            </motion.span>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-gray-100 mb-6">
              {t('landing.problem')}
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              {t('landing.problemDesc')}
            </p>
          </motion.div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto"
          >
            {[
              { icon: TrendingDown, value: '60%', label: 'Ошибок при сортировке', color: 'bg-blue-500' },
              { icon: XCircle, value: '40%', label: 'Отходов попадает на полигон', color: 'bg-green-500' },
              { icon: AlertTriangle, value: '80%', label: 'Сотрудников не уверены в выборе', color: 'bg-blue-600' },
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-md text-center"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.color} mb-4`}>
                    <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                  <div className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Problems Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              'Можно ли отправить на переработку?',
              'Соответствует ли тип пластика?',
              'Что нужно для переработки?',
            ].map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6, ease: 'easeOut' }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="relative group"
              >
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="text-center space-y-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500"
                    >
                      <HelpCircle className="w-8 h-8 text-white" strokeWidth={2} />
                    </motion.div>
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 leading-relaxed">
                      {problem}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.7 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-10 border border-gray-200 dark:border-gray-700 shadow-md">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-blue-500 flex items-center justify-center">
                    <AlertTriangle className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                    {t('landing.consequences')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700 dark:text-gray-300">
                    <div className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
                      <span className="text-sm md:text-base">Ценные ресурсы попадают на полигоны вместо переработки</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
                      <span className="text-sm md:text-base">Загрязнение контейнеров снижает качество вторсырья</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
                      <span className="text-sm md:text-base">Снижение мотивации сотрудников к экопрограммам</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
                      <span className="text-sm md:text-base">Потеря доверия к корпоративным экологическим инициативам</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

      {/* Solution Section */}
      <section className="relative py-24 px-6 overflow-hidden bg-white dark:bg-gray-900">
        {/* Subtle natural gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/40 via-blue-50/30 to-white"></div>
        <div className="absolute inset-0 opacity-30">
          <motion.div
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)] bg-[length:200%_200%]"
          ></motion.div>
        </div>

        <div className="relative max-w-7xl mx-auto z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-20"
          >
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block mb-6"
            >
              <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mx-auto"></div>
            </motion.span>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-gray-100 mb-6">
              {t('landing.solution')}
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Установите над урной планшет с Smart Trash
            </p>
          </motion.div>

          {/* Features Grid with Numbers and Arrows */}
          <div className="relative">
            {/* Background process illustrations */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-green-500 blur-3xl"></div>
              <div className="absolute top-1/2 right-1/4 w-40 h-40 rounded-full bg-blue-500 blur-3xl"></div>
              <div className="absolute bottom-1/4 left-1/2 w-36 h-36 rounded-full bg-emerald-500 blur-3xl"></div>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {features.map((feature, index) => {
                const Icon = feature.icon
                const stepNumber = index + 1
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2, duration: 0.6, ease: 'easeOut' }}
                    whileHover={{ y: -12, scale: 1.03 }}
                    className="relative group"
                  >
                    {/* Step number circle */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.2 + 0.1, type: 'spring', stiffness: 200 }}
                        className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white text-xl font-bold shadow-lg border-4 border-white"
                      >
                        {stepNumber}
                      </motion.div>
                    </div>

                    {/* Arrow connector (horizontal for desktop) */}
                    {index < features.length - 1 && (
                      <div className="hidden md:block absolute top-6 -right-5 z-10">
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.2 + 0.3 }}
                        >
                          <ArrowRight className="w-8 h-8 text-green-500" />
                        </motion.div>
                      </div>
                    )}

                    {/* Arrow connector (vertical for mobile) */}
                    {index < features.length - 1 && (
                      <div className="md:hidden absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.2 + 0.3 }}
                        >
                          <ArrowDown className="w-8 h-8 text-green-500" />
                        </motion.div>
                      </div>
                    )}

                    {/* Card */}
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 pt-12 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 h-full">
                      {/* Background illustration */}
                      <div className="absolute inset-0 opacity-5 rounded-2xl overflow-hidden pointer-events-none">
                        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full ${feature.color === 'bg-blue-500' ? 'bg-blue-500' : feature.color === 'bg-green-500' ? 'bg-green-500' : 'bg-blue-600'} blur-2xl`}></div>
                      </div>

                      <div className="relative text-center space-y-5">
                        {/* Icon */}
                        <motion.div
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.2 + 0.3, type: 'spring', stiffness: 200 }}
                          whileHover={{ scale: 1.1 }}
                          className="inline-flex items-center justify-center"
                        >
                          <div className={`w-16 h-16 rounded-xl ${feature.color} flex items-center justify-center`}>
                            <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                          </div>
                        </motion.div>

                        {/* Title */}
                        <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                          {feature.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24 px-6 overflow-hidden bg-white dark:bg-gray-900">
        {/* Decorative divider */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent z-20"></div>
        
        {/* Subtle natural gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-green-50/20 to-white"></div>
        <div className="absolute inset-0 opacity-30">
          <motion.div
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(34,197,94,0.08),transparent_50%)] bg-[length:200%_200%]"
          ></motion.div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-20"
          >
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block mb-6"
            >
              <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mx-auto"></div>
            </motion.span>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-gray-100 mb-6">
              {t('landing.howItWorks')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Простой процесс из 4 шагов для эффективной сортировки отходов
            </p>
          </motion.div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 opacity-30"></div>

            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6, ease: 'easeOut' }}
                whileHover={{ y: -10, scale: 1.03 }}
                className="relative group"
              >
                {/* Card */}
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 h-full">
                  <div className="text-center space-y-4">
                    {/* Step number */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      className="inline-flex items-center justify-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white text-2xl font-bold">
                        {step.number}
                      </div>
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Arrow connector (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-24 -right-4 z-10">
                    <ArrowRight className="w-8 h-8 text-green-400 opacity-50" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom divider */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mt-20"></div>
      </section>

      {/* Divider */}
      <div className="relative h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

      {/* Benefits */}
      <section className="relative py-24 px-6 overflow-hidden bg-white dark:bg-gray-900">
        {/* Subtle natural gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-blue-50/20 to-white"></div>
        <div className="absolute inset-0 opacity-30">
          <motion.div
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(34,197,94,0.08),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.08),transparent_50%)] bg-[length:200%_200%]"
          ></motion.div>
        </div>

        <div className="relative max-w-7xl mx-auto z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold mb-6"
            >
              {t('landing.whySmartTrash')}
            </motion.span>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-gray-100 mb-6">
              {t('landing.benefits')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('landing.benefitsDesc')}
            </p>
          </motion.div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6, ease: 'easeOut' }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                {/* Card */}
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center"
                    >
                      <CheckCircle className="w-6 h-6 text-white" strokeWidth={2} />
                    </motion.div>

                    {/* Text */}
                    <div className="flex-1 pt-1">
                      <p className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-100 leading-relaxed">
                        {benefit}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

      {/* Stats Section */}
      <section className="relative py-24 px-6 overflow-hidden text-white">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 via-teal-600 to-cyan-600 animate-gradient"></div>
        <div className="absolute inset-0 opacity-40">
          <motion.div
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_50%)] bg-[length:200%_200%]"
          ></motion.div>
        </div>
        <div className="absolute inset-0 opacity-30" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20z'/%3E%3C/g%3E%3C/svg%3E")`}}></div>

        <div className="relative max-w-7xl mx-auto z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block mb-6"
            >
              <div className="w-20 h-1 bg-white/50 mx-auto mb-4"></div>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Результаты
            </h2>
            <p className="text-xl md:text-2xl text-white/90 font-light">
              Статистика использования Smart Trash
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: Trophy, value: '95%', label: 'Точность классификации', color: 'bg-blue-500' },
              { icon: Users, value: '1000+', label: 'Активных пользователей', color: 'bg-green-500' },
              { icon: Recycle, value: '50K+', label: 'Сортировок отходов', color: 'bg-blue-600' },
              { icon: BarChart3, value: '80%', label: 'Снижение ошибок', color: 'bg-green-600' },
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.6, ease: 'easeOut' }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="relative group"
                >
                  {/* Card */}
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg hover:bg-white/15 transition-all duration-300">
                    <div className="text-center space-y-4">
                      {/* Icon */}
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                        className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/20 mb-3"
                      >
                        <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                      </motion.div>

                      {/* Value */}
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15 + 0.3, type: 'spring', stiffness: 200 }}
                        className="text-5xl md:text-6xl font-bold text-white mb-2"
                      >
                        {stat.value}
                      </motion.div>

                      {/* Label */}
                      <div className="text-sm md:text-base text-white/90 leading-relaxed">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

      {/* Companies Carousel Section */}
      <CompaniesCarousel />

      {/* Divider */}
      <div className="relative h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

      {/* CTA Section */}
      <section className="relative py-24 px-6 overflow-hidden bg-white dark:bg-gray-900">
        {/* Subtle natural gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/40 via-blue-50/30 to-white"></div>
        <div className="absolute inset-0 opacity-30">
          <motion.div
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)] bg-[length:200%_200%]"
          ></motion.div>
        </div>

        <div className="relative max-w-5xl mx-auto z-10">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative"
          >
            {/* Main card */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-10 md:p-12 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-center space-y-6">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-green-500 mb-4"
                >
                  <Sparkles className="w-8 h-8 text-white" strokeWidth={2} />
                </motion.div>

                {/* Heading */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100"
                >
                  {t('landing.readyToStart')}
                </motion.h2>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
                >
                  {t('landing.registerCompanyDesc')}
                </motion.p>

                {/* Benefits list */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 mb-8"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>{t('landing.cta.quickStart')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>{t('landing.cta.freePilot')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>{t('landing.cta.support247')}</span>
                  </div>
                </motion.div>

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                  <Link to="/register" className="w-full sm:w-auto">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        variant="primary" 
                        size="xl"
                        className="w-full sm:w-auto px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                      >
                        {t('landing.registerCompany')}
                        <ArrowRight className="w-6 h-6 ml-2 inline" />
                      </Button>
                    </motion.div>
                  </Link>
                  <Link to="/demo" className="w-full sm:w-auto">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        variant="outline" 
                        size="xl"
                        className="w-full sm:w-auto px-8 py-6 text-lg font-semibold border-2 hover:bg-gray-50 transition-all duration-300"
                      >
                        {t('landing.tryDemo')}
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-20 px-6 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 text-white overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <Recycle className="w-10 h-10 text-green-400" />
                </motion.div>
                <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Smart Trash
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Система умных урн для офисов и бизнес‑центров. Помогаем сотрудникам сортировать отходы
                правильно и без лишних вопросов.
              </p>
            </div>

            {/* Для кого */}
            <div>
              <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full"></div>
                Для кого
              </h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2 group">
                  <span className="text-green-400 mt-1 group-hover:scale-110 transition-transform">•</span>
                  <span className="group-hover:text-white transition-colors">Офисы и коворкинги</span>
                </li>
                <li className="flex items-start gap-2 group">
                  <span className="text-green-400 mt-1 group-hover:scale-110 transition-transform">•</span>
                  <span className="group-hover:text-white transition-colors">Бизнес‑центры и ТЦ</span>
                </li>
                <li className="flex items-start gap-2 group">
                  <span className="text-green-400 mt-1 group-hover:scale-110 transition-transform">•</span>
                  <span className="group-hover:text-white transition-colors">IT‑компании и стартапы</span>
                </li>
                <li className="flex items-start gap-2 group">
                  <span className="text-green-400 mt-1 group-hover:scale-110 transition-transform">•</span>
                  <span className="group-hover:text-white transition-colors">Производственные площадки</span>
                </li>
              </ul>
            </div>

            {/* Как это работает */}
            <div>
              <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full"></div>
                Как это работает
              </h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2 group">
                  <span className="text-green-400 mt-1 group-hover:scale-110 transition-transform">•</span>
                  <span className="group-hover:text-white transition-colors">Планшет над урной с нашим веб‑приложением</span>
                </li>
                <li className="flex items-start gap-2 group">
                  <span className="text-green-400 mt-1 group-hover:scale-110 transition-transform">•</span>
                  <span className="group-hover:text-white transition-colors">Определение отхода по фото или вручную</span>
                </li>
                <li className="flex items-start gap-2 group">
                  <span className="text-green-400 mt-1 group-hover:scale-110 transition-transform">•</span>
                  <span className="group-hover:text-white transition-colors">Подсветка нужного контейнера и инструкции</span>
                </li>
                <li className="flex items-start gap-2 group">
                  <span className="text-green-400 mt-1 group-hover:scale-110 transition-transform">•</span>
                  <span className="group-hover:text-white transition-colors">Накопление статистики и ачивок сотрудников</span>
                </li>
              </ul>
            </div>

            {/* Контакты */}
            <div>
              <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full"></div>
                Контакты
              </h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-2 group">
                  <Mail className="w-4 h-4 text-green-400 group-hover:scale-110 transition-transform" />
                  <a href="mailto:eco@smart-trash.ru" className="group-hover:text-green-400 transition-colors">
                    eco@smart-trash.ru
                  </a>
                </li>
                <li className="text-gray-400 mt-4">По вопросам пилота и внедрения:</li>
                <li>
                  <Link to="/contacts" className="text-green-400 hover:text-green-300 transition-colors underline underline-offset-2">
                    Заполните форму на странице «Контакты»
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-gray-800/50 pt-8">
            <div className="text-gray-400 text-sm">
              © 2025 Smart Trash. Все права защищены.
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <Link 
                to="/about" 
                className="text-gray-400 hover:text-green-400 transition-colors duration-200 relative group"
              >
                О компании
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-200"></span>
              </Link>
              <Link 
                to="/how-it-works" 
                className="text-gray-400 hover:text-green-400 transition-colors duration-200 relative group"
              >
                Как работает
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-200"></span>
              </Link>
              <Link 
                to="/for-companies" 
                className="text-gray-400 hover:text-green-400 transition-colors duration-200 relative group"
              >
                Для компаний
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-200"></span>
              </Link>
              <Link 
                to="/contacts" 
                className="text-gray-400 hover:text-green-400 transition-colors duration-200 relative group"
              >
                Контакты
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-200"></span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
      </main>
    </div>
  )
}

