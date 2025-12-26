/**
 * Date formatting utilities with i18n support
 * Uses date-fns with locale support
 */

import { format, formatDistanceToNow, formatRelative, parseISO } from 'date-fns'
import { ru, enUS, de } from 'date-fns/locale'
import i18n from '@/i18n/config'

// Locale mapping
const localeMap: Record<string, Locale> = {
  ru,
  en: enUS,
  de,
}

/**
 * Get current locale for date-fns
 */
export function getDateLocale(): Locale {
  const lang = i18n.language?.split('-')[0] || 'en'
  return localeMap[lang] || enUS
}

/**
 * Format date with locale support
 */
export function formatDate(
  date: Date | string | number,
  formatStr: string = 'PPp'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date)
  const locale = getDateLocale()
  return format(dateObj, formatStr, { locale })
}

/**
 * Format date as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string | number): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date)
  const locale = getDateLocale()
  return formatDistanceToNow(dateObj, { addSuffix: true, locale })
}

/**
 * Format date as relative (e.g., "today", "yesterday", "2 days ago")
 */
export function formatRelativeDate(date: Date | string | number): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date)
  const locale = getDateLocale()
  return formatRelative(dateObj, new Date(), { locale })
}

/**
 * Format date for display (short format)
 */
export function formatDateShort(date: Date | string | number): string {
  return formatDate(date, 'PP')
}

/**
 * Format date and time
 */
export function formatDateTime(date: Date | string | number): string {
  return formatDate(date, 'PPp')
}

/**
 * Format time only
 */
export function formatTime(date: Date | string | number): string {
  return formatDate(date, 'HH:mm')
}

/**
 * Format date for input fields (YYYY-MM-DD)
 */
export function formatDateForInput(date: Date | string | number): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date)
  return format(dateObj, 'yyyy-MM-dd')
}

/**
 * Format number with locale support
 */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions
): string {
  const lang = i18n.language?.split('-')[0] || 'en'
  return new Intl.NumberFormat(lang, options).format(value)
}

/**
 * Format currency with locale support
 */
export function formatCurrency(
  value: number,
  currency: string = 'RUB',
  options?: Intl.NumberFormatOptions
): string {
  const lang = i18n.language?.split('-')[0] || 'en'
  return new Intl.NumberFormat(lang, {
    style: 'currency',
    currency,
    ...options,
  }).format(value)
}

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals: number = 0): string {
  const lang = i18n.language?.split('-')[0] || 'en'
  return new Intl.NumberFormat(lang, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100)
}



