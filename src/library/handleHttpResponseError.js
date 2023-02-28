import { toast } from 'react-toastify'
import language from '../language'
import { getToastArguments } from './getToastArguments'

const handleHttpResponseError = ({ error, callback, logoutMermaid }) => {
  if (error) {
    console.error(error)
  }

  const errorStatus = error?.response?.status

  if (errorStatus === 401) {
    // User is unauthorized so logout and redirect to login screen
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
    toast.error(...getToastArguments(language.error[errorStatus]))

    return
  }

  if (callback) {
    // This allows the logic to be extended.
    // If a callback is used, the user will want to
    // consider providing a generic message as well.
    callback()

    return
  }
}

export default handleHttpResponseError
