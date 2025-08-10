/**
 * Utility functions for consistent error handling and logging
 */

/**
 * Safely extracts error message from any error object
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as any).message)
  }
  
  return String(error)
}

/**
 * Creates a detailed error log object for debugging
 */
export function createErrorLog(error: unknown, context?: string) {
  const message = getErrorMessage(error)
  
  return {
    message,
    error: error,
    stack: error instanceof Error ? error.stack : undefined,
    context: context || 'unknown',
    timestamp: new Date().toISOString()
  }
}

/**
 * Logs error with consistent format and prevents [object Object] issues
 */
export function logError(error: unknown, context?: string) {
  const errorLog = createErrorLog(error, context)
  console.error(`Error in ${errorLog.context}:`, errorLog)
  return errorLog
}

/**
 * Handles Supabase-specific errors with fallback messages
 */
export function handleSupabaseError(error: any, fallbackMessage = 'Database error occurred') {
  const errorLog = logError(error, 'Supabase')
  
  // Check for specific Supabase error patterns
  if (error?.code === 'PGRST116' || error?.message?.includes('relation') || error?.message?.includes('does not exist')) {
    return 'Tablas de la base de datos no encontradas. Usando datos de ejemplo.'
  }
  
  if (error?.code && error?.message) {
    return `${fallbackMessage}: ${error.message} (Code: ${error.code})`
  }
  
  return `${fallbackMessage}: ${errorLog.message}`
}
