import React, { useEffect } from 'react'
import { render, screen, waitFor } from '@testing-library/react'

import userEvent from '@testing-library/user-event'
import ErrorBoundary from './ErrorBoundary'

const ChildComponentWithOneOffError = () => {
  // Throw an error on the initial render
  useEffect(() => {
    throw new Error('Error!')
  }, [])

  return <p>Content</p>
}

const ChildComponentWithPermanentError = () => {
  throw new Error('Error!')
}

test('ErrorBoundary renders children when no error is thrown', () => {
  const children = <p>Child component content</p>

  render(<ErrorBoundary>{children}</ErrorBoundary>)

  expect(screen.getByText('Child component content')).toBeInTheDocument()
})

test('ErrorBoundary renders the fallback UI when an error is thrown', () => {
  // Surpress the error which will automatically be logged
  jest.spyOn(console, 'error').mockImplementation(() => {})

  render(
    <ErrorBoundary>
      <ChildComponentWithOneOffError />
    </ErrorBoundary>,
  )

  expect(screen.getByText(/A part of this page did not load correctly./)).toBeInTheDocument()
})

test('ErrorBoundary does not display the Try Again button after the Try Again button is clicked', async () => {
  // Surpress the error which will automatically be logged
  jest.spyOn(console, 'error').mockImplementation(() => {})
  const user = userEvent.setup()

  render(
    <ErrorBoundary>
      <ChildComponentWithOneOffError />
    </ErrorBoundary>,
  )

  expect(screen.getByText(/A part of this page did not load correctly./)).toBeInTheDocument()
  await waitFor(() => expect(screen.queryByText(/Content/)).not.toBeInTheDocument())
  await user.click(screen.queryByRole('button', { name: /Try Again/ }))

  expect(screen.queryByText(/Try Again/)).not.toBeInTheDocument()
  await waitFor(() => expect(screen.queryByText(/Content/)).not.toBeInTheDocument())
})

test('ErrorBoundary removes Try Again button after one failed re-render', async () => {
  // Surpress the errors which will automatically be logged
  jest.spyOn(console, 'error').mockImplementation(() => {})

  const user = userEvent.setup()

  render(
    <ErrorBoundary>
      <ChildComponentWithPermanentError />
    </ErrorBoundary>,
  )

  expect(screen.getByText(/A part of this page did not load correctly./)).toBeInTheDocument()
  await user.click(screen.queryByRole('button', { name: /Try Again/ }))

  expect(screen.getByText(/A part of this page did not load correctly./)).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: /Try Again/ })).not.toBeInTheDocument()
})
