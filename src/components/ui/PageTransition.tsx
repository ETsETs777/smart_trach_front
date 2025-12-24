import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
    scale: 0.99,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.99,
  },
}

const pageTransition = {
  type: 'tween',
  ease: [0.4, 0, 0.2, 1],
  duration: 0.25,
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation()

  return (
    <>
      {/* Background overlay to prevent white flash - always visible behind everything */}
      <div className="fixed inset-0 bg-gradient-to-br from-green-600 via-emerald-600 via-teal-600 to-cyan-600 -z-10" />
      
      <div className="relative min-h-screen">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
            className="w-full relative"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}

