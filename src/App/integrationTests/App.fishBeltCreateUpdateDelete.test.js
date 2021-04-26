import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import userEvent from '@testing-library/user-event'
import {
  screen,
  mockMermaidApiAllSuccessful,
  within,
  renderAuthenticatedOffline,
} from '../../testUtilities/testingLibraryWithHelpers'
import App from '../App'
import { getMockDexieInstanceAllSuccess } from '../../testUtilities/mockDexie'

beforeAll(() => {
  mockMermaidApiAllSuccessful.listen()
})
afterEach(() => {
  mockMermaidApiAllSuccessful.resetHandlers()
})
afterAll(() => {
  mockMermaidApiAllSuccessful.close()
})

const navigateToNewFishbeltFormFrom = async () => {
  const projectCard = screen.getAllByRole('listitem')[0]

  userEvent.click(within(projectCard).getByText(/collecting/i))

  userEvent.click(
    await screen.findByRole('button', {
      name: /Add Sample Unit/i,
    }),
  )

  const sampleUnitNav = screen.getByTestId('new-sample-unit-nav')

  userEvent.click(
    within(sampleUnitNav).getByRole('link', {
      name: /fish belt/i,
    }),
  )
}

const saveFishbeltRecord = async () => {
  const form = await screen.findByRole('form')

  userEvent.type(await within(form).findByLabelText(/transect number/i), '56')
  userEvent.click(screen.getByRole('button', { name: /save/i }))
}

test('Delete fishbelt confirmed deletes the record with the proper UI response and messaging', async () => {
  renderAuthenticatedOffline(
    <App dexieInstance={getMockDexieInstanceAllSuccess()} />,
  )

  expect(
    await screen.findByText('Projects', {
      selector: 'h1',
    }),
  )

  await navigateToNewFishbeltFormFrom()
  await saveFishbeltRecord()

  const formTitle = await screen.findByTestId('form-title')

  // ensure the new form is now the edit form
  expect(within(formTitle).getByText('56'))

  userEvent.click(await screen.findByText(/Delete Record/i))

  expect(screen.getByText(/Are you sure you want to delete this record?/i))

  userEvent.click(screen.getByRole('button', { name: /Yes/i }))

  // navigated to collect records table page
  expect(await screen.findByText('Collect Records', { selector: 'h3' }))

  // shows toast
  expect(await screen.findByText(/Collect record deleted./i))

  const table = await screen.findByRole('table')

  // row = 1 because of header row. Expect there to be no records.
  expect(within(table).getAllByRole('row').length).toEqual(1)
})

test('Delete fishbelt prompt cancel closes prompt and does nothing (edits persisted)', async () => {
  renderAuthenticatedOffline(
    <App dexieInstance={getMockDexieInstanceAllSuccess()} />,
  )

  expect(
    await screen.findByText('Projects', {
      selector: 'h1',
    }),
  )

  await navigateToNewFishbeltFormFrom()
  await saveFishbeltRecord()

  const formTitle = await screen.findByTestId('form-title')

  // ensure the new form is now the edit form
  expect(within(formTitle).getByText('56'))

  // make an unsaved change
  const form = await screen.findByRole('form')

  userEvent.type(await within(form).findByLabelText(/depth/i), '45')

  userEvent.click(await screen.findByText(/Delete Record/i))

  expect(screen.getByText(/Are you sure you want to delete this record?/i))

  userEvent.click(screen.getByRole('button', { name: /No/i }))

  expect(
    screen.queryByText(/Are you sure you want to delete this record?/i),
  ).not.toBeInTheDocument()

  expect(await within(form).findByLabelText(/depth/i)).toHaveValue(45)
})
