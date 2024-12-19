import { toast } from 'react-toastify'

export const displayErrorMessagesGFCR = (
  error,
  fallbackMessage = 'Item did not save. An error occurred.',
) => {
  if (!error?.response?.data) {
    toast.error(fallbackMessage)
    return
  }

  const errorData = error.response.data

  Object.entries(errorData).forEach(([field, messages]) => {
    if (Array.isArray(messages)) {
      messages.forEach((message) => {
        toast.error(`Item did not save. ${field}: ${message}`)
      })
    }
  })
}
