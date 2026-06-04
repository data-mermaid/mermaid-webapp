import { useEffect } from 'react'
import { useLocation, useNavigationType, createRoutesFromChildren, matchRoutes } from 'react-router'
import * as Sentry from '@sentry/react'

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  if (!dsn) {
    return
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.VITE_ENVIRONMENT ?? 'local',
    release: import.meta.env.VITE_APP_VERSION ?? 'unknown',
    integrations: [
      Sentry.reactRouterV7BrowserTracingIntegration({
        useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
    ],
    // Sample 10% of transactions in production; 100% elsewhere for visibility
    tracesSampleRate: import.meta.env.VITE_ENVIRONMENT === 'production' ? 0.1 : 1.0,
  })
}

export { Sentry }
