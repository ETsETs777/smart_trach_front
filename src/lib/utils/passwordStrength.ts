/**
 * Password strength validation and checking utilities
 */

export interface PasswordStrength {
  score: number // 0-4
  label: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong'
  feedback: string[]
  meetsRequirements: boolean
}

interface PasswordRequirements {
  minLength?: number
  requireUppercase?: boolean
  requireLowercase?: boolean
  requireNumbers?: boolean
  requireSpecialChars?: boolean
  maxLength?: number
}

const DEFAULT_REQUIREMENTS: Required<PasswordRequirements> = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false, // Optional by default
}

/**
 * Common weak passwords to check against
 */
const COMMON_PASSWORDS = [
  'password',
  '12345678',
  '123456789',
  '1234567890',
  'qwerty',
  'abc123',
  'password1',
  'welcome',
  'admin',
  'letmein',
]

/**
 * Check password strength
 */
export function checkPasswordStrength(
  password: string,
  requirements: PasswordRequirements = {},
): PasswordStrength {
  const req = { ...DEFAULT_REQUIREMENTS, ...requirements }
  const feedback: string[] = []
  let score = 0

  // Length check
  if (password.length < req.minLength) {
    feedback.push(`Password must be at least ${req.minLength} characters long`)
    return {
      score: 0,
      label: 'weak',
      feedback,
      meetsRequirements: false,
    }
  }

  if (password.length > req.maxLength) {
    feedback.push(`Password must be no more than ${req.maxLength} characters long`)
    return {
      score: 0,
      label: 'weak',
      feedback,
      meetsRequirements: false,
    }
  }

  // Length score
  if (password.length >= req.minLength) score++
  if (password.length >= 12) score++
  if (password.length >= 16) score++

  // Character variety checks
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

  if (hasUppercase) score++
  if (hasLowercase) score++
  if (hasNumbers) score++
  if (hasSpecialChars) score++

  // Check requirements
  if (req.requireUppercase && !hasUppercase) {
    feedback.push('Password must contain at least one uppercase letter')
  }
  if (req.requireLowercase && !hasLowercase) {
    feedback.push('Password must contain at least one lowercase letter')
  }
  if (req.requireNumbers && !hasNumbers) {
    feedback.push('Password must contain at least one number')
  }
  if (req.requireSpecialChars && !hasSpecialChars) {
    feedback.push('Password must contain at least one special character')
  }

  // Check against common passwords
  const lowerPassword = password.toLowerCase()
  if (COMMON_PASSWORDS.some((common) => lowerPassword.includes(common))) {
    feedback.push('Password is too common. Please choose a more unique password.')
    score = Math.max(0, score - 2)
  }

  // Determine label
  let label: PasswordStrength['label'] = 'weak'
  if (score >= 6) {
    label = 'very-strong'
  } else if (score >= 5) {
    label = 'strong'
  } else if (score >= 3) {
    label = 'good'
  } else if (score >= 2) {
    label = 'fair'
  }

  // Positive feedback
  if (score >= 4 && feedback.length === 0) {
    feedback.push('Password strength is good!')
  }

  const meetsRequirements =
    (!req.requireUppercase || hasUppercase) &&
    (!req.requireLowercase || hasLowercase) &&
    (!req.requireNumbers || hasNumbers) &&
    (!req.requireSpecialChars || hasSpecialChars) &&
    password.length >= req.minLength &&
    password.length <= req.maxLength

  return {
    score: Math.min(4, score),
    label,
    feedback,
    meetsRequirements,
  }
}

/**
 * Get password strength color class
 */
export function getPasswordStrengthColor(strength: PasswordStrength['label']): string {
  switch (strength) {
    case 'very-strong':
      return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20'
    case 'strong':
      return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20'
    case 'good':
      return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20'
    case 'fair':
      return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20'
    case 'weak':
      return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20'
    default:
      return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20'
  }
}

/**
 * Get password strength progress percentage
 */
