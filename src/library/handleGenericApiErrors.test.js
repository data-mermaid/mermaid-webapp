import { toast } from 'react-toastify'
import handleGenericApiErrors from './handleGenericApiErrors'

test('handleGenericApiErrors throws if an error object with an improper schema is used', () => {
  const logoutMermaid = jest.fn()

  expect(() =>
    handleGenericApiErrors({ error: { foo: 'not the right schema' }, logoutMermaid }),
  ).toThrow()
})
test('handleGenericApiErrors produces the appropriate toast message if the status is 401', () => {
  const callback = jest.fn()
  const logoutMermaid = jest.fn()

  handleGenericApiErrors({ error: { response: { status: 401 } }, callback, logoutMermaid })

  expect(logoutMermaid).toHaveBeenCalled()
  expect(callback).not.toHaveBeenCalled()
})
test('handleGenericApiErrors produces the appropriate toast message if the status is 403', () => {
  const toastSpy = jest.spyOn(toast, 'error')

  const callback = jest.fn()
  const logoutMermaid = jest.fn()

  handleGenericApiErrors({ error: { response: { status: 403 } }, callback, logoutMermaid })

  expect(toastSpy).toHaveBeenCalledWith(
    'The current user does not have sufficient permission to do that.',
    {
      toastId: 'The current user does not have sufficient permission to do that.',
    },
  )

  expect(callback).not.toHaveBeenCalled()
})
test('handleGenericApiErrors produces the appropriate toast message if the status is 500', () => {
  const toastSpy = jest.spyOn(toast, 'error')

  const callback = jest.fn()
  const logoutMermaid = jest.fn()

  handleGenericApiErrors({ error: { response: { status: 500 } }, callback, logoutMermaid })

  expect(toastSpy).toHaveBeenCalledWith('Something went wrong with the server.', {
    toastId: 'Something went wrong with the server.',
  })

  expect(callback).not.toHaveBeenCalled()
})
test('handleGenericApiErrors produces the appropriate toast message if the status is 502', () => {
  const toastSpy = jest.spyOn(toast, 'error')

  const callback = jest.fn()
  const logoutMermaid = jest.fn()

  handleGenericApiErrors({ error: { response: { status: 502 } }, callback, logoutMermaid })

  expect(toastSpy).toHaveBeenCalledWith('Something went wrong with the server.', {
    toastId: 'Something went wrong with the server.',
  })

  expect(callback).not.toHaveBeenCalled()
})
test('handleGenericApiErrors produces the appropriate toast message if the status is 503', () => {
  const toastSpy = jest.spyOn(toast, 'error')

  const callback = jest.fn()
  const logoutMermaid = jest.fn()

  handleGenericApiErrors({ error: { response: { status: 503 } }, callback, logoutMermaid })

  expect(toastSpy).toHaveBeenCalledWith('Something went wrong with the server.', {
    toastId: 'Something went wrong with the server.',
  })

  expect(callback).not.toHaveBeenCalled()
})
test('handleGenericApiErrors can be extended with a callback function', () => {
  const callback = jest.fn()
  const logoutMermaid = jest.fn()

  handleGenericApiErrors({
    error: { response: { status: 'something that wont be handled in util function logic' } },
    callback,
    logoutMermaid,
  })

  expect(callback).toHaveBeenCalled()
})
test('if no callback is provided handleGenericApiErrors will produce a generic error toast message f', () => {
  const toastSpy = jest.spyOn(toast, 'error')

  const logoutMermaid = jest.fn()

  handleGenericApiErrors({
    error: { response: { status: 'something that wont be handled in util function logic' }, logoutMermaid },
  })

  expect(toastSpy).toHaveBeenCalledWith('Something went wrong.', {
    toastId: 'Something went wrong.',
  })
})

test('If a callback is provided, handleGenericApiErrors will not produce a generic user message for status 400', () => {
  const toastSpy = jest.spyOn(toast, 'error')

  const callback = jest.fn()
  const logoutMermaid = jest.fn()

  handleGenericApiErrors({ error: { response: { status: 400 } }, callback, logoutMermaid })

  expect(toastSpy).not.toHaveBeenCalled()
})
