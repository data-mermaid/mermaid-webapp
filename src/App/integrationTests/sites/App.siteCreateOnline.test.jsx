import { rest } from 'msw'
import React from 'react'

import { getMockDexieInstancesAllSuccess } from '../../../testUtilities/mockDexie'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'
import App from '../../App'
import {
  mock400StatusCodeForAllDataTypesPush,
  mock500StatusCodeForAllDataTypesPush,
} from '../../../testUtilities/mockPushStatusCodes'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

const saveSite = async (user) => {
  const nameInput = await screen.findByTestId('name-input')

  await user.type(nameInput, 'Rebecca')
  await waitFor(() => expect(screen.getByTestId('name-input')).toHaveValue('Rebecca'))
  await user.type(screen.getByTestId('country-input'), 'canad')
  const canadaOption = within(screen.getByTestId('country-select')).getByRole('option', {
    name: 'Canada',
  })
  const countryAutocompleteList = within(screen.getByTestId('country-select')).getByRole('listbox')

  await user.selectOptions(countryAutocompleteList, canadaOption)
  await user.type(screen.getByTestId('latitude-input'), '54')
  await waitFor(() => expect(screen.getByTestId('latitude-input')).toHaveValue(54))
  await user.type(screen.getByTestId('longitude-input'), '45')
  await user.selectOptions(
    screen.getByTestId('exposure-select'),
    'baa54e1d-4263-4273-80f5-35812304b592',
  )
  await user.selectOptions(
    screen.getByTestId('reef-type-select'),
    '16a0a961-df6d-42a5-86b8-bc30f87bab42',
  )
  await user.selectOptions(
    screen.getByTestId('reef-zone-select'),
    '06ea17cd-5d1d-46ae-a654-64901e2a9f96',
  )

  await user.type(screen.getByTestId('notes-textarea'), 'la dee dah')
  expect(screen.getByTestId('notes-textarea')).toHaveValue('la dee dah')

  const saveButton = screen.getByTestId('save-button-site-form')

  await waitFor(() => expect(saveButton).toBeEnabled())
  await user.click(saveButton)
}

