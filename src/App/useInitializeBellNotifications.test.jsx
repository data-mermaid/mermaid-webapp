import { afterEach, expect, test, vi } from 'vitest'
import React from 'react'
import * as Sentry from '@sentry/react'
import { http, HttpResponse } from 'msw'
import { MemoryRouter } from 'react-router'
import { toast } from 'react-toastify'
import { act, render, waitFor } from '@testing-library/react'
import { OnlineStatusProvider, useOnlineStatus } from '../library/onlineStatusContext'
import handleHttpResponseError from '../library/handleHttpResponseError'
import { NOTIFICATION_POLLING_INTERVAL_MS } from '../library/constants/constants'
import mockMermaidApiAllSuccessful from '../testUtilities/mockMermaidApiAllSuccessful'
import { useInitializeBellNotifications } from './useInitializeBellNotifications'

vi.mock('@sentry/react', () => ({ captureMessage: vi.fn() }))

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

const notification = {
  id: 'notification-1',
  title: 'A notification',
  description: 'Something happened',
  status: 'info',
  created_on: '2026-11-19T12:00:00Z',
}

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

// The poll runs every minute, so tests skip ahead instead of waiting for it
const useFakeTimersThatStillTick = () => vi.useFakeTimers({ shouldAdvanceTime: true })

const mountHookAndCaptureState = ({ logoutMermaid = vi.fn() } = {}) => {
  const state = {}

  // Wired up the same way App.jsx does it
  const UseBellNotifications = () => {
    const { isAppOnline, setServerNotReachable } = useOnlineStatus()
    const handleHttpResponseErrorWithLogoutAndSetServerNotReachableApplied = React.useCallback(
      (options) => handleHttpResponseError({ ...options, logoutMermaid, setServerNotReachable }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    )
    const getAccessToken = React.useCallback(() => Promise.resolve('fake-token'), [])

    const { notifications } = useInitializeBellNotifications({
      apiBaseUrl,
      getAccessToken,
      isMermaidAuthenticated: true,
      isAppOnline,
      handleHttpResponseErrorWithLogoutAndSetServerNotReachableApplied,
    })

    Object.assign(state, { isAppOnline, notifications })

    return null
  }

  render(
    <MemoryRouter>
      <OnlineStatusProvider>
        <UseBellNotifications />
      </OnlineStatusProvider>
    </MemoryRouter>,
  )

  return state
}

const mockNotificationsEndpoint = (respond) => {
  let requestCount = 0
  mockMermaidApiAllSuccessful.use(
    http.get(`${apiBaseUrl}/notifications/`, () => {
      requestCount += 1

      return respond(requestCount)
    }),
  )

  return () => requestCount
}

test('A notifications poll with no response keeps the app online and the next poll succeeds', async () => {
  useFakeTimersThatStillTick()
  const toastErrorSpy = vi.spyOn(toast, 'error')
  const getRequestCount = mockNotificationsEndpoint((requestCount) =>
    requestCount === 1
      ? HttpResponse.error()
      : HttpResponse.json({ results: [notification], next: null }),
  )

  const state = mountHookAndCaptureState()

  await waitFor(() => expect(getRequestCount()).toBe(1))
  await act(() => vi.advanceTimersByTimeAsync(100))

  expect(state.isAppOnline).toBe(true)
  expect(Sentry.captureMessage).not.toHaveBeenCalledWith(
    'Collect switched to offline',
    expect.anything(),
  )
  expect(toastErrorSpy).not.toHaveBeenCalled()

  await act(() => vi.advanceTimersByTimeAsync(NOTIFICATION_POLLING_INTERVAL_MS))

  await waitFor(() => expect(getRequestCount()).toBe(2))
  await waitFor(() => expect(state.notifications).toEqual([notification]))
  expect(state.isAppOnline).toBe(true)
  expect(Sentry.captureMessage).not.toHaveBeenCalled()
})

test('A notifications poll that the API answers with an error still shows a toast', async () => {
  const toastErrorSpy = vi.spyOn(toast, 'error')
  mockNotificationsEndpoint(() => HttpResponse.json({}, { status: 404 }))

  const state = mountHookAndCaptureState()

  await waitFor(() => expect(toastErrorSpy).toHaveBeenCalled())
  expect(state.isAppOnline).toBe(true)
})

test('A notifications poll answered with 401 logs the user out', async () => {
  const logoutMermaid = vi.fn()
  mockNotificationsEndpoint(() => HttpResponse.json({}, { status: 401 }))

  mountHookAndCaptureState({ logoutMermaid })

  await waitFor(() => expect(logoutMermaid).toHaveBeenCalled())
})
