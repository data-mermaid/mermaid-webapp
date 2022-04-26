import { toast } from 'react-toastify'
import language from '../language'
import { getToastArguments } from './getToastArguments'

const communicateGenericApiErrorsToUser = ({ error, callback }) => {
  const errorStatus = error?.response?.status

  if (!errorStatus) {
    throw new Error(
      'communicateGenericApiErrorsToUser needs to have an error object with the schema of error.response.status.',
    )
  }
  // make sure to only include status codes that would unlikely need a custom message for a given context
  if (
    errorStatus === 401 ||
    errorStatus === 403 ||
    errorStatus === 500 ||
    errorStatus === 502 ||
    errorStatus === 503
  ) {
    toast.error(...getToastArguments(language.error[errorStatus]))
  } else if (callback) {
    // this allows for the logic to be extended.
    // If a callback is used, the user will want to
    // consider providing a generic message as well.
    callback()
  } else {
    toast.error(...getToastArguments(language.error.generic))
  }
}

export default communicateGenericApiErrorsToUser
