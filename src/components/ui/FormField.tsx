import { forwardRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  touched?: boolean
  showSuccess?: boolean
  helperText?: string
  icon?: React.ReactNode
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

/**
 * Enhanced form field component with real-time validation feedback
 */
const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      error,
      touched,
      showSuccess = false,
      helperText,
      icon,
      className = '',
      onBlur,
      onChange,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(false)

    useEffect(() => {
      if (props.value || props.defaultValue) {
        setHasValue(true)
      }
    }, [props.value, props.defaultValue])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0)
      onChange?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    }

    const handleFocus = () => {
      setIsFocused(true)
    }

    const hasError = touched && error
    const isValid = touched && !error && showSuccess && hasValue

    return (
      <div className="w-full">
        <label
          htmlFor={props.id}
          className={`block text-sm font-medium mb-2 transition-colors ${
            hasError ? 'text-red-600' : isValid ? 'text-green-600' : 'text-gray-700'
          }`}
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            {...props}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            className={`
              w-full px-4 py-3 border rounded-xl
              transition-all duration-200
              focus:outline-none focus:ring-2
              ${icon ? 'pl-10' : ''}
              ${hasError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
              ${isValid ? 'border-green-500 focus:ring-green-500 focus:border-green-500' : ''}
              ${!hasError && !isValid ? 'border-gray-300 focus:ring-green-500 focus:border-green-500' : ''}
              ${isFocused ? 'shadow-lg' : 'shadow-sm'}
              ${className}
            `}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
          />

          {/* Success/Error Icons */}
          <AnimatePresence>
            {hasError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <XCircle className="w-5 h-5 text-red-500" />
              </motion.div>
            )}
            {isValid && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <CheckCircle className="w-5 h-5 text-green-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {hasError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-1"
            >
              <p id={`${props.id}-error`} className="text-sm text-red-600 flex items-center gap-1" role="alert">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Helper Text */}
        {helperText && !hasError && (
          <p id={`${props.id}-helper`} className="mt-1 text-xs text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

FormField.displayName = 'FormField'

export default FormField

