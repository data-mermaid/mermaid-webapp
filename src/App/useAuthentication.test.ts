import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import useAuthentication from './useAuthentication'

const mocks = vi.hoisted(() => ({
  getAccessTokenSilently: vi.fn(),
  loginWithRedirect: vi.fn(),
  captureException: vi.fn(),
  toastError: vi.fn(),
}))

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    isAuthenticated: true,
    isLoading: false,
    loginWithRedirect: mocks.loginWithRedirect,
    logout: vi.fn(),
    getAccessTokenSilently: mocks.getAccessTokenSilently,
  }),
}))
vi.mock('@sentry/react', () => ({ captureException: mocks.captureException }))
vi.mock('react-toastify', () => ({ toast: { error: mocks.toastError } }))
vi.mock('react-router', () => ({ useNavigate: () => vi.fn() }))
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }))
vi.mock('../library/onlineStatusContext', () => ({
  useOnlineStatus: () => ({ isAppOnline: true }),
}))

const auth0Cookie = `auth0.${import.meta.env.VITE_AUTH0_CLIENT_ID}.is.authenticated`
const dexieCurrentUserInstance = { currentUser: { delete: vi.fn() } }

const authError = (code: string) => Object.assign(new Error(code), { error: code })

describe('useAuthentication', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    document.cookie = 'other=1'
    document.cookie = `${auth0Cookie}=true`
  })

  afterEach(() => {
    document.cookie = `${auth0Cookie}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    document.cookie = 'other=; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  test('redirects to login instead of reporting when the refresh token is missing', async () => {
    mocks.getAccessTokenSilently.mockRejectedValue(authError('missing_refresh_token'))

    renderHook(() => useAuthentication({ dexieCurrentUserInstance }))

    await waitFor(() => expect(mocks.loginWithRedirect).toHaveBeenCalled())
    expect(mocks.captureException).not.toHaveBeenCalled()
    expect(mocks.toastError).not.toHaveBeenCalled()
  })

  test('getAccessToken redirects to login when a fresh login is required', async () => {
    mocks.getAccessTokenSilently.mockResolvedValueOnce('token').mockResolvedValueOnce('token')

    const { result } = renderHook(() => useAuthentication({ dexieCurrentUserInstance }))

    await waitFor(() => expect(result.current.isMermaidAuthenticated).toBe(true))
    mocks.loginWithRedirect.mockClear()

    mocks.getAccessTokenSilently.mockRejectedValueOnce(authError('login_required'))

    await expect(result.current.getAccessToken()).rejects.toThrow('login_required')
    expect(mocks.loginWithRedirect).toHaveBeenCalledTimes(1)
  })

  test('reports other token errors to Sentry without redirecting', async () => {
    mocks.getAccessTokenSilently.mockRejectedValue(new Error('network'))

    renderHook(() => useAuthentication({ dexieCurrentUserInstance }))

    await waitFor(() => expect(mocks.captureException).toHaveBeenCalled())
    expect(mocks.loginWithRedirect).not.toHaveBeenCalled()
  })
})
