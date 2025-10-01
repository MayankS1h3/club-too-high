// Advanced rate limiting system for payment APIs
// This provides more sophisticated rate limiting with different tiers and persistent storage

interface RateLimitRule {
  maxRequests: number
  windowMs: number
  blockDurationMs?: number
}

interface RateLimitRecord {
  count: number
  resetTime: number
  blockedUntil?: number
}

// Rate limit configurations for different endpoints
export const RATE_LIMIT_CONFIGS = {
  // Payment endpoints - very strict
  'payment-create': {
    maxRequests: 3,
    windowMs: 60000, // 1 minute
    blockDurationMs: 300000 // 5 minutes block
  },
  'payment-verify': {
    maxRequests: 5,
    windowMs: 60000, // 1 minute
    blockDurationMs: 180000 // 3 minutes block
  },
  
  // Authentication - moderate
  'auth-signin': {
    maxRequests: 5,
    windowMs: 300000, // 5 minutes
    blockDurationMs: 900000 // 15 minutes block
  },
  'auth-signup': {
    maxRequests: 3,
    windowMs: 300000, // 5 minutes
    blockDurationMs: 1800000 // 30 minutes block
  },
  
  // General API - lenient
  'api-general': {
    maxRequests: 60,
    windowMs: 60000, // 1 minute
    blockDurationMs: 60000 // 1 minute block
  }
} as const

// In-memory storage (in production, use Redis or database)
const rateLimitStore = new Map<string, RateLimitRecord>()

// Advanced rate limiting function
export function checkAdvancedRateLimit(
  identifier: string,
  endpointType: keyof typeof RATE_LIMIT_CONFIGS
): {
  allowed: boolean
  remaining: number
  resetTime: number
  blockedUntil?: number
  retryAfter?: number
} {
  const config = RATE_LIMIT_CONFIGS[endpointType]
  const key = `${endpointType}:${identifier}`
  const now = Date.now()
  
  const record = rateLimitStore.get(key)
  
  // Check if currently blocked
  if (record?.blockedUntil && now < record.blockedUntil) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
      blockedUntil: record.blockedUntil,
      retryAfter: Math.ceil((record.blockedUntil - now) / 1000)
    }
  }
  
  // Reset window if expired
  if (!record || now > record.resetTime) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + config.windowMs
    }
    rateLimitStore.set(key, newRecord)
    
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: newRecord.resetTime
    }
  }
  
  // Check if limit exceeded
  if (record.count >= config.maxRequests) {
    // Block the identifier
    const blockedUntil = now + (config.blockDurationMs || 300000) // Default 5 minutes
    record.blockedUntil = blockedUntil
    rateLimitStore.set(key, record)
    
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
      blockedUntil,
      retryAfter: Math.ceil((blockedUntil - now) / 1000)
    }
  }
  
  // Increment counter
  record.count++
  rateLimitStore.set(key, record)
  
  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime
  }
}

// Clean up expired records (call periodically)
export function cleanupRateLimitStore(): void {
  const now = Date.now()
  
  for (const [key, record] of rateLimitStore.entries()) {
    // Remove if both reset time and block time have passed
    const isExpired = now > record.resetTime && (!record.blockedUntil || now > record.blockedUntil)
    
    if (isExpired) {
      rateLimitStore.delete(key)
    }
  }
}

// Set up periodic cleanup (run every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 300000)
}

// Suspicious activity detection
interface SuspiciousActivityConfig {
  rapidRequestThreshold: number
  timeWindowMs: number
  suspiciousPatterns: string[]
}

const suspiciousActivityStore = new Map<string, number[]>()

export function detectSuspiciousActivity(
  identifier: string,
  userAgent?: string,
  requestPath?: string
): {
  isSuspicious: boolean
  reason?: string
  riskLevel: 'low' | 'medium' | 'high'
} {
  const now = Date.now()
  const timeWindow = 30000 // 30 seconds
  const rapidThreshold = 20 // 20 requests in 30 seconds
  
  // Track request timestamps
  const timestamps = suspiciousActivityStore.get(identifier) || []
  timestamps.push(now)
  
  // Keep only recent timestamps
  const recentTimestamps = timestamps.filter(time => now - time < timeWindow)
  suspiciousActivityStore.set(identifier, recentTimestamps)
  
  // Check for rapid requests
  if (recentTimestamps.length > rapidThreshold) {
    return {
      isSuspicious: true,
      reason: 'Rapid successive requests detected',
      riskLevel: 'high'
    }
  }
  
  // Check for suspicious user agents
  const suspiciousAgents = ['bot', 'crawler', 'scraper', 'automated']
  if (userAgent && suspiciousAgents.some(agent => 
    userAgent.toLowerCase().includes(agent)
  )) {
    return {
      isSuspicious: true,
      reason: 'Suspicious user agent detected',
      riskLevel: 'medium'
    }
  }
  
  // Check for suspicious request patterns
  if (requestPath && requestPath.includes('..')) {
    return {
      isSuspicious: true,
      reason: 'Path traversal attempt detected',
      riskLevel: 'high'
    }
  }
  
  return {
    isSuspicious: false,
    riskLevel: 'low'
  }
}

// Payment-specific security checks
export function checkPaymentSecurity(
  amount: number,
  userId: string,
  eventId: string
): {
  isSecure: boolean
  violations: string[]
} {
  const violations: string[] = []
  
  // Check for suspicious amounts
  if (amount <= 0) {
    violations.push('Invalid payment amount')
  }
  
  if (amount > 100000) { // ₹1,00,000
    violations.push('Amount exceeds maximum limit')
  }
  
  // Check for obvious patterns that might indicate automation
  if (amount.toString().match(/^(\d)\1+$/)) { // All same digits
    violations.push('Suspicious amount pattern')
  }
  
  return {
    isSecure: violations.length === 0,
    violations
  }
}