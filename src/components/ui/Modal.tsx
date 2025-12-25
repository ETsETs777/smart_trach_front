import { ReactNode, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useModalKeyboardNavigation } from '@/hooks/useKeyboardNavigation'
import Button from './Button'
import Card from './Card'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  closeOnBackdropClick?: boolean
  closeOnEscape?: boolean
  footer?: ReactNode
  className?: string
  ariaLabel?: string
  ariaDescribedBy?: string
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  footer,
  className = '',
  ariaLabel,
  ariaDescribedBy,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Keyboard navigation
  useModalKeyboardNavigation(onClose, isOpen && closeOnEscape)

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Focus trap - focus first element
      const timer = setTimeout(() => {
        const firstFocusable = modalRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        firstFocusable?.focus()
      }, 100)
      return () => {
        clearTimeout(timer)
        document.body.style.overflow = ''
      }
    }
  }, [isOpen])

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
          >
            {/* Modal */}
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className={`${sizeClasses[size]} w-full ${className}`}
            >
              <Card className="relative max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                {(title || showCloseButton) && (
                  <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    {title && (
                      <h2
                        id="modal-title"
                        className="text-2xl font-bold text-gray-900 dark:text-gray-100"
                      >
                        {title}
                      </h2>
                    )}
                    {showCloseButton && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="ml-auto"
                        aria-label="Close modal"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {children}
                </div>

                {/* Footer */}
                {footer && (
                  <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                    {footer}
                  </div>
                )}
              </Card>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

