// Input validation utilities for API routes
// This file provides comprehensive validation functions to prevent injection attacks and ensure data integrity

import { CONFIG } from './config'

export interface ValidationError {
  field: string
  message: string
}

export class ValidationResult {
  isValid: boolean
  errors: ValidationError[]

  constructor(isValid: boolean = true, errors: ValidationError[] = []) {
    this.isValid = isValid
    this.errors = errors
  }

  addError(field: string, message: string) {
    this.isValid = false
    this.errors.push({ field, message })
  }

  static invalid(errors: ValidationError[]) {
    return new ValidationResult(false, errors)
  }

  static valid() {
    return new ValidationResult(true, [])
  }
}

// Email validation
export function validateEmail(email: string): ValidationResult {
  const result = new ValidationResult()
  
  if (!email || typeof email !== 'string') {
    result.addError('email', 'Email is required')
    return result
  }

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    result.addError('email', 'Invalid email format')
  }

  // Length validation
  if (email.length > CONFIG.VALIDATION.MAX_EMAIL_LENGTH) {
    result.addError('email', 'Email is too long')
  }

  return result
}

// Password validation
export function validatePassword(password: string): ValidationResult {
  const result = new ValidationResult()
  
  if (!password || typeof password !== 'string') {
    result.addError('password', 'Password is required')
    return result
  }

  if (password.length < CONFIG.VALIDATION.MIN_PASSWORD_LENGTH) {
    result.addError('password', `Password must be at least ${CONFIG.VALIDATION.MIN_PASSWORD_LENGTH} characters long`)
  }

  if (password.length > CONFIG.VALIDATION.MAX_PASSWORD_LENGTH) {
    result.addError('password', 'Password is too long')
  }

  // Check for at least one letter and one number
  if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
    result.addError('password', 'Password must contain at least one letter and one number')
  }

  return result
}

// UUID validation
export function validateUUID(id: string): ValidationResult {
  const result = new ValidationResult()
  
  if (!id || typeof id !== 'string') {
    result.addError('id', 'ID is required')
    return result
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id)) {
    result.addError('id', 'Invalid ID format')
  }

  return result
}

// Number validation
export function validateNumber(value: any, min?: number, max?: number): ValidationResult {
  const result = new ValidationResult()
  
  if (value === null || value === undefined) {
    result.addError('number', 'Value is required')
    return result
  }

  const num = Number(value)
  if (isNaN(num) || !isFinite(num)) {
    result.addError('number', 'Value must be a valid number')
    return result
  }

  if (min !== undefined && num < min) {
    result.addError('number', `Value must be at least ${min}`)
  }

  if (max !== undefined && num > max) {
    result.addError('number', `Value must not exceed ${max}`)
  }

  return result
}

// String validation
export function validateString(value: any, minLength?: number, maxLength?: number): ValidationResult {
  const result = new ValidationResult()
  
  if (!value || typeof value !== 'string') {
    result.addError('string', 'Value is required and must be a string')
    return result
  }

  // Trim whitespace for length checks
  const trimmed = value.trim()
  
  if (minLength !== undefined && trimmed.length < minLength) {
    result.addError('string', `Value must be at least ${minLength} characters long`)
  }

  if (maxLength !== undefined && trimmed.length > maxLength) {
    result.addError('string', `Value must not exceed ${maxLength} characters`)
  }

  // Check for potentially harmful content
  if (/<script|javascript:|data:/i.test(value)) {
    result.addError('string', 'Value contains potentially harmful content')
  }

  return result
}

// Payment amount validation
export function validatePaymentAmount(amount: any): ValidationResult {
  const result = validateNumber(amount, CONFIG.VALIDATION.MIN_PAYMENT_AMOUNT, CONFIG.VALIDATION.MAX_PAYMENT_AMOUNT)
  
  if (!result.isValid) {
    return result
  }

  const num = Number(amount)
  
  // Check for reasonable decimal places (max 2)
  if (num * 100 !== Math.floor(num * 100)) {
    result.addError('amount', 'Amount can have at most 2 decimal places')
  }

  return result
}

// Ticket quantity validation
export function validateTicketQuantity(quantity: any): ValidationResult {
  const result = validateNumber(quantity, CONFIG.VALIDATION.MIN_TICKET_QUANTITY, CONFIG.VALIDATION.MAX_TICKET_QUANTITY)
  
  if (!result.isValid) {
    return result
  }

  const num = Number(quantity)
  
  // Must be whole number
  if (!Number.isInteger(num)) {
    result.addError('quantity', 'Ticket quantity must be a whole number')
  }

  return result
}

// Full name validation
export function validateFullName(name: string): ValidationResult {
  const result = validateString(name, CONFIG.VALIDATION.MIN_NAME_LENGTH, CONFIG.VALIDATION.MAX_NAME_LENGTH)
  
  if (!result.isValid) {
    return result
  }

  // Only allow letters, spaces, hyphens, and apostrophes
  if (!/^[a-zA-Z\s\-']+$/.test(name)) {
    result.addError('name', 'Name can only contain letters, spaces, hyphens, and apostrophes')
  }

  return result
}

// Event title validation
export function validateEventTitle(title: string): ValidationResult {
  return validateString(title, CONFIG.VALIDATION.MIN_EVENT_TITLE_LENGTH, CONFIG.VALIDATION.MAX_EVENT_TITLE_LENGTH)
}

// Event description validation
export function validateEventDescription(description: string): ValidationResult {
  return validateString(description, CONFIG.VALIDATION.MIN_EVENT_DESCRIPTION_LENGTH, CONFIG.VALIDATION.MAX_EVENT_DESCRIPTION_LENGTH)
}

// Full name validation
export function validateName(name: string): ValidationResult {
  const result = new ValidationResult()
  
  if (!name || typeof name !== 'string') {
    result.addError('name', 'Name is required')
    return result
  }

  const trimmedName = name.trim()
  
  if (trimmedName.length < 2) {
    result.addError('name', 'Name must be at least 2 characters long')
  }

  if (trimmedName.length > 50) {
    result.addError('name', 'Name must be less than 50 characters')
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-']+$/
  if (!nameRegex.test(trimmedName)) {
    result.addError('name', 'Name can only contain letters, spaces, hyphens, and apostrophes')
  }

  // Check for minimum word count (at least first name)
  const words = trimmedName.split(/\s+/).filter(word => word.length > 0)
  if (words.length < 1) {
    result.addError('name', 'Please enter at least your first name')
  }

  return result
}

// Combined validation helper
export function combineValidationResults(results: ValidationResult[]): ValidationResult {
  const allErrors = results.flatMap(result => result.errors)
  return allErrors.length > 0 ? ValidationResult.invalid(allErrors) : ValidationResult.valid()
}

// Sanitize HTML content
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Sanitize database input
export function sanitizeDbInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  // Remove null bytes and control characters
  return input.replace(/[\x00-\x1F\x7F]/g, '').trim()
}