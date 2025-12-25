/**
 * File validation utilities for secure file uploads
 * Validates file type, size, and content before upload
 */

export interface FileValidationResult {
  valid: boolean
  error?: string
}

export interface FileValidationOptions {
  maxSizeMB?: number
  allowedTypes?: string[]
  allowedMimeTypes?: string[]
  checkContent?: boolean
}

const DEFAULT_MAX_SIZE_MB = 10
const DEFAULT_ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = DEFAULT_MAX_SIZE_MB * 1024 * 1024 // 10MB in bytes

/**
 * Validates file size
 */
export function validateFileSize(file: File, maxSizeMB: number = DEFAULT_MAX_SIZE_MB): FileValidationResult {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${maxSizeMB}MB`,
    }
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty',
    }
  }

  return { valid: true }
}

/**
 * Validates file type by extension
 */
export function validateFileExtension(file: File, allowedTypes: string[] = DEFAULT_ALLOWED_TYPES): FileValidationResult {
  const fileExtension = file.name.split('.').pop()?.toLowerCase()
  const allowedExtensions = allowedTypes.map(type => type.split('/').pop()?.toLowerCase()).filter(Boolean)

  if (fileExtension && allowedExtensions.includes(fileExtension)) {
    return { valid: true }
  }

  return {
    valid: false,
    error: `File type .${fileExtension} is not allowed. Allowed types: ${allowedExtensions.join(', ')}`,
  }
}

/**
 * Validates file MIME type
 */
export function validateMimeType(file: File, allowedMimeTypes: string[] = DEFAULT_ALLOWED_TYPES): FileValidationResult {
  if (!file.type) {
    return {
      valid: false,
      error: 'File type could not be determined',
    }
  }

  if (allowedMimeTypes.includes(file.type)) {
    return { valid: true }
  }

  return {
    valid: false,
    error: `File MIME type ${file.type} is not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`,
  }
}

/**
 * Validates image file by reading its header
 * Checks actual file content, not just extension/MIME type
 */
export async function validateImageContent(file: File): Promise<FileValidationResult> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer
      const uint8Array = new Uint8Array(arrayBuffer)
      
      // Check file signature (magic numbers)
      // JPEG: FF D8 FF
      // PNG: 89 50 4E 47
      // WebP: RIFF ... WEBP
      // GIF: 47 49 46 38
      
      const isJPEG = uint8Array[0] === 0xFF && uint8Array[1] === 0xD8 && uint8Array[2] === 0xFF
      const isPNG = uint8Array[0] === 0x89 && uint8Array[1] === 0x50 && uint8Array[2] === 0x4E && uint8Array[3] === 0x47
      const isGIF = uint8Array[0] === 0x47 && uint8Array[1] === 0x49 && uint8Array[2] === 0x46 && uint8Array[3] === 0x38
      
      // Check for WebP (RIFF ... WEBP)
      const isWebP = uint8Array[0] === 0x52 && uint8Array[1] === 0x49 && uint8Array[2] === 0x46 && uint8Array[3] === 0x46 &&
                     uint8Array[8] === 0x57 && uint8Array[9] === 0x45 && uint8Array[10] === 0x42 && uint8Array[11] === 0x50

      if (isJPEG || isPNG || isGIF || isWebP) {
        resolve({ valid: true })
      } else {
        resolve({
          valid: false,
          error: 'File content does not match image format. File may be corrupted or malicious.',
        })
      }
    }

    reader.onerror = () => {
      resolve({
        valid: false,
        error: 'Failed to read file content',
      })
    }

    // Read only first 12 bytes (enough for file signature check)
    const blob = file.slice(0, 12)
    reader.readAsArrayBuffer(blob)
  })
}

/**
 * Comprehensive file validation
 */
export async function validateFile(
  file: File,
  options: FileValidationOptions = {}
): Promise<FileValidationResult> {
  const {
    maxSizeMB = DEFAULT_MAX_SIZE_MB,
    allowedTypes = DEFAULT_ALLOWED_TYPES,
    allowedMimeTypes = DEFAULT_ALLOWED_TYPES,
    checkContent = true,
  } = options

  // 1. Validate file size
  const sizeValidation = validateFileSize(file, maxSizeMB)
  if (!sizeValidation.valid) {
    return sizeValidation
  }

  // 2. Validate file extension
  const extensionValidation = validateFileExtension(file, allowedTypes)
  if (!extensionValidation.valid) {
    return extensionValidation
  }

  // 3. Validate MIME type
  const mimeValidation = validateMimeType(file, allowedMimeTypes)
  if (!mimeValidation.valid) {
    return mimeValidation
  }

  // 4. Validate file content (for images)
  if (checkContent && file.type.startsWith('image/')) {
    const contentValidation = await validateImageContent(file)
    if (!contentValidation.valid) {
      return contentValidation
    }
  }

  return { valid: true }
}

/**
 * Sanitize filename to prevent path traversal and other attacks
 */
export function sanitizeFilename(filename: string): string {
  // Remove path separators and dangerous characters
  return filename
    .replace(/[\/\\]/g, '_') // Replace path separators
    .replace(/[<>:"|?*]/g, '_') // Replace dangerous characters
    .replace(/^\.+/, '') // Remove leading dots
    .replace(/\s+/g, '_') // Replace spaces
    .substring(0, 255) // Limit length
}

/**
 * Get human-readable file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

