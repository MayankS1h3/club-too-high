// Application configuration constants
// Move hardcoded values here for easier maintenance

export const CONFIG = {
  // Rate Limiting
  RATE_LIMIT: {
    CLEANUP_INTERVAL_MS: parseInt(process.env.RATE_LIMIT_CLEANUP_INTERVAL || '300000'), // 5 minutes
    AUTH_SIGNIN_WINDOW_MS: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW || '900000'), // 15 minutes
    AUTH_SIGNIN_MAX_ATTEMPTS: parseInt(process.env.AUTH_MAX_ATTEMPTS || '5'),
    PAYMENT_CREATE_WINDOW_MS: parseInt(process.env.PAYMENT_RATE_LIMIT_WINDOW || '300000'), // 5 minutes
    PAYMENT_CREATE_MAX_ATTEMPTS: parseInt(process.env.PAYMENT_MAX_ATTEMPTS || '3'),
  },

  // Payment Protection
  PAYMENT: {
    CLEANUP_INTERVAL_MS: parseInt(process.env.PAYMENT_CLEANUP_INTERVAL || '600000'), // 10 minutes
    DUPLICATE_WINDOW_MS: parseInt(process.env.PAYMENT_DUPLICATE_WINDOW || '300000'), // 5 minutes
    RETRY_DELAY_MS: parseInt(process.env.PAYMENT_RETRY_DELAY || '30000'), // 30 seconds
    FAILED_ATTEMPT_CLEANUP_MS: parseInt(process.env.PAYMENT_FAILED_CLEANUP || '60000'), // 1 minute
    ORDER_CLEANUP_MS: parseInt(process.env.PAYMENT_ORDER_CLEANUP || '3600000'), // 1 hour
    STATS_WINDOW_MS: parseInt(process.env.PAYMENT_STATS_WINDOW || '3600000'), // 1 hour
    OLD_ATTEMPT_CLEANUP_MS: parseInt(process.env.PAYMENT_OLD_CLEANUP || '21600000'), // 6 hours
    COMPLETED_RETENTION_MS: parseInt(process.env.PAYMENT_COMPLETED_RETENTION || '86400000'), // 24 hours
  },

  // Validation Limits
  VALIDATION: {
    MAX_PAYMENT_AMOUNT: parseInt(process.env.MAX_PAYMENT_AMOUNT || '100000'), // ₹100,000
    MIN_PAYMENT_AMOUNT: parseInt(process.env.MIN_PAYMENT_AMOUNT || '1'), // ₹1
    MAX_TICKET_QUANTITY: parseInt(process.env.MAX_TICKET_QUANTITY || '10'),
    MIN_TICKET_QUANTITY: parseInt(process.env.MIN_TICKET_QUANTITY || '1'),
    MAX_EVENT_TITLE_LENGTH: parseInt(process.env.MAX_EVENT_TITLE_LENGTH || '100'),
    MIN_EVENT_TITLE_LENGTH: parseInt(process.env.MIN_EVENT_TITLE_LENGTH || '3'),
    MAX_EVENT_DESCRIPTION_LENGTH: parseInt(process.env.MAX_EVENT_DESCRIPTION_LENGTH || '1000'),
    MIN_EVENT_DESCRIPTION_LENGTH: parseInt(process.env.MIN_EVENT_DESCRIPTION_LENGTH || '10'),
    MAX_NAME_LENGTH: parseInt(process.env.MAX_NAME_LENGTH || '50'),
    MIN_NAME_LENGTH: parseInt(process.env.MIN_NAME_LENGTH || '2'),
    MAX_EMAIL_LENGTH: parseInt(process.env.MAX_EMAIL_LENGTH || '254'),
    MAX_PASSWORD_LENGTH: parseInt(process.env.MAX_PASSWORD_LENGTH || '128'),
    MIN_PASSWORD_LENGTH: parseInt(process.env.MIN_PASSWORD_LENGTH || '8'),
  },

  // UI Timeouts
  UI: {
    SUCCESS_REDIRECT_DELAY_MS: parseInt(process.env.SUCCESS_REDIRECT_DELAY || '3000'), // 3 seconds
    PRINT_FEEDBACK_DELAY_MS: parseInt(process.env.PRINT_FEEDBACK_DELAY || '1000'), // 1 second
    SIGNUP_REDIRECT_DELAY_MS: parseInt(process.env.SIGNUP_REDIRECT_DELAY || '2000'), // 2 seconds
  },

  // Security
  SECURITY: {
    SUSPICIOUS_AMOUNT_THRESHOLD: parseInt(process.env.SUSPICIOUS_AMOUNT_THRESHOLD || '5000'), // ₹5,000
    ROUND_AMOUNT_THRESHOLD: parseInt(process.env.ROUND_AMOUNT_THRESHOLD || '1000'), // ₹1,000
    MULTIPLE_ATTEMPTS_THRESHOLD: parseInt(process.env.MULTIPLE_ATTEMPTS_THRESHOLD || '5'),
    SAME_AMOUNT_ATTEMPTS_THRESHOLD: parseInt(process.env.SAME_AMOUNT_THRESHOLD || '10'),
  }
} as const

// Type for configuration keys
export type ConfigKey = keyof typeof CONFIG
export type RateLimitConfigKey = keyof typeof CONFIG.RATE_LIMIT
export type PaymentConfigKey = keyof typeof CONFIG.PAYMENT
export type ValidationConfigKey = keyof typeof CONFIG.VALIDATION
export type UIConfigKey = keyof typeof CONFIG.UI
export type SecurityConfigKey = keyof typeof CONFIG.SECURITY