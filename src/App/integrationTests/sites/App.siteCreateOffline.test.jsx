import React from 'react'

import {
  renderAuthenticatedOffline,
  screen,
  waitFor,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import App from '../../App'

const saveSite = async (user) => {
  const nameInput = await screen.findByLabelText('Name')

  await user.type(nameInput, 'Rebecca')
  await waitFor(() => expect(screen.getByLabelText('Name')).toHaveValue('Rebecca'))
  await user.type(screen.getByLabelText('Country'), 'canad')
  const canadaOption = within(screen.getByTestId('country-select')).getByRole('option', {
    name: 'Canada',
  })
  const countryAutocompleteList = within(screen.getByTestId('country-select')).getByRole('listbox')

  await user.selectOptions(countryAutocompleteList, canadaOption)
  await user.type(screen.getByLabelText('Latitude'), '54')
  await user.type(screen.getByLabelText('Longitude'), '45')
  await user.selectOptions(
    screen.getByLabelText('Exposure'),
    'baa54e1d-4263-4273-80f5-35812304b592',
  )
  await user.selectOptions(
    screen.getByLabelText('Reef Type'),
    '16a0a961-df6d-42a5-86b8-bc30f87bab42',
  )
  await user.selectOptions(
    screen.getByLabelText('Reef Zone'),
    '06ea17cd-5d1d-46ae-a654-64901e2a9f96',
  )

  await user.type(screen.getByLabelText('Notes'), 'la dee dah')
  const saveButton = screen.getByTestId('save-button-site-form')

  await waitFor(() => expect(saveButton).toBeEnabled())
  await user.click(saveButton)
}

describe('offline', () => {
  test('new site button navigates to new site form properly', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/sites/'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await user.click(await screen.findByTestId('new-site-link'))

    // ensure the were not in edit mode, but new site mode
    expect(
      await screen.findByText('Site', {
        selector: 'h2',
      }),
    )

    // form empty
    expect(screen.getByLabelText('Name')).toHaveDisplayValue('')
    expect(screen.getByLabelText('Country')).toHaveDisplayValue('')
    expect(screen.getByLabelText('Latitude')).toHaveDisplayValue('')
    expect(screen.getByLabelText('Longitude')).toHaveDisplayValue('')
    expect(screen.getByLabelText('Exposure')).toHaveDisplayValue('Choose...')
    expect(screen.getByLabelText('Reef Type')).toHaveDisplayValue('Choose...')
    expect(screen.getByLabelText('Reef Zone')).toHaveDisplayValue('Choose...')

    expect(screen.getByLabelText('Notes')).toHaveDisplayValue('')
  })
  test('new site save success shows saved inputs, toast, and navigates to the edit site page for the newly created site', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/sites/new'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await saveSite(user)

    expect(await screen.findByText('The site has been saved on your computer.'))

    // ensure the new form is now the edit form
    expect(
      await screen.findByText('Rebecca', {
        selector: 'h2',
      }),
    )

    expect(screen.getByLabelText('Name')).toHaveDisplayValue('Rebecca')
    expect(screen.getByLabelText('Country')).toHaveDisplayValue('Canada')
    expect(screen.getByLabelText('Latitude')).toHaveDisplayValue('54')
    expect(screen.getByLabelText('Longitude')).toHaveDisplayValue('45')
    expect(screen.getByLabelText('Exposure')).toHaveDisplayValue('very sheltered')
    expect(screen.getByLabelText('Reef Type')).toHaveDisplayValue('atoll')
    expect(screen.getByLabelText('Reef Zone')).toHaveDisplayValue('back reef')
    expect(screen.getByLabelText('Notes')).toHaveDisplayValue('la dee dah')
  })
  test('new site save success show new record in site table', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/sites/new'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await saveSite(user)

    expect(await screen.findByText('The site has been saved on your computer.'))

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
  test('new site save failure shows toast message with edits persisting', async () => {
    const consoleSpy = jest.spyOn(console, 'error')
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const dexieError = new Error('this is a dexie error')

    dexiePerUserDataInstance.project_sites.put = () => Promise.reject(dexieError)

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/sites/new'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await saveSite(user)

    expect(await screen.findByTestId('site-toast-error')).toHaveTextContent(
      `The site failed to save both on your computer and online.`,
    )
    expect(consoleSpy).toHaveBeenCalledWith(dexieError)

    // ensure the were not in edit mode, but new site mode
    expect(
      screen.getByText('Site', {
        selector: 'h2',
      }),
    )

    // edits persisted
    expect(screen.getByLabelText('Name')).toHaveDisplayValue('Rebecca')
    expect(screen.getByLabelText('Country')).toHaveDisplayValue('Canada')
    expect(screen.getByLabelText('Latitude')).toHaveDisplayValue('54')
    expect(screen.getByLabelText('Longitude')).toHaveDisplayValue('45')
    expect(screen.getByLabelText('Exposure')).toHaveDisplayValue('very sheltered')
    expect(screen.getByLabelText('Reef Type')).toHaveDisplayValue('atoll')
    expect(screen.getByLabelText('Reef Zone')).toHaveDisplayValue('back reef')
    expect(screen.getByLabelText('Notes')).toHaveDisplayValue('la dee dah')
  })
})
