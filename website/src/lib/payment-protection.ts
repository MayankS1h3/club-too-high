// Duplicate payment protection system
// Prevents multiple payments for the same booking and detects fraudulent attempts

interface PaymentAttempt {
  userId: string
  eventId: string
  amount: number
  timestamp: number
  orderId?: string
  paymentId?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
}

// In-memory storage for payment attempts (use Redis in production)
const paymentAttempts = new Map<string, PaymentAttempt>()
const completedPayments = new Set<string>()

// Generate unique payment attempt key
function generatePaymentKey(userId: string, eventId: string, amount: number): string {
  return `${userId}:${eventId}:${amount}`
}

// Check for duplicate payment attempts
export function checkDuplicatePayment(
  userId: string,
  eventId: string,
  amount: number,
  timeWindowMs: number = 300000 // 5 minutes
): {
  isDuplicate: boolean
  existingAttempt?: PaymentAttempt
  reason?: string
} {
  const key = generatePaymentKey(userId, eventId, amount)
  const now = Date.now()
  
  // Check if this exact payment was already completed
  if (completedPayments.has(key)) {
    return {
      isDuplicate: true,
      reason: 'Payment already completed for this booking'
    }
  }
  
  // Check for recent attempts with same parameters
  const existingAttempt = paymentAttempts.get(key)
  
  if (existingAttempt) {
    const timeDiff = now - existingAttempt.timestamp
    
    // If there's a recent attempt within time window
    if (timeDiff < timeWindowMs) {
      // If it's still pending or processing
      if (existingAttempt.status === 'pending' || existingAttempt.status === 'processing') {
        return {
          isDuplicate: true,
          existingAttempt,
          reason: `Payment attempt already in progress (${existingAttempt.status})`
        }
      }
      
      // If previous attempt failed recently, allow retry but log it
      if (existingAttempt.status === 'failed' && timeDiff < 30000) { // 30 seconds
        return {
          isDuplicate: true,
          existingAttempt,
          reason: 'Recent payment attempt failed, please wait before retrying'
        }
      }
    }
  }
  
  return { isDuplicate: false }
}

// Register a new payment attempt
export function registerPaymentAttempt(
  userId: string,
  eventId: string,
  amount: number,
  orderId?: string
): string {
  const key = generatePaymentKey(userId, eventId, amount)
  const attempt: PaymentAttempt = {
    userId,
    eventId,
    amount,
    timestamp: Date.now(),
    orderId,
    status: 'pending'
  }
  
  paymentAttempts.set(key, attempt)
  return key
}

// Update payment attempt status
export function updatePaymentAttemptStatus(
  userId: string,
  eventId: string,
  amount: number,
  status: PaymentAttempt['status'],
  paymentId?: string
): void {
  const key = generatePaymentKey(userId, eventId, amount)
  const attempt = paymentAttempts.get(key)
  
  if (attempt) {
    attempt.status = status
    attempt.paymentId = paymentId
    
    // If completed successfully, mark as completed and remove from attempts
    if (status === 'completed') {
      completedPayments.add(key)
      paymentAttempts.delete(key)
    }
    // If failed, keep the attempt for a short while to prevent immediate retry
    else if (status === 'failed') {
      setTimeout(() => {
        paymentAttempts.delete(key)
      }, 60000) // Remove failed attempt after 1 minute
    }
    // Update the attempt
    else {
      paymentAttempts.set(key, attempt)
    }
  }
}

// Check for suspicious payment patterns
export function detectSuspiciousPaymentPattern(
  userId: string,
  eventId: string,
  amount: number
): {
  isSuspicious: boolean
  reasons: string[]
  riskLevel: 'low' | 'medium' | 'high'
} {
  const reasons: string[] = []
  const now = Date.now()
  const oneHour = 3600000
  
  // Check for multiple attempts for different events by same user in short time
  const userAttempts = Array.from(paymentAttempts.values())
    .filter(attempt => 
      attempt.userId === userId && 
      now - attempt.timestamp < oneHour
    )
  
  if (userAttempts.length > 5) {
    reasons.push('Multiple payment attempts in short time period')
  }
  
  // Check for same amount across different users (possible card testing)
  const sameAmountAttempts = Array.from(paymentAttempts.values())
    .filter(attempt => 
      attempt.amount === amount && 
      now - attempt.timestamp < oneHour
    )
  
  if (sameAmountAttempts.length > 10) {
    reasons.push('Same amount attempted by multiple users (possible card testing)')
  }
  
  // Check for round number amounts (common in fraud)
  if (amount % 1000 === 0 && amount > 5000) {
    reasons.push('Round number amount (potentially suspicious)')
  }
  
  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' = 'low'
  if (reasons.length > 0) {
    riskLevel = reasons.length > 1 ? 'high' : 'medium'
  }
  
  return {
    isSuspicious: reasons.length > 0,
    reasons,
    riskLevel
  }
}

// Get payment attempt statistics (for monitoring)
export function getPaymentAttemptStats(): {
  totalAttempts: number
  pendingAttempts: number
  completedPayments: number
  failedAttempts: number
  recentAttempts: number
} {
  const now = Date.now()
  const oneHour = 3600000
  
  const attempts = Array.from(paymentAttempts.values())
  
  return {
    totalAttempts: attempts.length,
    pendingAttempts: attempts.filter(a => a.status === 'pending').length,
    completedPayments: completedPayments.size,
    failedAttempts: attempts.filter(a => a.status === 'failed').length,
    recentAttempts: attempts.filter(a => now - a.timestamp < oneHour).length
  }
}

// Cleanup old payment attempts (call periodically)
export function cleanupPaymentAttempts(): void {
  const now = Date.now()
  const sixHours = 21600000 // 6 hours
  
  // Remove old pending/processing attempts
  for (const [key, attempt] of paymentAttempts.entries()) {
    if (now - attempt.timestamp > sixHours) {
      paymentAttempts.delete(key)
    }
  }
  
  // Keep completed payments for longer (24 hours) then remove
  const oneDayAgo = now - 86400000
  for (const key of completedPayments) {
    // This is a simple cleanup - in production you'd want to move to permanent storage
    // For now, we'll keep them indefinitely for security
  }
}

// Set up periodic cleanup
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupPaymentAttempts, 600000) // Every 10 minutes
}

// Razorpay order deduplication
const razorpayOrders = new Map<string, {
  orderId: string
  timestamp: number
  userId: string
  eventId: string
  amount: number
}>()

export function checkDuplicateRazorpayOrder(
  userId: string,
  eventId: string,
  amount: number
): {
  isDuplicate: boolean
  existingOrderId?: string
} {
  const key = generatePaymentKey(userId, eventId, amount)
  const existing = razorpayOrders.get(key)
  
  if (existing) {
    const fiveMinutes = 300000
    const now = Date.now()
    
    // If order was created in last 5 minutes, consider it duplicate
    if (now - existing.timestamp < fiveMinutes) {
      return {
        isDuplicate: true,
        existingOrderId: existing.orderId
      }
    }
  }
  
  return { isDuplicate: false }
}

export function registerRazorpayOrder(
  orderId: string,
  userId: string,
  eventId: string,
  amount: number
): void {
  const key = generatePaymentKey(userId, eventId, amount)
  
  razorpayOrders.set(key, {
    orderId,
    timestamp: Date.now(),
    userId,
    eventId,
    amount
  })
  
  // Cleanup after 1 hour
  setTimeout(() => {
    razorpayOrders.delete(key)
  }, 3600000)
}