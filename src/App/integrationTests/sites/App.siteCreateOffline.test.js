import React from 'react'
import userEvent from '@testing-library/user-event'

import {
  renderAuthenticatedOffline,
  screen,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'
import { getMockDexieInstancesAllSuccess } from '../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import App from '../../App'

const saveSite = async () => {
  userEvent.type(await screen.findByLabelText('Name'), 'Rebecca')
  userEvent.type(screen.getByLabelText('Country'), 'canad')
  const canadaOption = within(screen.getByTestId('country-select')).getByRole('option', {
    name: 'Canada',
  })
  const countryAutocompleteList = within(screen.getByTestId('country-select')).getByRole('listbox')

  userEvent.selectOptions(countryAutocompleteList, canadaOption)
  userEvent.type(screen.getByLabelText('Latitude'), '54')
  userEvent.type(screen.getByLabelText('Longitude'), '45')
  userEvent.click(within(screen.getByLabelText('Exposure')).getByLabelText('very sheltered'))
  userEvent.click(within(screen.getByLabelText('Reef Type')).getByLabelText('atoll'))
  userEvent.click(within(screen.getByLabelText('Reef Zone')).getByLabelText('back reef'))
  userEvent.type(screen.getByLabelText('Notes'), 'la dee dah')

  userEvent.click(screen.getByText('Save', { selector: 'button' }))
}

describe('offline', () => {
  test('new site button navigates to new site form properly', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
      initialEntries: ['/projects/5/sites/'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    })

    userEvent.click(await screen.findByRole('link', { name: 'New site' }))

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
    expect(
      within(screen.getByLabelText('Exposure')).getByLabelText('very sheltered'),
    ).not.toBeChecked()
    expect(within(screen.getByLabelText('Exposure')).getByLabelText('sheltered')).not.toBeChecked()
    expect(
      within(screen.getByLabelText('Exposure')).getByLabelText('semi-exposed'),
    ).not.toBeChecked()
    expect(within(screen.getByLabelText('Exposure')).getByLabelText('exposed')).not.toBeChecked()
    expect(within(screen.getByLabelText('Reef Type')).getByLabelText('atoll')).not.toBeChecked()
    expect(within(screen.getByLabelText('Reef Type')).getByLabelText('barrier')).not.toBeChecked()
    expect(within(screen.getByLabelText('Reef Type')).getByLabelText('fringing')).not.toBeChecked()
    expect(within(screen.getByLabelText('Reef Type')).getByLabelText('lagoon')).not.toBeChecked()
    expect(within(screen.getByLabelText('Reef Type')).getByLabelText('patch')).not.toBeChecked()

    expect(within(screen.getByLabelText('Reef Zone')).getByLabelText('back reef')).not.toBeChecked()
    expect(within(screen.getByLabelText('Reef Zone')).getByLabelText('crest')).not.toBeChecked()
    expect(within(screen.getByLabelText('Reef Zone')).getByLabelText('fore reef')).not.toBeChecked()
    expect(within(screen.getByLabelText('Reef Zone')).getByLabelText('pinnacle')).not.toBeChecked()

    expect(screen.getByLabelText('Notes')).toHaveDisplayValue('')
  })
  test('new site save success shows saved inputs, toast, and navigates to the edit site page for the newly created site', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
      initialEntries: ['/projects/5/sites/new'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    })

    await saveSite()

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
    expect(within(screen.getByLabelText('Exposure')).getByLabelText('very sheltered')).toBeChecked()
    expect(within(screen.getByLabelText('Reef Type')).getByLabelText('atoll')).toBeChecked()
    expect(within(screen.getByLabelText('Reef Zone')).getByLabelText('back reef')).toBeChecked()
    expect(screen.getByLabelText('Notes')).toHaveDisplayValue('la dee dah')
  })
  test('new site save success show new record in site table', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
      initialEntries: ['/projects/5/sites/new'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    })

    await saveSite()

    expect(await screen.findByText('The site has been saved on your computer.'))

    const sideNav = await screen.findByTestId('content-page-side-nav')

    userEvent.click(within(sideNav).getByText('Sites'))

    // show all the records
    userEvent.selectOptions(await screen.findByTestId('page-size-selector'), '5')
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

    renderAuthenticatedOffline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
      initialEntries: ['/projects/5/sites/new'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    })

    await saveSite()

    expect(await screen.findByTestId('site-toast-error')).toHaveTextContent(
      `The site failed to save both on your computer and in the MERMAID online system.`,
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
    expect(within(screen.getByLabelText('Exposure')).getByLabelText('very sheltered')).toBeChecked()
    expect(within(screen.getByLabelText('Reef Type')).getByLabelText('atoll')).toBeChecked()
    expect(within(screen.getByLabelText('Reef Zone')).getByLabelText('back reef')).toBeChecked()
    expect(screen.getByLabelText('Notes')).toHaveDisplayValue('la dee dah')
  })
})
