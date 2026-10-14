import { beforeEach, expect, test, vi } from 'vitest'
import * as Sentry from '@sentry/react'

vi.mock('@sentry/react', () => ({ captureMessage: vi.fn() }))

// Each test gets a fresh module, so reasons reported in one test don't carry into the next
const importReportOfflineSwitch = async () =>
  (await import('./reportOfflineSwitch')).reportOfflineSwitch

beforeEach(() => {
  vi.resetModules()
})

test('reports an offline switch as a warning grouped by its reason', async () => {
  const reportOfflineSwitch = await importReportOfflineSwitch()

  reportOfflineSwitch('request_no_response', { method: 'patch' })

  expect(Sentry.captureMessage).toHaveBeenCalledWith('Collect switched to offline', {
    level: 'warning',
    tags: { offline_reason: 'request_no_response' },
    fingerprint: ['offline-switch', 'request_no_response'],
    extra: { method: 'patch' },
  })
})

test('reports each reason once per page load', async () => {
  const reportOfflineSwitch = await importReportOfflineSwitch()

  reportOfflineSwitch('health_check_failed')
  reportOfflineSwitch('health_check_failed')
  reportOfflineSwitch('browser_offline')

  expect(Sentry.captureMessage).toHaveBeenCalledTimes(2)
})
