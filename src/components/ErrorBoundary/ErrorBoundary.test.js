import React, { useEffect } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ErrorBoundary from './ErrorBoundary'

test('ErrorBoundary renders children when no error is thrown', () => {
  const children = <p>Child component content</p>

  render(<ErrorBoundary>{children}</ErrorBoundary>)

  expect(screen.getByText('Child component content')).toBeInTheDocument()
})

const ChildComponentWithError = () => {
  // Throw an error on the initial render
  useEffect(() => {
    throw new Error('Error!')
  }, [])

  return <p>Content</p>
}

test('ErrorBoundary renders the fallback UI when an error is thrown', () => {
  // Surpress the error which will automatically be logged
  jest.spyOn(console, 'error').mockImplementation(() => { })

  render(
    <ErrorBoundary>
      <ChildComponentWithError />
    </ErrorBoundary>
  )

  expect(screen.getByText(/Something went wrong/)).toBeInTheDocument()
})

test('ErrorBoundary resets the error message when the try again button is clicked', () => {
  // Surpress the error which will automatically be logged
  jest.spyOn(console, 'error').mockImplementation(() => { })

  render(
    <ErrorBoundary>
      <ChildComponentWithError />
    </ErrorBoundary>
  )

  expect(screen.getByText(/Something went wrong/)).toBeInTheDocument()

  userEvent.click(screen.getByRole('button', { name: /Try again/ }))

  expect(screen.getByText(/Content/)).toBeInTheDocument()
  expect(screen.queryByText(/Something went wrong/)).not.toBeInTheDocument()
})
