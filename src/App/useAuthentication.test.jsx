import { beforeEach, expect, test, vi } from 'vitest'
import * as Sentry from '@sentry/react'
import { useAuth0 } from '@auth0/auth0-react'
import { toast } from 'react-toastify'
import { renderHook, waitFor } from '@testing-library/react'
import useAuthentication from './useAuthentication'
import { mockDocumentCookie } from '../testUtilities/mockDocumentCookie'

vi.mock('@auth0/auth0-react', () => ({ useAuth0: vi.fn() }))
vi.mock('@sentry/react', () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  setUser: vi.fn(),
}))
vi.mock('react-toastify', () => ({ toast: { error: vi.fn() }, Slide: {} }))
vi.mock('react-router', () => ({ useNavigate: () => vi.fn() }))
vi.mock('../library/onlineStatusContext', () => ({
  useOnlineStatus: () => ({ isAppOnline: true }),
}))

beforeEach(() => {
  // Matches the cookie name the hook builds, even when VITE_AUTH0_CLIENT_ID is unset
  const auth0CookieName = `auth0.${import.meta.env.VITE_AUTH0_CLIENT_ID}.is.authenticated=true`

  mockDocumentCookie(`_legacy_${auth0CookieName}; ${auth0CookieName};`)
})

const lockTimeoutError = Object.assign(new Error('Timeout'), { error: 'timeout' })

const renderAuthenticatedHook = (getAccessTokenSilently) => {
  useAuth0.mockReturnValue({
    isAuthenticated: true,
    isLoading: false,
    loginWithRedirect: vi.fn(),
    logout: vi.fn(),
    getAccessTokenSilently,
    user: { sub: 'auth0|user' },
  })

  return renderHook(() =>
    useAuthentication({ dexieCurrentUserInstance: { currentUser: { delete: vi.fn() } } }),
  )
}

test('A token lock timeout is retried and the user is authenticated without an error', async () => {
  const firstCallTimesOut = vi
    .fn()
    .mockRejectedValueOnce(lockTimeoutError)
    .mockResolvedValue('token')

  const { result } = renderAuthenticatedHook(firstCallTimesOut)

  await waitFor(() => expect(result.current.isMermaidAuthenticated).toBe(true))
  await waitFor(() => expect(firstCallTimesOut.mock.calls.length).toBeGreaterThanOrEqual(3))

  expect(Sentry.captureException).not.toHaveBeenCalled()
  expect(Sentry.captureMessage).not.toHaveBeenCalled()
  expect(toast.error).not.toHaveBeenCalled()
})

test('A token lock timeout that also fails on retry is reported as a warning', async () => {
  const alwaysTimesOut = vi.fn().mockRejectedValue(lockTimeoutError)

  const { result } = renderAuthenticatedHook(alwaysTimesOut)

  await waitFor(() =>
    expect(Sentry.captureMessage).toHaveBeenCalledWith('Auth0 token lock timed out twice', {
      level: 'warning',
    }),
  )
  expect(toast.error).toHaveBeenCalled()
  expect(Sentry.captureException).not.toHaveBeenCalled()
  expect(result.current.isMermaidAuthenticated).toBe(false)
})

test('Other token errors are still reported as exceptions', async () => {
  const refreshError = Object.assign(new Error('Missing Refresh Token'), {
    error: 'missing_refresh_token',
  })
  const alwaysFails = vi.fn().mockRejectedValue(refreshError)

  renderAuthenticatedHook(alwaysFails)

  await waitFor(() => expect(Sentry.captureException).toHaveBeenCalledWith(refreshError))
  expect(toast.error).toHaveBeenCalled()
  expect(Sentry.captureMessage).not.toHaveBeenCalled()
})
