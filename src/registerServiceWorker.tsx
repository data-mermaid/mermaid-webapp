import React from 'react'
import * as Sentry from '@sentry/react'
import { toast } from 'react-toastify'
import { Trans } from 'react-i18next'
import i18n from '../i18n'
import { getToastArguments } from './library/getToastArguments'
import { ButtonPrimary } from './components/generic/buttons'

const NEW_VERSION_TOAST_ID = 'new-version-available'

/**
 * The worker calls skipWaiting() and clientsClaim(), so a new build takes control as soon as it
 * installs. The page that is already open keeps running the bundle it loaded, which is how a tab
 * left open for weeks ends up reporting errors from a months-old release.
 *
 * Reloading on the user's behalf would discard in-progress form entry, which is why
 * injectRegister is null in vite.config.ts. So prompt instead and let them pick the moment.
 */
const promptToReload = () => {
  toast.info(
    <Trans
      i18nKey="toasts.new_version_available"
      components={{
        p: <p />,
        button: <ButtonPrimary type="button" onClick={() => window.location.reload()} />,
      }}
    />,
    { toastId: NEW_VERSION_TOAST_ID, autoClose: false },
  )
}

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

  // A first-ever registration also fires controllerchange once clientsClaim() runs. Reading the
  // controller before registering tells the two cases apart: only a page that already had one is
  // running a superseded build.
  const wasAlreadyControlled = Boolean(navigator.serviceWorker.controller)

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (wasAlreadyControlled) {
      promptToReload()
    }
  })

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js', { scope: '/' }).catch((error) => {
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