describe('Online', () => {
  test('new site button navigates to new site form properly', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    const { user } = renderAuthenticatedOnline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/sites/'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await user.click(await screen.findByTestId('new-site-link'))

    // ensure the were not in edit mode, but new site mode
    await screen.findByTestId('new-site-form-title')

    // form empty
    expect(screen.getByTestId('name-input')).toHaveDisplayValue('')
    expect(screen.getByTestId('country-input')).toHaveDisplayValue('')
    expect(screen.getByTestId('latitude-input')).toHaveDisplayValue('')
    expect(screen.getByTestId('longitude-input')).toHaveDisplayValue('')
    expect(screen.getByTestId('exposure-select')).toHaveDisplayValue('choose...')
    expect(screen.getByTestId('reef-type-select')).toHaveDisplayValue('choose...')
    expect(screen.getByTestId('reef-zone-select')).toHaveDisplayValue('choose...')

    expect(screen.getByTestId('notes-textarea')).toHaveDisplayValue('')
  })
  test('new site save success shows saved inputs, toast, and navigates to the edit site page for the newly created site', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    const { user } = renderAuthenticatedOnline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/sites/new'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await screen.findByTestId('loading-indicator')
    await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

    await saveSite(user)

    await screen.findByTestId('site-toast-success')

    // ensure the new form is now the edit form
    expect(await screen.findByTestId('edit-site-form-title')).toHaveTextContent('Rebecca')

    expect(screen.getByTestId('name-input')).toHaveDisplayValue('Rebecca')
    expect(screen.getByTestId('country-input')).toHaveDisplayValue('Canada')
    expect(screen.getByTestId('latitude-input')).toHaveDisplayValue('54')
    expect(screen.getByTestId('longitude-input')).toHaveDisplayValue('45')
    expect(screen.getByTestId('exposure-select')).toHaveDisplayValue('very sheltered')
    expect(screen.getByTestId('reef-type-select')).toHaveDisplayValue('atoll')
    expect(screen.getByTestId('reef-zone-select')).toHaveDisplayValue('back reef')
    expect(screen.getByTestId('notes-textarea')).toHaveDisplayValue('la dee dah')
  })

  test('new site save success show new record in site table', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    const { user } = renderAuthenticatedOnline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/sites/new'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await saveSite(user)

    await screen.findByTestId('site-toast-success')

    const sideNav = await screen.findByTestId('content-page-side-nav')

    await user.click(within(sideNav).getByTestId('nav-sites'))

    // show all the records
    await user.selectOptions(await screen.findByTestId('page-size-selector'), '5')
    const table = await screen.findByRole('table')

    const tableRows = await screen.findAllByRole('row')

    // 6 here because the header row + the 3 mock records + the one we just created
    expect(tableRows).toHaveLength(6)

    expect(await within(table).findByText('Rebecca'))
  })

  test('new site save will handle 400 push status codes by passing on reasoning to the user. Edits persist.', async () => {
    // it is possible that other 40X status codes will be received, but this test can represent the whole lot as a time management tradeoff

    mockMermaidApiAllSuccessful.use(
      // append the validated data on the pull response, because that is what the UI uses to update itself
      rest.post(`${apiBaseUrl}/push/`, (_req, res, ctx) => {
        return res(ctx.json(mock400StatusCodeForAllDataTypesPush))
      }),
    )
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    const { user } = renderAuthenticatedOnline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/sites/new'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await saveSite(user)

    await screen.findByTestId('site-toast-error')

    // ensure the were not in edit mode, but new site mode
    await screen.findByTestId('new-site-form-title')

    // edits persisted
    expect(screen.getByTestId('name-input')).toHaveDisplayValue('Rebecca')
    expect(screen.getByTestId('country-input')).toHaveDisplayValue('Canada')
    expect(screen.getByTestId('latitude-input')).toHaveDisplayValue('54')
    expect(screen.getByTestId('longitude-input')).toHaveDisplayValue('45')
    expect(screen.getByTestId('exposure-select')).toHaveDisplayValue('very sheltered')
    expect(screen.getByTestId('reef-type-select')).toHaveDisplayValue('atoll')
    expect(screen.getByTestId('reef-zone-select')).toHaveDisplayValue('back reef')
    expect(screen.getByTestId('notes-textarea')).toHaveDisplayValue('la dee dah')
  })
})

test('New site save will handle 500 push status codes with a generic message and spare the user any api generated error details. Edits will perisit', async () => {
  mockMermaidApiAllSuccessful.use(
    // append the validated data on the pull response, because that is what the UI uses to update itself
    rest.post(`${apiBaseUrl}/push/`, (_req, res, ctx) => {
      return res(ctx.json(mock500StatusCodeForAllDataTypesPush))
    }),
  )
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  const { user } = renderAuthenticatedOnline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/sites/new'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  await saveSite(user)

  await screen.findByTestId('site-toast-error')

  // ensure the were not in edit mode, but new site mode
  await screen.findByTestId('new-site-form-title')

  // edits persisted
  expect(screen.getByTestId('name-input')).toHaveDisplayValue('Rebecca')
  expect(screen.getByTestId('country-input')).toHaveDisplayValue('Canada')
  expect(screen.getByTestId('latitude-input')).toHaveDisplayValue('54')
  expect(screen.getByTestId('longitude-input')).toHaveDisplayValue('45')
  expect(screen.getByTestId('exposure-select')).toHaveDisplayValue('very sheltered')
  expect(screen.getByTestId('reef-type-select')).toHaveDisplayValue('atoll')
  expect(screen.getByTestId('reef-zone-select')).toHaveDisplayValue('back reef')
  expect(screen.getByTestId('notes-textarea')).toHaveDisplayValue('la dee dah')
})
