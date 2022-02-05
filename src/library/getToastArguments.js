/**
 * Get an array of arguments to pass to react-toastify functions. Spread (...) the returned array to pass as arguments to react-toastify function e.g. toast.error(...getToastArguments("toast message"))
 * @param {string} toastMessage The message for the toast to display. Will also be used to add a toastId property to the second argument (a config object).
 * @return {[string, {toastId: string}]} Array containing the toast message as the first element, and an object with a toastId property as the second element.
 */
export const getToastArguments = (toastMessage) => {
  return ([
    toastMessage,
    { toastId: toastMessage }
  ])
}
