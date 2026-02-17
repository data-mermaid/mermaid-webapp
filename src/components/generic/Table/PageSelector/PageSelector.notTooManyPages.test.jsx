import { expect, test } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'
import {
  fireEvent,
  renderAuthenticatedOnline,
  screen,
  waitFor,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import PageSelector from './PageSelector'

test('PageSelector with 8 or less pages renders as expected', () => {
  renderAuthenticatedOnline(
    <PageSelector
      currentPageIndex={0}
      nextDisabled={false}
      onGoToPage={() => {}}
      onNextClick={() => {}}
      onPreviousClick={() => {}}
      pageCount={8}
      previousDisabled={false}
    />,
  )

  expect(screen.getByRole('button', { name: /back/i })).toBeEnabled()
  expect(screen.getByRole('button', { name: /next/i })).toBeEnabled()
  expect(screen.getByText('1'))
  expect(screen.getByText('2'))
  expect(screen.getByText('3'))
  expect(screen.getByText('4'))
  expect(screen.getByText('5'))
  expect(screen.getByText('6'))
  expect(screen.getByText('7'))
  expect(screen.getByText('8'))
})

test('PageSelector with 8 or less pages indicates current page', () => {
  renderAuthenticatedOnline(
    <PageSelector
      currentPageIndex={1}
      nextDisabled={false}
      onGoToPage={() => {}}
      onNextClick={() => {}}
      onPreviousClick={() => {}}
      pageCount={8}
      previousDisabled={false}
    />,
  )

  expect(screen.getByText('1')).not.toHaveAttribute('aria-current', 'true')
  expect(screen.getByText('2')).toHaveAttribute('aria-current', 'true')
  expect(screen.getByText('3')).not.toHaveAttribute('aria-current', 'true')
  expect(screen.getByText('4')).not.toHaveAttribute('aria-current', 'true')
  expect(screen.getByText('5')).not.toHaveAttribute('aria-current', 'true')
  expect(screen.getByText('6')).not.toHaveAttribute('aria-current', 'true')
  expect(screen.getByText('7')).not.toHaveAttribute('aria-current', 'true')
  expect(screen.getByText('8')).not.toHaveAttribute('aria-current', 'true')
})
test('PageSelector with 8 or less pages shows the next and previous buttons as being disabled', () => {
  renderAuthenticatedOnline(
    <PageSelector
      currentPageIndex={1}
      nextDisabled
      onGoToPage={() => {}}
      onNextClick={() => {}}
      onPreviousClick={() => {}}
      pageCount={8}
      previousDisabled
    />,
  )

  expect(screen.getByRole('button', { name: /back/i })).toBeDisabled()
  expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
})
test('PageSelector with 8 or less pages calls onGoToPage with the correct page when a page button is clicked', () => {
  const mockFunction = vi.fn()

  renderAuthenticatedOnline(
    <PageSelector
      currentPageIndex={1}
      nextDisabled
      onGoToPage={mockFunction}
      onNextClick={() => {}}
      onPreviousClick={() => {}}
      pageCount={8}
      previousDisabled
    />,
  )

  expect(mockFunction).not.toHaveBeenCalled()

  fireEvent.click(screen.getByText('1'))
  expect(mockFunction).toHaveBeenCalledWith(0)

  fireEvent.click(screen.getByText('5'))
  expect(mockFunction).toHaveBeenCalledWith(4)

  fireEvent.click(screen.getByText('8'))
  expect(mockFunction).toHaveBeenCalledWith(7)
})
test('PageSelector with 8 or less pages calls onNextClick when the next button is clicked', async () => {
  const mockFunction = vi.fn()

  renderAuthenticatedOnline(
    <PageSelector
      currentPageIndex={1}
      nextDisabled={false}
      onGoToPage={() => {}}
      onNextClick={mockFunction}
      onPreviousClick={() => {}}
      pageCount={8}
      previousDisabled={false}
    />,
  )

  expect(mockFunction).not.toHaveBeenCalled()

  fireEvent.click(screen.getByRole('button', { name: /next/i }))
  await waitFor(() => expect(mockFunction).toHaveBeenCalledTimes(1))
})

test('PageSelector with 8 or less pages calls onPreviousClick when the next button is clicked', () => {
  const mockFunction = vi.fn()

  renderAuthenticatedOnline(
    <PageSelector
      currentPageIndex={1}
      nextDisabled={false}
      onGoToPage={() => {}}
      onNextClick={() => {}}
      onPreviousClick={mockFunction}
      pageCount={8}
      previousDisabled={false}
    />,
  )

  expect(mockFunction).not.toHaveBeenCalled()

  fireEvent.click(screen.getByRole('button', { name: /back/i }))
  expect(mockFunction).toHaveBeenCalledTimes(1)
})
