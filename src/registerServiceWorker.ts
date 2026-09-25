import * as Sentry from '@sentry/react'
import { toast } from 'react-toastify'
import i18n from '../i18n'
import { getToastArguments } from './library/getToastArguments'

/**
 * Registers the workbox service worker that vite-plugin-pwa emits as service-worker.js.
 *
 * The browser only fetches the script when it has no active worker for this scope, so a
 * rejection here means offline support was never set up in this browser. The dev server never
 * emits the worker, so registration is skipped outside production builds.
 */
export const registerServiceWorker = () => {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) {
    return
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js', { scope: '/' }).catch((error) => {
      Sentry.captureException(error, {
        extra: {
          isNavigatorOnline: navigator.onLine,
          visibilityState: document.visibilityState,
        },
      })
      toast.error(...getToastArguments(i18n.t('offline.setup_failed')))
    })
  })
}