export function getPasswordStrengthProgress(strength: PasswordStrength): number {
  return (strength.score / 4) * 100
}

 * Password strength validation and checking utilities
 */

export interface PasswordStrength {
  score: number // 0-4
  label: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong'
  feedback: string[]
  meetsRequirements: boolean
}

interface PasswordRequirements {
  minLength?: number
  requireUppercase?: boolean
  requireLowercase?: boolean
  requireNumbers?: boolean
  requireSpecialChars?: boolean
  maxLength?: number
}

const DEFAULT_REQUIREMENTS: Required<PasswordRequirements> = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false, // Optional by default
}

/**
 * Common weak passwords to check against
 */
const COMMON_PASSWORDS = [
  'password',
  '12345678',
  '123456789',
  '1234567890',
  'qwerty',
  'abc123',
  'password1',
  'welcome',
  'admin',
  'letmein',
]

/**
 * Check password strength
 */
export function checkPasswordStrength(
  password: string,
  requirements: PasswordRequirements = {},
): PasswordStrength {
  const req = { ...DEFAULT_REQUIREMENTS, ...requirements }
  const feedback: string[] = []
  let score = 0

  // Length check
  if (password.length < req.minLength) {
    feedback.push(`Password must be at least ${req.minLength} characters long`)
    return {
      score: 0,
      label: 'weak',
      feedback,
      meetsRequirements: false,
    }
  }

  if (password.length > req.maxLength) {
    feedback.push(`Password must be no more than ${req.maxLength} characters long`)
    return {
      score: 0,
      label: 'weak',
      feedback,
      meetsRequirements: false,
    }
  }

  // Length score
  if (password.length >= req.minLength) score++
  if (password.length >= 12) score++
  if (password.length >= 16) score++

  // Character variety checks
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

  if (hasUppercase) score++
  if (hasLowercase) score++
  if (hasNumbers) score++
  if (hasSpecialChars) score++

  // Check requirements
  if (req.requireUppercase && !hasUppercase) {
    feedback.push('Password must contain at least one uppercase letter')
  }
  if (req.requireLowercase && !hasLowercase) {
    feedback.push('Password must contain at least one lowercase letter')
  }
  if (req.requireNumbers && !hasNumbers) {
    feedback.push('Password must contain at least one number')
  }
  if (req.requireSpecialChars && !hasSpecialChars) {
    feedback.push('Password must contain at least one special character')
  }

  // Check against common passwords
  const lowerPassword = password.toLowerCase()
  if (COMMON_PASSWORDS.some((common) => lowerPassword.includes(common))) {
    feedback.push('Password is too common. Please choose a more unique password.')
    score = Math.max(0, score - 2)
  }

  // Determine label
  let label: PasswordStrength['label'] = 'weak'
  if (score >= 6) {
    label = 'very-strong'
  } else if (score >= 5) {
    label = 'strong'
  } else if (score >= 3) {
    label = 'good'
  } else if (score >= 2) {
    label = 'fair'
  }

  // Positive feedback
  if (score >= 4 && feedback.length === 0) {
    feedback.push('Password strength is good!')
  }

  const meetsRequirements =
    (!req.requireUppercase || hasUppercase) &&
    (!req.requireLowercase || hasLowercase) &&
    (!req.requireNumbers || hasNumbers) &&
    (!req.requireSpecialChars || hasSpecialChars) &&
    password.length >= req.minLength &&
    password.length <= req.maxLength

  return {
    score: Math.min(4, score),
    label,
    feedback,
    meetsRequirements,
  }
}

/**
 * Get password strength color class
 */
export function getPasswordStrengthColor(strength: PasswordStrength['label']): string {
  switch (strength) {
    case 'very-strong':
      return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20'
    case 'strong':
      return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20'
    case 'good':
      return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20'
    case 'fair':
      return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20'
    case 'weak':
      return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20'
    default:
      return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20'
  }
}

/**
 * Get password strength progress percentage
 */
export function getPasswordStrengthProgress(strength: PasswordStrength): number {
  return (strength.score / 4) * 100
}

 * Password strength validation and checking utilities
 */

