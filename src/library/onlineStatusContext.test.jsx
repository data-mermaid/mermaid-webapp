import { afterEach, expect, test, vi } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'
import * as Sentry from '@sentry/react'
import { http, HttpResponse } from 'msw'
import { act, render, waitFor } from '@testing-library/react'
import { OnlineStatusProvider, useOnlineStatus } from './onlineStatusContext'
import mockMermaidApiAllSuccessful from '../testUtilities/mockMermaidApiAllSuccessful'

vi.mock('@sentry/react', () => ({ captureMessage: vi.fn() }))

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

afterEach(() => {
  vi.useRealTimers()
})

// The retry delay is a few seconds, so tests skip ahead instead of waiting for it
const useFakeTimersThatStillTick = () => vi.useFakeTimers({ shouldAdvanceTime: true })

const getReportedReasons = () =>
  Sentry.captureMessage.mock.calls.map(([, { tags }]) => tags.offline_reason)

const mountProviderAndCaptureStatus = () => {
  const onlineStatus = {}
  const CaptureOnlineStatus = () => {
    Object.assign(onlineStatus, useOnlineStatus())

    return null
  }

  render(
    <OnlineStatusProvider>
      <CaptureOnlineStatus />
    </OnlineStatusProvider>,
  )

  return onlineStatus
}

test('A request with no response reports its method and path', async () => {
  const onlineStatus = mountProviderAndCaptureStatus()

  act(() =>
    onlineStatus.setServerNotReachable({
      code: 'ERR_NETWORK',
      config: { method: 'patch', url: `${apiBaseUrl}/projects/5/images/1/?exclude=data` },
    }),
  )

  expect(Sentry.captureMessage).toHaveBeenCalledWith(
    'Collect switched to offline',
    expect.objectContaining({
      tags: { offline_reason: 'request_no_response' },
      extra: { method: 'patch', url: `${apiBaseUrl}/projects/5/images/1/`, code: 'ERR_NETWORK' },
    }),
  )
  await waitFor(() => expect(onlineStatus.isAppOnline).toBe(false))
})

test('A single failed health check is retried and the app stays online', async () => {
  useFakeTimersThatStillTick()
  let healthCheckCount = 0
  mockMermaidApiAllSuccessful.use(
    http.get(`${apiBaseUrl}/health/`, () => {
      healthCheckCount += 1

      return healthCheckCount === 1 ? HttpResponse.error() : HttpResponse.json({}, { status: 200 })
    }),
  )

  const onlineStatus = mountProviderAndCaptureStatus()

  await waitFor(() => expect(healthCheckCount).toBe(1))
  await act(() => vi.advanceTimersByTimeAsync(5000))
  await waitFor(() => expect(healthCheckCount).toBe(2))

  expect(onlineStatus.isAppOnline).toBe(true)
  expect(Sentry.captureMessage).not.toHaveBeenCalled()
})

test('A tab becoming visible checks the server right away', async () => {
  let healthCheckCount = 0
  mockMermaidApiAllSuccessful.use(
    http.get(`${apiBaseUrl}/health/`, () => {
      healthCheckCount += 1

      return HttpResponse.json({}, { status: 200 })
    }),
  )

  mountProviderAndCaptureStatus()

  await waitFor(() => expect(healthCheckCount).toBe(1))

  act(() => {
    document.dispatchEvent(new Event('visibilitychange'))
  })

  await waitFor(() => expect(healthCheckCount).toBe(2))
})

test('A failed health check and the browser going offline are reported', async () => {
  useFakeTimersThatStillTick()
  let healthCheckCount = 0
  mockMermaidApiAllSuccessful.use(
    http.get(`${apiBaseUrl}/health/`, () => {
      healthCheckCount += 1

      return HttpResponse.error()
    }),
  )

  const onlineStatus = mountProviderAndCaptureStatus()

  await waitFor(() => expect(healthCheckCount).toBe(1))
  expect(getReportedReasons()).not.toContain('health_check_failed')
  expect(onlineStatus.isAppOnline).toBe(true)

  await act(() => vi.advanceTimersByTimeAsync(5000))

  await waitFor(() => expect(getReportedReasons()).toContain('health_check_failed'))
  await waitFor(() => expect(onlineStatus.isAppOnline).toBe(false))
  expect(healthCheckCount).toBe(2)

  act(() => {
    window.dispatchEvent(new Event('offline'))
  })

  expect(getReportedReasons()).toContain('browser_offline')
})
