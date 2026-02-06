import '@testing-library/jest-dom'

import React from 'react'
import {
  renderAuthenticatedOnline,
  screen,
  waitFor,
} from '../../../../testUtilities/testingLibraryWithHelpers'

import PageSelector from './PageSelector'

test('PageSelector with more than 8 pages renders as expected when the current page index is not near a ellipses', () => {
  renderAuthenticatedOnline(
    <PageSelector
      currentPageIndex={0}
      nextDisabled={false}
      onGoToPage={() => {}}
      onNextClick={() => {}}
      onPreviousClick={() => {}}
      pageCount={9}
      previousDisabled={false}
    />,
  )

  expect(screen.getByRole('button', { name: /back/i })).toBeEnabled()
  expect(screen.getByRole('button', { name: /next/i })).toBeEnabled()
  expect(screen.getByText('1'))
  expect(screen.getByText('2'))
  expect(screen.getByText('3'))
  expect(screen.getByText('...'))

  expect(screen.getByText('9'))

  expect(screen.queryByText('4')).not.toBeInTheDocument()
  expect(screen.queryByText('5')).not.toBeInTheDocument()
  expect(screen.queryByText('6')).not.toBeInTheDocument()
  expect(screen.queryByText('7')).not.toBeInTheDocument()
  expect(screen.queryByText('8')).not.toBeInTheDocument()
})

test('PageSelector with more than 8 pages indicates current page', () => {
  renderAuthenticatedOnline(
    <PageSelector
      currentPageIndex={0}
      nextDisabled={false}
      onGoToPage={() => {}}
      onNextClick={() => {}}
      onPreviousClick={() => {}}
      pageCount={9}
      previousDisabled={false}
    />,
  )

  expect(screen.getByText('1')).toHaveAttribute('aria-current', 'true')
  expect(screen.getByText('2')).not.toHaveAttribute('aria-current', 'true')
  expect(screen.getByText('3')).not.toHaveAttribute('aria-current', 'true')
  expect(screen.getByText('9')).not.toHaveAttribute('aria-current', 'true')
})
test('PageSelector with more than 8 pages shows the next and previous buttons as being disabled', () => {
  renderAuthenticatedOnline(
    <PageSelector
      currentPageIndex={1}
      nextDisabled
      onGoToPage={() => {}}
      onNextClick={() => {}}
      onPreviousClick={() => {}}
      pageCount={9}
      previousDisabled
    />,
  )

  expect(screen.getByRole('button', { name: /back/i })).toBeDisabled()
  expect(screen.getByRole('button', { name: /next/i })).toBeDisabled()
})
test('PageSelector with more than 8 pages calls onGoToPage with the correct page when a page button is clicked', async () => {
  const mockFunction = vi.fn()()

  const { user } = renderAuthenticatedOnline(
    <PageSelector
      currentPageIndex={1}
      nextDisabled
      onGoToPage={mockFunction}
      onNextClick={() => {}}
      onPreviousClick={() => {}}
      pageCount={9}
      previousDisabled
    />,
  )

  expect(mockFunction).not.toHaveBeenCalled()

  await user.click(screen.getByText('1'))
  expect(mockFunction).toHaveBeenCalledWith(0)

  await user.click(screen.getByText('9'))
  expect(mockFunction).toHaveBeenCalledWith(8)
})
test('PageSelector with more than 8 pages calls onNextClick when the next button is clicked', async () => {
  const mockFunction = vi.fn()()

  const { user } = renderAuthenticatedOnline(
    <PageSelector
      currentPageIndex={1}
      nextDisabled={false}
      onGoToPage={() => {}}
      onNextClick={mockFunction}
      onPreviousClick={() => {}}
      pageCount={9}
      previousDisabled={false}
    />,
  )

  expect(mockFunction).not.toHaveBeenCalled()

  await user.click(screen.getByRole('button', { name: /next/i }))

  await waitFor(() => expect(mockFunction).toHaveBeenCalledTimes(1))
})

