import { toast } from 'react-toastify'
import language from '../language'
import { getToastArguments } from './getToastArguments'

const handleGenericApiErrors = ({ error, callback, logoutMermaid }) => {
  const errorStatus = error?.response?.status

  if (!errorStatus) {
    // If there is a general error which does not have a response status
    if (error) {
      // Don't throw an error. This should only ever encountered if axios is called after the the test is destroyed
      toast.error(...getToastArguments(language.error.generic))
      console.error(error)
    }

    console.error(
      'handleGenericApiErrors needs to have an error object with the schema of error.response.status.',
    )
  }

  const errorStatusesToRespondTo = [401, 403, 500, 502, 503]

  if (errorStatus === 401) {
    // User is unauthorized so logout and redirect to login screen
    if (logoutMermaid) {
      // Log an error to make it clear why redirect has occurred
      console.error('A 401 error occurred. The user is unauthorized.')
      logoutMermaid()
    } else {
      throw new Error(
        'A 401 error occurred. handleGenericApiErrors requires a logoutMermaid function in its config object.',
      )
    }
  }

  // Make sure to only include status codes that would unlikely need a custom message for a given context
  if (errorStatusesToRespondTo.includes(errorStatus)) {
    toast.error(...getToastArguments(language.error[errorStatus]))
  } else if (callback) {
    // This allows for the logic to be extended.
    // If a callback is used, the user will want to
    // consider providing a generic message as well.
    callback()

    return
  }

  // Display a generic error if we haven't returned yet
  toast.error(...getToastArguments(language.error.generic))
}

export default handleGenericApiErrors
