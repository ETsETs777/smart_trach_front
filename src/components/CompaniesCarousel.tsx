import { useQuery } from '@apollo/client'
import { motion } from 'framer-motion'
import { GET_PUBLIC_COMPANIES } from '@/lib/graphql/queries'
import LoadingSpinner from './ui/LoadingSpinner'
import { Building2, CheckCircle } from 'lucide-react'

interface Company {
  id: string
  name: string
  description: string | null
  isActive: boolean
  createdAt: string
}

export default function CompaniesCarousel() {
  const { data, loading, error } = useQuery(GET_PUBLIC_COMPANIES)

  if (loading) {
    return (
      <div className="py-12">
        <LoadingSpinner fullScreen={false} text="Загрузка компаний..." />
      </div>
    )
  }

  if (error) {
    console.error('Error loading companies:', error)
    // Не показываем карусель при ошибке
    return null
  }

  if (!data?.publicCompanies || data.publicCompanies.length === 0) {
    // Не показываем карусель, если нет компаний
    return null
  }

  const companies: Company[] = data.publicCompanies.filter((c: Company) => c.isActive)

  // Duplicate companies for infinite scroll effect
  const duplicatedCompanies = [...companies, ...companies, ...companies]

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Наши компании-партнёры
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Компании, которые уже используют Smart Trash для улучшения экологии
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          {/* Gradient overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 via-gray-50/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent z-10 pointer-events-none" />

          {/* Scrolling Cards */}
          <div className="flex gap-6 overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{
                x: [0, -((companies.length * 384) + (companies.length * 24))], // card width (384px) + gap (24px)
              }}
              transition={{
                duration: companies.length * 4, // 4 seconds per card for smoother movement
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              {duplicatedCompanies.map((company, index) => (
                <motion.div
                  key={`${company.id}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 w-96 bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start gap-4 mb-4">
                    {/* Placeholder for logo - пока без фото */}
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-gray-900 truncate">
                          {company.name}
                        </h3>
                        {company.isActive && (
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-purple-600 font-medium">
                        Активный партнёр
                      </p>
                    </div>
                  </div>

                  {company.description && (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {company.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-500">Статус</span>
                      <span className="text-sm font-semibold text-green-600">
                        Активна
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                      <span className="text-xs text-gray-500">С нами с</span>
                      <span className="text-sm font-semibold text-gray-700">
                        {new Date(company.createdAt).getFullYear()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-8 px-8 py-4 bg-white rounded-full shadow-md border border-gray-200">
            <div>
              <div className="text-3xl font-bold text-green-600">
                {companies.length}+
              </div>
              <div className="text-sm text-gray-600">Компаний</div>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div>
              <div className="text-3xl font-bold text-emerald-600">
                100%
              </div>
              <div className="text-sm text-gray-600">Активных</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

