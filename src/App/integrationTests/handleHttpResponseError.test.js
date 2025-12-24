import { toast, Slide } from 'react-toastify'
import handleHttpResponseError from '../../library/handleHttpResponseError.ts'
describe('handleHttpResponseError', () => {
  test('handleHttpResponseError produces the appropriate toast message if the status is 401', () => {
    const callback = jest.fn()
    const logoutMermaid = jest.fn()

    handleHttpResponseError({ error: { response: { status: 401 } }, callback, logoutMermaid })

    expect(logoutMermaid).toHaveBeenCalled()
    expect(callback).not.toHaveBeenCalled()
  })
  test('handleHttpResponseError produces the appropriate toast message if the status is 403', () => {
    const toastSpy = jest.spyOn(toast, 'error')

    const callback = jest.fn()
    const logoutMermaid = jest.fn()

    handleHttpResponseError({ error: { response: { status: 403 } }, callback, logoutMermaid })

    expect(toastSpy).toHaveBeenCalledWith('api_errors.unauthorized_user', {
      toastId: 'api_errors.unauthorized_user',
      transition: Slide,
    })

    expect(callback).not.toHaveBeenCalled()
  })
  test('handleHttpResponseError produces the appropriate toast message if the status is 500', () => {
    const toastSpy = jest.spyOn(toast, 'error')

    const callback = jest.fn()
    const logoutMermaid = jest.fn()

    handleHttpResponseError({ error: { response: { status: 500 } }, callback, logoutMermaid })

    expect(toastSpy).toHaveBeenCalledWith('api_errors.unspecified_error', {
      toastId: 'api_errors.unspecified_error',
      transition: Slide,
    })

    expect(callback).not.toHaveBeenCalled()
  })
  test('handleHttpResponseError produces the appropriate toast message if the status is 502', () => {
    const toastSpy = jest.spyOn(toast, 'error')

    const callback = jest.fn()
    const logoutMermaid = jest.fn()

    handleHttpResponseError({ error: { response: { status: 502 } }, callback, logoutMermaid })

    expect(toastSpy).toHaveBeenCalledWith('api_errors.unspecified_error', {
      toastId: 'api_errors.unspecified_error',
      transition: Slide,
    })

    expect(callback).not.toHaveBeenCalled()
  })
  test('handleHttpResponseError produces the appropriate toast message if the status is 503', () => {
    const toastSpy = jest.spyOn(toast, 'error')

    const callback = jest.fn()
    const logoutMermaid = jest.fn()

    handleHttpResponseError({ error: { response: { status: 503 } }, callback, logoutMermaid })

    expect(toastSpy).toHaveBeenCalledWith('api_errors.unspecified_error', {
      toastId: 'api_errors.unspecified_error',
      transition: Slide,
    })

    expect(callback).not.toHaveBeenCalled()
  })
  test('handleHttpResponseError can be extended with a callback function', () => {
    const callback = jest.fn()
    const logoutMermaid = jest.fn()

    handleHttpResponseError({
      error: { response: { status: 'something that wont be handled in util function logic' } },
      callback,
      logoutMermaid,
    })

    expect(callback).toHaveBeenCalled()
  })
  test('if there is an error, it will be logged to console.error', () => {
    const consoleSpy = jest.spyOn(console, 'error')

    const logoutMermaid = jest.fn()

    handleHttpResponseError({
      error: 'the provided error',
      logoutMermaid,
    })

    expect(consoleSpy).toHaveBeenCalledWith('the provided error')
  })

  test('If a callback is provided, handleHttpResponseError will not produce a generic user message for status 400', () => {
    const toastSpy = jest.spyOn(toast, 'error')

    const callback = jest.fn()
    const logoutMermaid = jest.fn()

    handleHttpResponseError({ error: { response: { status: 400 } }, callback, logoutMermaid })

    expect(toastSpy).not.toHaveBeenCalled()
  })
})
