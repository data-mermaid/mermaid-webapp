import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import * as Sentry from '@sentry/react'
import { toast } from 'react-toastify'
import { registerServiceWorker } from './registerServiceWorker'

vi.mock('@sentry/react', () => ({ captureException: vi.fn() }))
vi.mock('react-toastify', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-toastify')>()

  return { ...actual, toast: { error: vi.fn(), info: vi.fn() } }
})
vi.mock('../i18n', () => ({
  default: { isInitialized: true, t: (key: string) => key, on: vi.fn() },
}))

const stubServiceWorker = (register: () => Promise<unknown>) => {
  Object.defineProperty(navigator, 'serviceWorker', {
    configurable: true,
    value: { controller: null, addEventListener: vi.fn(), register: vi.fn(register) },
  })
}

// Lets the rejected register() promise run its catch handler
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

let addedLoadListeners: EventListenerOrEventListenerObject[] = []

beforeEach(() => {
  vi.stubEnv('PROD', true)
  const addEventListener = window.addEventListener.bind(window)
  vi.spyOn(window, 'addEventListener').mockImplementation((type, listener, options) => {
    if (type === 'load' && listener) {
      addedLoadListeners.push(listener)
    }
    addEventListener(type, listener, options)
  })
})

afterEach(() => {
  // Each test registers its own load listener, so drop it before the next test fires 'load'
  addedLoadListeners.forEach((listener) => window.removeEventListener('load', listener))
  addedLoadListeners = []
  vi.unstubAllEnvs()
  delete (navigator as { serviceWorker?: unknown }).serviceWorker
  delete (window as { wrsParams?: unknown }).wrsParams
})

test('does not report or show a toast when Googlebot rejects the registration', async () => {
  ;(window as { wrsParams?: unknown }).wrsParams = {}
  stubServiceWorker(() => Promise.reject(new Error('Rejected')))

  registerServiceWorker()
  window.dispatchEvent(new Event('load'))
  await flushPromises()

  expect(navigator.serviceWorker.register).toHaveBeenCalled()
  expect(Sentry.captureException).not.toHaveBeenCalled()
  expect(toast.error).not.toHaveBeenCalled()
})

test('reports a real browser registration failure', async () => {
  const error = new DOMException('Failed to register a ServiceWorker', 'SecurityError')
  stubServiceWorker(() => Promise.reject(error))

  registerServiceWorker()
  window.dispatchEvent(new Event('load'))
  await flushPromises()

  expect(Sentry.captureException).toHaveBeenCalledWith(error, expect.any(Object))
  expect(toast.error).toHaveBeenCalled()
})
