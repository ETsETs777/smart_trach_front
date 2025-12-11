import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Recycle, Camera, List, QrCode, Trophy, BarChart3, Users, Sparkles, ArrowRight, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function LandingPage() {
  const features = [
    {
      icon: Camera,
      title: 'Определение по фото',
      description: 'Сфотографируйте отход, и AI определит его тип автоматически',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: List,
      title: 'Ручной выбор',
      description: 'Выберите тип отхода из списка, если фото недоступно',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: QrCode,
      title: 'Сканирование кода',
      description: 'Отсканируйте штрихкод на упаковке для быстрого определения',
      color: 'from-purple-500 to-pink-500',
    },
  ]

  const benefits = [
    'Снижает количество ошибок при сортировке',
    'Делает процесс быстрым и понятным',
    'Мотивирует сотрудников регулярно использовать раздельный сбор',
    'Даёт аналитику по использованию контейнеров',
  ]

  const steps = [
    {
      number: '1',
      title: 'Подойдите к урне',
      description: 'С предметом, который нужно выбросить',
    },
    {
      number: '2',
      title: 'Определите тип отхода',
      description: 'Сфотографируйте, выберите вручную или отсканируйте код',
    },
    {
      number: '3',
      title: 'Получите рекомендацию',
      description: 'Система покажет нужный контейнер и инструкции',
    },
    {
      number: '4',
      title: 'Выбросьте правильно',
      description: 'Следуйте инструкциям и получите очки за сортировку',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="glass fixed top-0 left-0 right-0 z-50 border-b border-white/20">
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
              <Link to="/login">
                <Button variant="ghost" size="md">
                  Войти
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="md">
                  Регистрация компании
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
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
              <h1 className="text-7xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-500 bg-clip-text text-transparent">
                Smart Trash
              </h1>
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-16 h-16 text-yellow-400" />
              </motion.div>
            </div>
            <h2 className="text-4xl font-semibold text-gray-800 mb-6">
              Интерактивный помощник по раздельному сбору отходов
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Установите над урной планшет, который поможет определить тип отхода, 
              подскажет нужный контейнер и даст инструкции по подготовке. 
              С геймификацией и аналитикой для вашей компании.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/register">
                <Button variant="primary" size="xl">
                  Начать бесплатно
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="outline" size="xl">
                  Попробовать демо
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold text-gray-800 mb-4">Проблема</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              В офисах есть эко-активность, но сотрудники часто не знают:
            </p>
          </motion.div>
          <div className="grid grid-cols-3 gap-8">
            {[
              'Можно ли отправить на переработку?',
              'Соответствует ли тип пластика?',
              'Что нужно для переработки?',
            ].map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-8 text-center"
              >
                <div className="text-4xl mb-4">❓</div>
                <p className="text-lg text-gray-700">{problem}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-800 mb-4">Решение</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Установите над урной планшет с Smart Trash
            </p>
          </motion.div>
          <div className="grid grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-2xl p-8 text-center"
                >
                  <motion.div
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-6 shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-800 mb-4">Как это работает</h2>
          </motion.div>
          <div className="grid grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-800 mb-4">Преимущества</h2>
          </motion.div>
          <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 glass rounded-xl p-6"
              >
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <p className="text-lg text-gray-700">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-bold mb-4">Результаты</h2>
            <p className="text-xl opacity-90">
              Статистика использования Smart Trash
            </p>
          </motion.div>
          <div className="grid grid-cols-4 gap-8">
            {[
              { icon: Trophy, value: '95%', label: 'Точность классификации' },
              { icon: Users, value: '1000+', label: 'Активных пользователей' },
              { icon: Recycle, value: '50K+', label: 'Сортировок отходов' },
              { icon: BarChart3, value: '80%', label: 'Снижение ошибок' },
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <Icon className="w-12 h-12 mx-auto mb-4 opacity-90" />
                  <div className="text-5xl font-bold mb-2">{stat.value}</div>
                  <div className="text-lg opacity-90">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass rounded-3xl p-12"
          >
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              Готовы начать?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Зарегистрируйте свою компанию и начните использовать Smart Trash уже сегодня
            </p>
            <Link to="/register">
              <Button variant="primary" size="xl">
                Зарегистрировать компанию
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Recycle className="w-8 h-8 text-green-500" />
                <span className="text-xl font-bold">Smart Trash</span>
              </div>
              <p className="text-gray-400 text-sm">
                Система умных урн для офисов и бизнес‑центров. Помогаем сотрудникам сортировать отходы
                правильно и без лишних вопросов.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-4">
                Для кого
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Офисы и коворкинги</li>
                <li>Бизнес‑центры и ТЦ</li>
                <li>IT‑компании и стартапы</li>
                <li>Производственные площадки</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-4">
                Как это работает
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Планшет над урной с нашим веб‑приложением</li>
                <li>Определение отхода по фото или вручную</li>
                <li>Подсветка нужного контейнера и инструкции</li>
                <li>Накопление статистики и ачивок сотрудников</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400 mb-4">
                Контакты
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Email: eco@smart-trash.ru</li>
                <li>По вопросам пилота и внедрения:</li>
                <li className="text-gray-200">Заполните форму на странице «Контакты»</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-gray-500">
            <div>© 2024 Smart Trash</div>
            <div className="flex gap-6">
              <Link to="/about" className="hover:text-gray-300 transition-colors">
                О компании
              </Link>
              <Link to="/how-it-works" className="hover:text-gray-300 transition-colors">
                Как работает
              </Link>
              <Link to="/for-companies" className="hover:text-gray-300 transition-colors">
                Для компаний
              </Link>
              <Link to="/contacts" className="hover:text-gray-300 transition-colors">
                Контакты
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

