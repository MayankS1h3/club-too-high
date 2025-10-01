// API middleware helpers for validation and error handling
import { NextRequest, NextResponse } from 'next/server'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  details?: any
}

// Parse and validate JSON request body
export async function parseJsonBody(request: NextRequest): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    // Check content type
    const contentType = request.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      return {
        success: false,
        error: 'Content-Type must be application/json'
      }
    }

    // Get content length
    const contentLength = request.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 1024 * 1024) { // 1MB limit
      return {
        success: false,
        error: 'Request body too large'
      }
    }

    const body = await request.json()
    
    // Basic structure validation
    if (body === null || typeof body !== 'object') {
      return {
        success: false,
        error: 'Invalid JSON structure'
      }
    }

    return {
      success: true,
      data: body
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      return {
        success: false,
        error: 'Invalid JSON format'
      }
    }
    
    return {
      success: false,
      error: 'Failed to parse request body'
    }
  }
}

// Standard API error responses
export function createErrorResponse(message: string, status: number = 400, details?: any): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
      details
    },
    { status }
  )
}

// Standard API success responses
export function createSuccessResponse<T>(data: T, status: number = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data
    },
    { status }
  )
}

// Rate limiting helper (basic implementation)
const requestCounts = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string, 
  maxRequests: number = 10, 
  windowMs: number = 60000 // 1 minute
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const record = requestCounts.get(identifier)

  if (!record || now > record.resetTime) {
    // Reset or create new record
    const resetTime = now + windowMs
    requestCounts.set(identifier, { count: 1, resetTime })
    return { allowed: true, remaining: maxRequests - 1, resetTime }
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime }
  }

  record.count++
  return { allowed: true, remaining: maxRequests - record.count, resetTime: record.resetTime }
}

// Get client IP for rate limiting
export function getClientIP(request: NextRequest): string {
  // Check various headers for real IP
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-client-ip') ||
    'unknown'
  )
}

// Validate request method
export function validateMethod(request: NextRequest, allowedMethods: string[]): boolean {
  return allowedMethods.includes(request.method)
}