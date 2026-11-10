import * as Sentry from '@sentry/react'
import { toast } from 'react-toastify'
import i18n from '../i18n'
import { getToastArguments } from './library/getToastArguments'

const hasActiveRegistration = async () => {
  try {
    const registration = await navigator.serviceWorker.getRegistration('/')

    return Boolean(registration?.active)
  } catch {
    return false
  }
}

/**
 * Registers the workbox service worker that vite-plugin-pwa emits as service-worker.js.
 *
 * Every register() call starts an update check that fetches the script, so it rejects whenever
 * the network is unavailable, even if a worker is already active. A rejection only means offline
 * support was never set up when there is no active worker and the browser is online. The dev
 * server never emits the worker, so registration is skipped outside production builds.
 */
export const registerServiceWorker = () => {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) {
    return
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js', { scope: '/' }).catch(async (error) => {
      const isActive = await hasActiveRegistration()

      if (isActive || !navigator.onLine) {
        Sentry.addBreadcrumb({
          category: 'service-worker',
          level: 'info',
          message: 'Service worker update check failed',
          data: { hasActiveRegistration: isActive, isNavigatorOnline: navigator.onLine },
        })
        return
      }

      Sentry.captureException(error, {
        extra: {
          isNavigatorOnline: navigator.onLine,
          visibilityState: document.visibilityState,
        },
      })
      // Registration can fail before the translation file has loaded.
      const showToast = () => toast.error(...getToastArguments(i18n.t('offline.setup_failed')))
      if (i18n.isInitialized) {
        showToast()
      } else {
        i18n.on('initialized', showToast)
      }
    })
  })
}