export interface PasswordStrength {
  score: number // 0-4
  label: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong'
  feedback: string[]
  meetsRequirements: boolean
}

interface PasswordRequirements {
  minLength?: number
  requireUppercase?: boolean
  requireLowercase?: boolean
  requireNumbers?: boolean
  requireSpecialChars?: boolean
  maxLength?: number
}

const DEFAULT_REQUIREMENTS: Required<PasswordRequirements> = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false, // Optional by default
}

/**
 * Common weak passwords to check against
 */
const COMMON_PASSWORDS = [
  'password',
  '12345678',
  '123456789',
  '1234567890',
  'qwerty',
  'abc123',
  'password1',
  'welcome',
  'admin',
  'letmein',
]

/**
 * Check password strength
 */
export function checkPasswordStrength(
  password: string,
  requirements: PasswordRequirements = {},
): PasswordStrength {
  const req = { ...DEFAULT_REQUIREMENTS, ...requirements }
  const feedback: string[] = []
  let score = 0

  // Length check
  if (password.length < req.minLength) {
    feedback.push(`Password must be at least ${req.minLength} characters long`)
    return {
      score: 0,
      label: 'weak',
      feedback,
      meetsRequirements: false,
    }
  }

  if (password.length > req.maxLength) {
    feedback.push(`Password must be no more than ${req.maxLength} characters long`)
    return {
      score: 0,
      label: 'weak',
      feedback,
      meetsRequirements: false,
    }
  }

  // Length score
  if (password.length >= req.minLength) score++
  if (password.length >= 12) score++
  if (password.length >= 16) score++

  // Character variety checks
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

  if (hasUppercase) score++
  if (hasLowercase) score++
  if (hasNumbers) score++
  if (hasSpecialChars) score++

  // Check requirements
  if (req.requireUppercase && !hasUppercase) {
    feedback.push('Password must contain at least one uppercase letter')
  }
  if (req.requireLowercase && !hasLowercase) {
    feedback.push('Password must contain at least one lowercase letter')
  }
  if (req.requireNumbers && !hasNumbers) {
    feedback.push('Password must contain at least one number')
  }
  if (req.requireSpecialChars && !hasSpecialChars) {
    feedback.push('Password must contain at least one special character')
  }

  // Check against common passwords
  const lowerPassword = password.toLowerCase()
  if (COMMON_PASSWORDS.some((common) => lowerPassword.includes(common))) {
    feedback.push('Password is too common. Please choose a more unique password.')
    score = Math.max(0, score - 2)
  }

  // Determine label
  let label: PasswordStrength['label'] = 'weak'
  if (score >= 6) {
    label = 'very-strong'
  } else if (score >= 5) {
    label = 'strong'
  } else if (score >= 3) {
    label = 'good'
  } else if (score >= 2) {
    label = 'fair'
  }

  // Positive feedback
  if (score >= 4 && feedback.length === 0) {
    feedback.push('Password strength is good!')
  }

  const meetsRequirements =
    (!req.requireUppercase || hasUppercase) &&
    (!req.requireLowercase || hasLowercase) &&
    (!req.requireNumbers || hasNumbers) &&
    (!req.requireSpecialChars || hasSpecialChars) &&
    password.length >= req.minLength &&
    password.length <= req.maxLength

  return {
    score: Math.min(4, score),
    label,
    feedback,
    meetsRequirements,
  }
}

/**
 * Get password strength color class
 */
export function getPasswordStrengthColor(strength: PasswordStrength['label']): string {
  switch (strength) {
    case 'very-strong':
      return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20'
    case 'strong':
      return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20'
    case 'good':
      return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20'
    case 'fair':
      return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20'
    case 'weak':
      return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20'
    default:
      return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20'
  }
}

/**
 * Get password strength progress percentage
 */
export function getPasswordStrengthProgress(strength: PasswordStrength): number {
  return (strength.score / 4) * 100
}




