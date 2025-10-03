'use client'

import { ReactNode } from 'react'
import ErrorBoundary from './ErrorBoundary'
import { logError } from '@/lib/error-logging'

interface ClientLayoutProps {
  children: ReactNode
}

export default function ClientErrorWrapper({ children }: ClientLayoutProps) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        logError(error, {
          additionalInfo: {
            componentStack: errorInfo.componentStack,
            errorBoundary: 'GlobalLayoutBoundary'
          }
        })
      }}
    >
      {children}
    </ErrorBoundary>
  )
}