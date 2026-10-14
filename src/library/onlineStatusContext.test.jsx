import { expect, test, vi } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'
import * as Sentry from '@sentry/react'
import { http, HttpResponse } from 'msw'
import { act, render, waitFor } from '@testing-library/react'
import { OnlineStatusProvider, useOnlineStatus } from './onlineStatusContext'
import mockMermaidApiAllSuccessful from '../testUtilities/mockMermaidApiAllSuccessful'

vi.mock('@sentry/react', () => ({ captureMessage: vi.fn() }))

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

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

test('A failed health check and the browser going offline are reported', async () => {
  mockMermaidApiAllSuccessful.use(http.get(`${apiBaseUrl}/health/`, () => HttpResponse.error()))

  mountProviderAndCaptureStatus()

  await waitFor(() => expect(getReportedReasons()).toContain('health_check_failed'))

  act(() => {
    window.dispatchEvent(new Event('offline'))
  })

  expect(getReportedReasons()).toContain('browser_offline')
})
