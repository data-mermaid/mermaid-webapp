import { toast } from 'react-toastify'
import { getToastArguments } from './getToastArguments'
import i18n from '../../i18n'
import { AxiosError } from 'axios'

export interface ApiError extends Error {
  request?: string
  response?: {
    status?: number
    data?: Record<string, unknown>
  }
}

interface HandleHttpResponseErrorProps {
  error: Partial<AxiosError>
  callback: () => unknown
  logoutMermaid?: () => void
  shouldShowServerNonResponseMessage?: boolean
  setServerNotReachable?: () => void
}

const handleHttpResponseError = ({
  error,
  callback,
  logoutMermaid,
  shouldShowServerNonResponseMessage = true,
  setServerNotReachable,
}: HandleHttpResponseErrorProps) => {
  if (error) {
    console.error(error)
  }
  const requestWasMadeWithNoResponse = error?.request && !error?.response

  if (requestWasMadeWithNoResponse) {
    if (shouldShowServerNonResponseMessage) {
      toast.error(...getToastArguments(i18n.t('api_errors.no_server_response')))
    }

    setServerNotReachable()
    callback?.()

    return
  }

  const errorStatus = error?.response?.status

  if (errorStatus === 401) {
    // User is unauthorized --> logout and redirect to login screen
    if (logoutMermaid) {
      // Log an error to make it clear why redirect has occurred
      console.error('A 401 error occurred. The user is unauthorized.')
      logoutMermaid()
    } else {
      throw new Error(
        'A 401 error occurred. handleHttpResponseError requires a logoutMermaid function in its config object.',
      )
    }

    return
  }

  const otherErrorStatusesToRespondTo = [403, 500, 502, 503]

  // Make sure to only include status codes that need a custom message for a given context
  if (otherErrorStatusesToRespondTo.includes(errorStatus)) {
    let errorMessage = i18n.t('api_errors.unspecified_error')
    if (errorStatus === 403) {
      errorMessage = i18n.t('api_errors.unauthorized_user')
    }
    toast.error(...getToastArguments(errorMessage))

    return
  }

  if (callback) {
    // This allows the logic to be extended in the
    // scenario where one of the above error conditions isnt met
    // If a callback is used, the user will want to
    // consider providing a generic message as well.
    callback()

    return
  }
}

export default handleHttpResponseError
