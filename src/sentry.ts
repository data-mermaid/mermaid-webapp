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
      // Key is stamped onto our bundles by sentryVitePlugin in vite.config.ts.
      // Only drops errors whose frames are *exclusively* third-party, so a
      // crash that passes through our code is still reported.
      Sentry.thirdPartyErrorFilterIntegration({
        filterKeys: ['mermaid-webapp'],
        behaviour: 'drop-error-if-exclusively-contains-third-party-frames',
      }),
    ],
    // Bot and browser-extension noise that exhausted the error budget and caused
    // Sentry to start dropping real events. None originate in this codebase:
    // xbrowser comes from an extension autofill routine, and the Object Not
    // Found message from the CefSharp runtime behind Outlook's link scanner.
    ignoreErrors: [/Object Not Found Matching Id/, /xbrowser is not defined/],
    // Sample 10% of transactions in production; 100% elsewhere for visibility
    tracesSampleRate: import.meta.env.VITE_ENVIRONMENT === 'production' ? 0.1 : 1.0,
  })
}

export { Sentry }