test('PageSelector with more than 8 pages calls onPreviousClick when the next button is clicked', async () => {
  const mockFunction = vi.fn()()

  const { user } = renderAuthenticatedOnline(
    <PageSelector
      currentPageIndex={1}
      nextDisabled={false}
      onGoToPage={() => {}}
      onNextClick={() => {}}
      onPreviousClick={mockFunction}
      pageCount={9}
      previousDisabled={false}
    />,
  )

  expect(mockFunction).not.toHaveBeenCalled()

  await user.click(screen.getByRole('button', { name: /back/i }))

  expect(mockFunction).toHaveBeenCalledTimes(1)
})

test('PageSelector with more than 8 pages renders as expected when the current page is 2', () => {
  renderAuthenticatedOnline(
    <PageSelector
      currentPageIndex={1}
      nextDisabled={false}
      onGoToPage={() => {}}
      onNextClick={() => {}}
      onPreviousClick={() => {}}
      pageCount={9}
      previousDisabled={false}
    />,
  )

  expect(screen.getByRole('button', { name: /back/i })).toBeEnabled()
  expect(screen.getByRole('button', { name: /next/i })).toBeEnabled()
  expect(screen.getByText('1'))
  expect(screen.getByText('2'))
  expect(screen.getByText('3'))
  expect(screen.getByText('4'))
  expect(screen.getByText('...'))
  expect(screen.getByText('9'))

  expect(screen.queryByText('5')).not.toBeInTheDocument()
  expect(screen.queryByText('6')).not.toBeInTheDocument()
  expect(screen.queryByText('7')).not.toBeInTheDocument()
  expect(screen.queryByText('8')).not.toBeInTheDocument()
})

