import React, { type ReactElement } from 'react'
import { Slide, type ToastOptions } from 'react-toastify'

interface ToastContentProps {
  message: string
  testId: string
}

const ToastContent = ({ message, testId }: ToastContentProps) => (
  <div data-testid={testId}>{message}</div>
)

type ToastArguments = [ReactElement, ToastOptions]

/**
 * Get an array of arguments to pass to react-toastify functions. Spread (...) the returned array to pass as arguments to react-toastify function e.g. toast.error(...getToastArguments("toast message"))
 * @param {string} toastMessage The message for the toast to display. Will also be used to add a toastId property to the second argument (a config object).
 * @param {string} [testId='toast'] Optional testId for the toast element. Defaults to 'toast'.
 * @return {[React.ReactElement, {toastId: string, transition: Slide}]} Array containing the toast JSX element as the first element, and a config object as the second element.
 */
export const getToastArguments = (toastMessage: string, testId = 'toast'): ToastArguments => {
  return [
    <ToastContent key={toastMessage} message={toastMessage} testId={testId} />,
    {
      toastId: toastMessage,
      transition: Slide,
    },
  ]
}
