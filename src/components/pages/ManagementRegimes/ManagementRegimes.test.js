import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {
  renderAuthenticatedOnline,
  screen,
  waitForElementToBeRemoved,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'

import ManagementRegimes from './ManagementRegimes'

test('ManagementRegimes component renders with the expected headers', async () => {
  renderAuthenticatedOnline(<ManagementRegimes />, {
    isSyncInProgressOverride: true,
  })

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('project pages loading indicator'),
  )

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[0]).getByText('Management Regime Name'))
  expect(within(tableRows[0]).getByText('Year Est.'))
  expect(within(tableRows[0]).getByText('Compliance'))
  expect(within(tableRows[0]).getByText('Open Access'))
  expect(within(tableRows[0]).getByText('Access Restrictions'))
  expect(within(tableRows[0]).getByText('Periodic Closure'))
  expect(within(tableRows[0]).getByText('Size Limits'))
  expect(within(tableRows[0]).getByText('Gear Restrictions'))
  expect(within(tableRows[0]).getByText('Species Restrictions'))
  expect(within(tableRows[0]).getByText('No Take'))
})

test('Management Regime Records table sorts properly by Name column', async () => {
  renderAuthenticatedOnline(<ManagementRegimes />, {
    isSyncInProgressOverride: true,
  })

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('project pages loading indicator'),
  )

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('Management Regimes A'))

  // click once to change to ascending order
  userEvent.click(within(table).getByText('Management Regime Name'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Management Regimes A'))

  // // click again to change to descending order
  userEvent.click(within(table).getByText('Management Regime Name'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('Management Regimes C'))
})

test('Management Regime Records table sorts properly by Year Est. column', async () => {
  renderAuthenticatedOnline(<ManagementRegimes />, {
    isSyncInProgressOverride: true,
  })

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('project pages loading indicator'),
  )

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('2021'))

  // click once to change to ascending order
  userEvent.click(within(table).getByText('Year Est.'))

  const tableRowsAfter = within(table).getAllByRole('row')

  // we test last row because it will have a non empty value which is easier to query
  expect(within(tableRowsAfter[3]).getByText('2021'))

  // // click again to change to descending order
  userEvent.click(within(table).getByText('Year Est.'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('2021'))
})

test('Management Regime Records table sorts properly by Compliance column', async () => {
  renderAuthenticatedOnline(<ManagementRegimes />, {
    isSyncInProgressOverride: true,
  })

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('project pages loading indicator'),
  )

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')
  // we test last row because it will have a non empty value which is easier to query

  expect(within(tableRows[3]).getByText('somewhat'))

  // click once to change to ascending order
  userEvent.click(within(table).getByText('Compliance'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[3]).getByText('somewhat'))

  // // click again to change to descending order
  userEvent.click(within(table).getByText('Compliance'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('somewhat'))
})

test('Management Regime Records table sorts properly by Open Access column', async () => {
  renderAuthenticatedOnline(<ManagementRegimes />, {
    isSyncInProgressOverride: true,
  })

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('project pages loading indicator'),
  )

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('Management Regimes A'))

  // click once to change to ascending order
  userEvent.click(within(table).getByText('Open Access'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Management Regimes B'))

  // // click again to change to descending order
  userEvent.click(within(table).getByText('Open Access'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('Management Regimes C'))
})

test('Management Regime Records table sorts properly by Access Restrictions column', async () => {
  renderAuthenticatedOnline(<ManagementRegimes />, {
    isSyncInProgressOverride: true,
  })

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('project pages loading indicator'),
  )

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('Management Regimes A'))

  // click once to change to ascending order
  userEvent.click(within(table).getByText('Access Restrictions'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Management Regimes C'))

  // // click again to change to descending order
  userEvent.click(within(table).getByText('Access Restrictions'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('Management Regimes B'))
})

test('Management Regime Records table sorts properly by Periodic Closure column', async () => {
  renderAuthenticatedOnline(<ManagementRegimes />, {
    isSyncInProgressOverride: true,
  })

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('project pages loading indicator'),
  )

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('Management Regimes A'))

  // click once to change to ascending order
  userEvent.click(within(table).getByText('Periodic Closure'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Management Regimes C'))

  // // click again to change to descending order
  userEvent.click(within(table).getByText('Periodic Closure'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('Management Regimes B'))
})

test('Management Regime Records table sorts properly by Size Limits column', async () => {
  renderAuthenticatedOnline(<ManagementRegimes />, {
    isSyncInProgressOverride: true,
  })

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('project pages loading indicator'),
  )

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('Management Regimes A'))

  // click once to change to ascending order
  userEvent.click(within(table).getByText('Size Limits'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Management Regimes C'))

  // // click again to change to descending order
  userEvent.click(within(table).getByText('Size Limits'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('Management Regimes B'))
})

test('Management Regime Records table sorts properly by Gear Restrictions column', async () => {
  renderAuthenticatedOnline(<ManagementRegimes />, {
    isSyncInProgressOverride: true,
  })

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('project pages loading indicator'),
  )

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('Management Regimes A'))

  // click once to change to ascending order
  userEvent.click(within(table).getByText('Gear Restrictions'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Management Regimes A'))

  // // click again to change to descending order
  userEvent.click(within(table).getByText('Gear Restrictions'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('Management Regimes C'))
})

test('Management Regime Records table sorts properly by Species Restrictions column', async () => {
  renderAuthenticatedOnline(<ManagementRegimes />, {
    isSyncInProgressOverride: true,
  })

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('project pages loading indicator'),
  )

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('Management Regimes A'))

  // click once to change to ascending order
  userEvent.click(within(table).getByText('Species Restrictions'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Management Regimes A'))

  // // click again to change to descending order
  userEvent.click(within(table).getByText('Species Restrictions'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('Management Regimes C'))
})

test('Management Regime Records table sorts properly by No Take column', async () => {
  renderAuthenticatedOnline(<ManagementRegimes />, {
    isSyncInProgressOverride: true,
  })

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('project pages loading indicator'),
  )

  const table = screen.getByRole('table')

  const tableRows = within(table).getAllByRole('row')

  expect(within(tableRows[1]).getByText('Management Regimes A'))

  // click once to change to ascending order
  userEvent.click(within(table).getByText('No Take'))

  const tableRowsAfter = within(table).getAllByRole('row')

  expect(within(tableRowsAfter[1]).getByText('Management Regimes A'))

  // // click again to change to descending order
  userEvent.click(within(table).getByText('No Take'))

  const tableRowsAfterFirstClick = within(table).getAllByRole('row')

  expect(within(tableRowsAfterFirstClick[1]).getByText('Management Regimes C'))
})
