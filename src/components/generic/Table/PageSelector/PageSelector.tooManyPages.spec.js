import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import {
  fireEvent,
  renderAuthenticatedOnline,
  waitFor,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import theme from '../../../../theme'

import PageSelector from './PageSelector'

test('PageSelector with more than 8 pages renders as expected when the current page index is not near a ellipses', () => {
  const container = renderAuthenticatedOnline(
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

  expect(container.getByText('« Previous')).not.toHaveAttribute('disabled')
  expect(container.getByText('Next »')).not.toHaveAttribute('disabled')
  expect(container.getByText('1'))
  expect(container.getByText('2'))
  expect(container.getByText('3'))
  expect(container.getByText('...'))

  expect(container.getByText('9'))

  expect(container.queryByText('4')).toBeNull()
  expect(container.queryByText('5')).toBeNull()
  expect(container.queryByText('6')).toBeNull()
  expect(container.queryByText('7')).toBeNull()
  expect(container.queryByText('8')).toBeNull()
})

test('PageSelector with more than 8 pages indicates current page', () => {
  const container = renderAuthenticatedOnline(
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

  expect(container.getByText('1')).toHaveStyle(
    `background-color: ${theme.color.primaryColor}`,
  )
  expect(container.getByText('2')).toHaveStyle('background-color: transparent')
  expect(container.getByText('3')).toHaveStyle('background-color: transparent')
  expect(container.getByText('9')).toHaveStyle('background-color: transparent')
})
test('PageSelector with more than 8 pages shows the next and previous buttons as being disabled', () => {
  const container = renderAuthenticatedOnline(
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

  expect(container.getByText('« Previous')).toHaveAttribute('disabled')
  expect(container.getByText('Next »')).toHaveAttribute('disabled')
})
test('PageSelector with more than 8 pages calls onGoToPage with the correct page when a page button is clicked', () => {
  const mockFunction = jest.fn()

  const container = renderAuthenticatedOnline(
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

  fireEvent.click(container.getByText('1'))
  expect(mockFunction).toHaveBeenCalledWith(0)

  fireEvent.click(container.getByText('9'))
  expect(mockFunction).toHaveBeenCalledWith(8)
})
test('PageSelector with more than 8 pages calls onNextClick when the next button is clicked', async () => {
  const mockFunction = jest.fn()

  const container = renderAuthenticatedOnline(
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

  fireEvent.click(container.getByText('Next »'))
  await waitFor(() => expect(mockFunction).toHaveBeenCalledTimes(1))
})

test('PageSelector with more than 8 pages calls onPreviousClick when the next button is clicked', () => {
  const mockFunction = jest.fn()

  const container = renderAuthenticatedOnline(
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

  fireEvent.click(container.getByText('« Previous'))
  expect(mockFunction).toHaveBeenCalledTimes(1)
})

test('PageSelector with more than 8 pages renders as expected when the current page is 2', () => {
  const container = renderAuthenticatedOnline(
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

  expect(container.getByText('« Previous')).not.toHaveAttribute('disabled')
  expect(container.getByText('Next »')).not.toHaveAttribute('disabled')
  expect(container.getByText('1'))
  expect(container.getByText('2'))
  expect(container.getByText('3'))
  expect(container.getByText('4'))
  expect(container.getByText('...'))
  expect(container.getByText('9'))

  expect(container.queryByText('5')).toBeNull()
  expect(container.queryByText('6')).toBeNull()
  expect(container.queryByText('7')).toBeNull()
  expect(container.queryByText('8')).toBeNull()
})

test('PageSelector with more than 8 pages renders as expected when the current page is 3', () => {
  const container = renderAuthenticatedOnline(
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

  expect(container.getByText('« Previous')).not.toHaveAttribute('disabled')
  expect(container.getByText('Next »')).not.toHaveAttribute('disabled')
  expect(container.getByText('1'))
  expect(container.getByText('2'))
  expect(container.getByText('3'))
  expect(container.getByText('4'))
  expect(container.getByText('5'))
  expect(container.getByText('...'))
  expect(container.getByText('9'))

  expect(container.queryByText('6')).toBeNull()
  expect(container.queryByText('7')).toBeNull()
  expect(container.queryByText('8')).toBeNull()
})

test('PageSelector with more than 8 pages renders as expected when the current page is 4', () => {
  const container = renderAuthenticatedOnline(
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

  expect(container.getByText('« Previous')).not.toHaveAttribute('disabled')
  expect(container.getByText('Next »')).not.toHaveAttribute('disabled')
  expect(container.getByText('1'))
  expect(container.getByText('2'))
  expect(container.getByText('3'))
  expect(container.getByText('4'))
  expect(container.getByText('5'))
  expect(container.getByText('6'))
  expect(container.getByText('...'))
  expect(container.getByText('9'))

  expect(container.queryByText('7')).toBeNull()
  expect(container.queryByText('8')).toBeNull()
})

test('PageSelector with more than 8 pages renders as expected when the current page is 5', () => {
  const container = renderAuthenticatedOnline(
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

  expect(container.getByText('« Previous')).not.toHaveAttribute('disabled')
  expect(container.getByText('Next »')).not.toHaveAttribute('disabled')
  expect(container.getByText('1'))
  expect(container.getByText('3'))
  expect(container.getByText('4'))
  expect(container.getByText('5'))
  expect(container.getByText('6'))
  expect(container.getByText('7'))
  expect(container.getByText('9'))

  expect(container.queryByText('2')).toBeNull()
  expect(container.queryByText('8')).toBeNull()

  expect(container.getAllByText('...').length).toEqual(2)
})

test('PageSelector with more than 8 pages renders as expected when the current page is 6', () => {
  const container = renderAuthenticatedOnline(
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

  expect(container.getByText('« Previous')).not.toHaveAttribute('disabled')
  expect(container.getByText('Next »')).not.toHaveAttribute('disabled')
  expect(container.getByText('1'))
  expect(container.getByText('4'))
  expect(container.getByText('5'))
  expect(container.getByText('6'))
  expect(container.getByText('7'))
  expect(container.getByText('8'))
  expect(container.getByText('9'))

  expect(container.queryByText('2')).toBeNull()
  expect(container.queryByText('3')).toBeNull()

  expect(container.getAllByText('...').length).toEqual(1)
})

test('PageSelector with more than 8 pages renders as expected when the current page is 7', () => {
  const container = renderAuthenticatedOnline(
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

  expect(container.getByText('« Previous')).not.toHaveAttribute('disabled')
  expect(container.getByText('Next »')).not.toHaveAttribute('disabled')
  expect(container.getByText('1'))
  expect(container.getByText('5'))
  expect(container.getByText('6'))
  expect(container.getByText('7'))
  expect(container.getByText('8'))
  expect(container.getByText('9'))

  expect(container.queryByText('2')).toBeNull()
  expect(container.queryByText('3')).toBeNull()
  expect(container.queryByText('4')).toBeNull()

  expect(container.getAllByText('...').length).toEqual(1)
})

test('PageSelector with more than 8 pages renders as expected when the current page is 8', () => {
  const container = renderAuthenticatedOnline(
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

  expect(container.getByText('« Previous')).not.toHaveAttribute('disabled')
  expect(container.getByText('Next »')).not.toHaveAttribute('disabled')
  expect(container.getByText('1'))
  expect(container.getByText('6'))
  expect(container.getByText('7'))
  expect(container.getByText('8'))
  expect(container.getByText('9'))

  expect(container.queryByText('2')).toBeNull()
  expect(container.queryByText('3')).toBeNull()
  expect(container.queryByText('4')).toBeNull()
  expect(container.queryByText('5')).toBeNull()

  expect(container.getAllByText('...').length).toEqual(1)
})

test('PageSelector with more than 8 pages renders as expected when the current page is 9', () => {
  const container = renderAuthenticatedOnline(
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

  expect(container.getByText('« Previous')).not.toHaveAttribute('disabled')
  expect(container.getByText('Next »')).not.toHaveAttribute('disabled')
  expect(container.getByText('1'))
  expect(container.getByText('7'))
  expect(container.getByText('8'))
  expect(container.getByText('9'))

  expect(container.queryByText('2')).toBeNull()
  expect(container.queryByText('3')).toBeNull()
  expect(container.queryByText('4')).toBeNull()
  expect(container.queryByText('5')).toBeNull()
  expect(container.queryByText('6')).toBeNull()

  expect(container.getAllByText('...').length).toEqual(1)
})