test('PageSelector with more than 8 pages renders as expected when the current page is 3', () => {
  renderAuthenticatedOnline(
    <PageSelector
      currentPageIndex={2}
      nextDisabled={false}
      onGoToPage={() => {}}
      onNextClick={() => {}}
      onPreviousClick={() => {}}
      pageCount={9}
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
  expect(screen.getByText('...'))
  expect(screen.getByText('9'))

  expect(screen.queryByText('6')).not.toBeInTheDocument()
  expect(screen.queryByText('7')).not.toBeInTheDocument()
  expect(screen.queryByText('8')).not.toBeInTheDocument()
})

test('PageSelector with more than 8 pages renders as expected when the current page is 4', () => {
  renderAuthenticatedOnline(
    <PageSelector
      currentPageIndex={3}
      nextDisabled={false}
      onGoToPage={() => {}}
      onNextClick={() => {}}
      onPreviousClick={() => {}}
      pageCount={9}
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
  expect(screen.getByText('...'))
  expect(screen.getByText('9'))

  expect(screen.queryByText('7')).not.toBeInTheDocument()
  expect(screen.queryByText('8')).not.toBeInTheDocument()
})

test('PageSelector with more than 8 pages renders as expected when the current page is 5', () => {
  renderAuthenticatedOnline(
    <PageSelector
      currentPageIndex={4}
      nextDisabled={false}
      onGoToPage={() => {}}
      onNextClick={() => {}}
      onPreviousClick={() => {}}
      pageCount={9}
      previousDisabled={false}
    />,
  )

  expect(screen.getByRole('button', { name: /back/i })).toBeEnabled()
  expect(screen.getByRole('button', { name: /next/i })).toBeEnabled()
  expect(screen.getByText('1'))
  expect(screen.getByText('3'))
  expect(screen.getByText('4'))
  expect(screen.getByText('5'))
  expect(screen.getByText('6'))
  expect(screen.getByText('7'))
  expect(screen.getByText('9'))

  expect(screen.queryByText('2')).not.toBeInTheDocument()
  expect(screen.queryByText('8')).not.toBeInTheDocument()

  expect(screen.getAllByText('...').length).toEqual(2)
})

test('PageSelector with more than 8 pages renders as expected when the current page is 6', () => {
  renderAuthenticatedOnline(
    <PageSelector
      currentPageIndex={5}
      nextDisabled={false}
      onGoToPage={() => {}}
      onNextClick={() => {}}
      onPreviousClick={() => {}}
      pageCount={9}
      previousDisabled={false}
    />,
  )

  expect(screen.getByRole('button', { name: /back/i })).toBeEnabled()
  expect(screen.getByRole('button', { name: /next/i })).toBeEnabled()
  expect(screen.getByText('1'))
  expect(screen.getByText('4'))
  expect(screen.getByText('5'))
  expect(screen.getByText('6'))
  expect(screen.getByText('7'))
  expect(screen.getByText('8'))
  expect(screen.getByText('9'))

  expect(screen.queryByText('2')).not.toBeInTheDocument()
  expect(screen.queryByText('3')).not.toBeInTheDocument()

  expect(screen.getAllByText('...').length).toEqual(1)
})

test('PageSelector with more than 8 pages renders as expected when the current page is 7', () => {
  renderAuthenticatedOnline(
    <PageSelector
      currentPageIndex={6}
      nextDisabled={false}
      onGoToPage={() => {}}
      onNextClick={() => {}}
      onPreviousClick={() => {}}
      pageCount={9}
      previousDisabled={false}
    />,
  )

  expect(screen.getByRole('button', { name: /back/i })).toBeEnabled()
  expect(screen.getByRole('button', { name: /next/i })).toBeEnabled()

  expect(screen.getByText('1'))
  expect(screen.getByText('5'))
  expect(screen.getByText('6'))
  expect(screen.getByText('7'))
  expect(screen.getByText('8'))
  expect(screen.getByText('9'))

  expect(screen.queryByText('2')).not.toBeInTheDocument()
  expect(screen.queryByText('3')).not.toBeInTheDocument()
  expect(screen.queryByText('4')).not.toBeInTheDocument()

  expect(screen.getAllByText('...').length).toEqual(1)
})

test('PageSelector with more than 8 pages renders as expected when the current page is 8', () => {
  renderAuthenticatedOnline(
    <PageSelector
      currentPageIndex={7}
      nextDisabled={false}
      onGoToPage={() => {}}
      onNextClick={() => {}}
      onPreviousClick={() => {}}
      pageCount={9}
      previousDisabled={false}
    />,
  )

  expect(screen.getByRole('button', { name: /back/i })).toBeEnabled()
  expect(screen.getByRole('button', { name: /next/i })).toBeEnabled()
  expect(screen.getByText('1'))
  expect(screen.getByText('6'))
  expect(screen.getByText('7'))
  expect(screen.getByText('8'))
  expect(screen.getByText('9'))

  expect(screen.queryByText('2')).not.toBeInTheDocument()
  expect(screen.queryByText('3')).not.toBeInTheDocument()
  expect(screen.queryByText('4')).not.toBeInTheDocument()
  expect(screen.queryByText('5')).not.toBeInTheDocument()

  expect(screen.getAllByText('...').length).toEqual(1)
})

test('PageSelector with more than 8 pages renders as expected when the current page is 9', () => {
  renderAuthenticatedOnline(
    <PageSelector
      currentPageIndex={8}
      nextDisabled={false}
      onGoToPage={() => {}}
      onNextClick={() => {}}
      onPreviousClick={() => {}}
      pageCount={9}
      previousDisabled={false}
    />,
  )

  expect(screen.getByRole('button', { name: /back/i })).toBeEnabled()
  expect(screen.getByRole('button', { name: /next/i })).toBeEnabled()
  expect(screen.getByText('1'))
  expect(screen.getByText('7'))
  expect(screen.getByText('8'))
  expect(screen.getByText('9'))

  expect(screen.queryByText('2')).not.toBeInTheDocument()
  expect(screen.queryByText('3')).not.toBeInTheDocument()
  expect(screen.queryByText('4')).not.toBeInTheDocument()
  expect(screen.queryByText('5')).not.toBeInTheDocument()
  expect(screen.queryByText('6')).not.toBeInTheDocument()

  expect(screen.getAllByText('...').length).toEqual(1)
})
