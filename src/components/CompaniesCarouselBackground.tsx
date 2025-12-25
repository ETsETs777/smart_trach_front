import { useQuery } from '@apollo/client'
import { motion } from 'framer-motion'
import { GET_PUBLIC_COMPANIES } from '@/lib/graphql/queries'
import { Building2 } from 'lucide-react'

interface Company {
  id: string
  name: string
  description: string | null
  isActive: boolean
  createdAt: string
}

interface CompaniesCarouselBackgroundProps {
  className?: string
}

export default function CompaniesCarouselBackground({ className = '' }: CompaniesCarouselBackgroundProps) {
  const { data, loading, error } = useQuery(GET_PUBLIC_COMPANIES)

  if (loading || error || !data?.publicCompanies || data.publicCompanies.length === 0) {
    return null
  }

  const companies: Company[] = data.publicCompanies.filter((c: Company) => c.isActive)

  if (companies.length === 0) {
    return null
  }

  // Duplicate companies for infinite scroll effect
  const duplicatedCompanies = [...companies, ...companies, ...companies]

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Gradient overlays for smooth fade effect - более мягкие градиенты */}
      <div className="absolute left-0 top-0 bottom-0 w-96 bg-gradient-to-r from-white via-white/90 to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-white via-white/90 to-transparent z-20 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-white via-white/70 to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/70 to-transparent z-20 pointer-events-none" />

      {/* Scrolling Cards Background */}
      <div className="absolute inset-0 flex items-center">
        <motion.div
          className="flex gap-8"
          animate={{
            x: [0, -((companies.length * 320) + (companies.length * 32))], // card width (320px) + gap (32px)
          }}
          transition={{
            duration: companies.length * 5, // 5 seconds per card for slower, elegant movement
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {duplicatedCompanies.map((company, index) => (
            <motion.div
              key={`${company.id}-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0 w-80 bg-white/25 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-5 transition-all duration-300"
              style={{
                filter: 'blur(1px)',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
            >
              <div className="flex items-start gap-3 mb-3">
                {/* Placeholder for logo */}
                <div className="w-12 h-12 bg-gradient-to-br from-green-400/50 to-emerald-400/50 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/20">
                  <Building2 className="w-6 h-6 text-white/90" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-800/70 truncate drop-shadow-sm">
                    {company.name}
                  </h3>
                  <p className="text-xs text-gray-600/60 mt-1">
                    Активный партнёр
                  </p>
                </div>
              </div>

              {company.description && (
                <p className="text-gray-700/50 text-xs line-clamp-2 mb-3 leading-relaxed">
                  {company.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-white/20">
                <div className="text-xs text-gray-600/60 font-medium">
                  {new Date(company.createdAt).getFullYear()}
                </div>
                <div className="w-2 h-2 bg-green-400/50 rounded-full shadow-sm"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

