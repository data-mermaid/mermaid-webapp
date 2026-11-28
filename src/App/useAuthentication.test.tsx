import { beforeEach, expect, test, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAuth0 } from '@auth0/auth0-react'
import { toast } from 'react-toastify'
import * as Sentry from '@sentry/react'
import useAuthentication, { isNetworkError } from './useAuthentication'

vi.mock('@auth0/auth0-react', () => ({ useAuth0: vi.fn() }))
vi.mock('@sentry/react', () => ({
  addBreadcrumb: vi.fn(),
  captureException: vi.fn(),
  setUser: vi.fn(),
}))
vi.mock('react-toastify', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-toastify')>()),
  toast: { error: vi.fn() },
}))
vi.mock('react-router', () => ({ useNavigate: () => vi.fn() }))
vi.mock('../library/onlineStatusContext', () => ({
  useOnlineStatus: () => ({ isAppOnline: true }),
}))

const dexieCurrentUserInstance = { currentUser: { delete: vi.fn() } }

const mountWithTokenError = (error: unknown) => {
  const getAccessTokenSilently = vi.fn().mockRejectedValue(error)

  vi.mocked(useAuth0).mockReturnValue({
    isAuthenticated: true,
    isLoading: false,
    loginWithRedirect: vi.fn(),
    logout: vi.fn(),
    getAccessTokenSilently,
    user: { sub: 'auth0|test' },
  } as unknown as ReturnType<typeof useAuth0>)

  renderHook(() => useAuthentication({ dexieCurrentUserInstance }))

  return getAccessTokenSilently
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

test('a network failure refreshing the token is not reported to Sentry or shown to the user', async () => {
  const getAccessTokenSilently = mountWithTokenError(new TypeError('Failed to fetch'))

  await waitFor(() => expect(Sentry.addBreadcrumb).toHaveBeenCalled())

  expect(getAccessTokenSilently).toHaveBeenCalled()
  expect(Sentry.captureException).not.toHaveBeenCalled()
  expect(toast.error).not.toHaveBeenCalled()
})

test('other token errors are still reported to Sentry and shown to the user', async () => {
  const error = new Error('invalid_grant')
  mountWithTokenError(error)

  await waitFor(() => expect(Sentry.captureException).toHaveBeenCalledWith(error))

  expect(toast.error).toHaveBeenCalled()
  expect(Sentry.addBreadcrumb).not.toHaveBeenCalled()
})

test('isNetworkError recognises the fetch failure message of each browser', () => {
  expect(isNetworkError(new TypeError('Failed to fetch'))).toBe(true)
  expect(isNetworkError(new TypeError('NetworkError when attempting to fetch resource.'))).toBe(
    true,
  )
  expect(isNetworkError(new TypeError('Load failed'))).toBe(true)
})

test('isNetworkError rejects errors that only look like network failures', () => {
  expect(isNetworkError(new Error('Failed to fetch'))).toBe(false)
  expect(isNetworkError(new TypeError('Cannot read properties of undefined'))).toBe(false)
  expect(isNetworkError(new Error('Timeout'))).toBe(false)
  expect(isNetworkError('Failed to fetch')).toBe(false)
})
