import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import {
  fireEvent,
  renderAuthenticatedOnline,
  waitFor,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import theme from '../../../../theme'
import PageSelector from './PageSelector'

test('PageSelector with 8 or less pages renders as expected', () => {
  const container = renderAuthenticatedOnline(
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

  expect(container.getByText('« Previous')).not.toHaveAttribute('disabled')
  expect(container.getByText('Next »')).not.toHaveAttribute('disabled')
  expect(container.getByText('1'))
  expect(container.getByText('2'))
  expect(container.getByText('3'))
  expect(container.getByText('4'))
  expect(container.getByText('5'))
  expect(container.getByText('6'))
  expect(container.getByText('7'))
  expect(container.getByText('8'))
})

test('PageSelector with 8 or less pages indicates current page', () => {
  const container = renderAuthenticatedOnline(
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

  expect(container.getByText('1')).toHaveStyle('background-color: transparent')
  expect(container.getByText('2')).toHaveStyle(
    `background-color: ${theme.color.primaryColor}`,
  )
  expect(container.getByText('3')).toHaveStyle('background-color: transparent')
  expect(container.getByText('4')).toHaveStyle('background-color: transparent')
  expect(container.getByText('5')).toHaveStyle('background-color: transparent')
  expect(container.getByText('6')).toHaveStyle('background-color: transparent')
  expect(container.getByText('7')).toHaveStyle('background-color: transparent')
  expect(container.getByText('8')).toHaveStyle('background-color: transparent')
})
test('PageSelector with 8 or less pages shows the next and previous buttons as being disabled', () => {
  const container = renderAuthenticatedOnline(
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

  expect(container.getByText('« Previous')).toHaveAttribute('disabled')
  expect(container.getByText('Next »')).toHaveAttribute('disabled')
})
test('PageSelector with 8 or less pages calls onGoToPage with the correct page when a page button is clicked', () => {
  const mockFunction = jest.fn()

  const container = renderAuthenticatedOnline(
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

  fireEvent.click(container.getByText('1'))
  expect(mockFunction).toHaveBeenCalledWith(0)

  fireEvent.click(container.getByText('5'))
  expect(mockFunction).toHaveBeenCalledWith(4)

  fireEvent.click(container.getByText('8'))
  expect(mockFunction).toHaveBeenCalledWith(7)
})
test('PageSelector with 8 or less pages calls onNextClick when the next button is clicked', async () => {
  const mockFunction = jest.fn()

  const container = renderAuthenticatedOnline(
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

  fireEvent.click(container.getByText('Next »'))
  await waitFor(() => expect(mockFunction).toHaveBeenCalledTimes(1))
})

test('PageSelector with 8 or less pages calls onPreviousClick when the next button is clicked', () => {
  const mockFunction = jest.fn()

  const container = renderAuthenticatedOnline(
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

  fireEvent.click(container.getByText('« Previous'))
  expect(mockFunction).toHaveBeenCalledTimes(1)
})
