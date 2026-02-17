import { describe, expect, test, vi } from 'vitest'
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

    await screen.findByTestId('site-toast-offline-success')

    // ensure the new form is now the edit form
    expect(await screen.findByTestId('edit-site-form-title')).toHaveTextContent('Rebecca')

    await waitFor(() => {
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

    await screen.findByTestId('site-toast-offline-success')

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
    const consoleSpy = vi.spyOn(console, 'error')
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

    await screen.findByTestId('site-toast-error')
    expect(consoleSpy).toHaveBeenCalledWith(dexieError)

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
