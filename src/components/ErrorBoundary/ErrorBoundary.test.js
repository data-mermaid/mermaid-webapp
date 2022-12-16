import React, { useEffect } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { debug } from 'jest-preview'
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
  jest.spyOn(console, 'error').mockImplementation(() => { })

  render(
    <ErrorBoundary>
      <ChildComponentWithOneOffError />
    </ErrorBoundary>
  )

  expect(screen.getByText(/A part of this page didn't load correctly./)).toBeInTheDocument()
})

test('ErrorBoundary resets the error message when the try again button is clicked', () => {
  // Surpress the error which will automatically be logged
  jest.spyOn(console, 'error').mockImplementation(() => { })
  render(
    <ErrorBoundary>
      <ChildComponentWithOneOffError />
    </ErrorBoundary>
  )

  expect(screen.getByText(/A part of this page didn't load correctly./)).toBeInTheDocument()
  userEvent.click(screen.queryByRole('button', { name: /Try Again/ }))

  expect(screen.getByText(/Content/)).toBeInTheDocument()
  expect(screen.queryByText(/A part of this page didn't load correctly./)).not.toBeInTheDocument()
})

test('ErrorBoundary removes Try Again button after one failed re-render', () => {
  // Surpress the errors which will automatically be logged
  jest.spyOn(console, 'error').mockImplementation(() => { })

  render(
    <ErrorBoundary>
      <ChildComponentWithPermanentError />
    </ErrorBoundary>
  )

  expect(screen.getByText(/A part of this page didn't load correctly./)).toBeInTheDocument()
  userEvent.click(screen.queryByRole('button', { name: /Try Again/ }))

  expect(screen.getByText(/A part of this page didn't load correctly./)).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: /Try Again/ })).not.toBeInTheDocument()
})
