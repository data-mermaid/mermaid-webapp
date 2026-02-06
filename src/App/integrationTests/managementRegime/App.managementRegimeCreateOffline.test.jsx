import { describe, expect, test, vi } from "vitest";
import React from 'react'

import { initiallyHydrateOfflineStorageWithMockData } from '../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'
import { getMockDexieInstancesAllSuccess } from '../../../testUtilities/mockDexie'
import {
  renderAuthenticatedOffline,
  screen,
  waitFor,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'
import App from '../../App'

const saveMR = async (user) => {
  await user.type(await screen.findByTestId('name-input'), 'Rebecca')
  await user.type(screen.getByTestId('secondary-name-input'), 'Becca')
  await user.type(screen.getByTestId('year-established-input'), '1980')
  await user.type(screen.getByTestId('area-input'), '40')

  const partiesField = screen.getByTestId('parties')
  await user.click(within(partiesField).getByTestId('parties-ngo-checkbox'))

  const rulesField = screen.getByTestId('rules')
  await user.click(within(rulesField).getByTestId('rules-open-access-radio'))

  await user.selectOptions(
    screen.getByTestId('compliance-select'),
    'f76d7866-5b0d-428d-928c-738c2912d6e0',
  )
  await user.type(screen.getByTestId('notes-textarea'), 'some notes')

  await user.click(screen.getByTestId('save-button-management-regime-form'))
}

describe('Offline', () => {
  test('New MR button navigates to new MR form properly', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/management-regimes/'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await user.click(await screen.findByTestId('new-management-regime-button'))

    // ensure we're not in edit mode, but new management regime mode
    expect(await screen.findByTestId('new-management-regime-form-title'))

    // form empty
    expect(screen.getByTestId('name-input')).toHaveValue('')
    expect(screen.getByTestId('secondary-name-input')).toHaveValue('')
    expect(screen.getByTestId('year-established-input')).toHaveValue(null)
    expect(screen.getByTestId('area-input')).toHaveValue(null)

    const parties = screen.getByTestId('parties')

    expect(within(parties).getByTestId('parties-ngo-checkbox')).not.toBeChecked()
    expect(
      within(parties).getByTestId('parties-community-local-government-checkbox'),
    ).not.toBeChecked()
    expect(within(parties).getByTestId('parties-government-checkbox')).not.toBeChecked()
    expect(within(parties).getByTestId('parties-private-sector-checkbox')).not.toBeChecked()

    const rules = screen.getByTestId('rules')
    expect(within(rules).getByTestId('rules-open-access-radio')).toBeChecked()
    expect(within(rules).getByTestId('rules-no-take-radio')).not.toBeChecked()
    expect(within(rules).getByTestId('rules-partial-restrictions-radio')).not.toBeChecked()
    expect(screen.getByTestId('compliance-select')).toHaveDisplayValue('Choose...')
  })

  test('New MR save success shows saved inputs, toast, and navigates to the edit MR page for the newly created MR', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/management-regimes/new'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await saveMR(user)

    expect(await screen.findByTestId('management-regime-toast-offline-success'))

    // ensure the new form is now the edit form
    expect(await screen.findByTestId('edit-management-regime-form-title'))

    await waitFor(() => expect(screen.getByTestId('name-input')).toHaveValue('Rebecca'))
    expect(screen.getByTestId('secondary-name-input')).toHaveValue('Becca')
    expect(screen.getByTestId('year-established-input')).toHaveValue(1980)
    expect(screen.getByTestId('area-input')).toHaveValue(40)
    await waitFor(() =>
      expect(
        within(screen.getByTestId('parties')).getByTestId('parties-ngo-checkbox'),
      ).toBeChecked(),
    )
    expect(within(screen.getByTestId('rules')).getByTestId('rules-open-access-radio')).toBeChecked()
    expect(screen.getByTestId('compliance-select')).toHaveDisplayValue('somewhat')
  })

  test('New MR save success show new record in MR table', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/management-regimes/new'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await saveMR(user)

    expect(await screen.findByTestId('management-regime-toast-offline-success'))

    const sideNav = await screen.findByTestId('content-page-side-nav')

    await user.click(within(sideNav).getByTestId('nav-management-regimes'))

    const pageSizeSelector = await screen.findByTestId('page-size-selector')

    // show all the records
    await waitFor(() => expect(pageSizeSelector))
    await user.selectOptions(pageSizeSelector, '4')
    const table = await screen.findByRole('table')

    const tableRows = await screen.findAllByRole('row')

    // 5 here because the header row + the 3 mock records + the one we just created
    expect(tableRows).toHaveLength(5)

    expect(await within(table).findByText('Rebecca'))
  })

  test('New MR save failure shows toast message with edits persisting', async () => {
    const consoleSpy = vi.spyOn(console, 'error')

    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const dexieError = new Error('this is a dexie error')

    dexiePerUserDataInstance.project_managements.put = () => Promise.reject(dexieError)

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/management-regimes/new'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await saveMR(user)

    const errorToast = await screen.findByTestId('management-regime-toast-error')
    expect(errorToast).toBeInTheDocument()
    expect(consoleSpy).toHaveBeenCalledWith(dexieError)

    // ensure the were not in edit mode, but new management regime mode
    expect(await screen.findByTestId('new-management-regime-form-title'))

    // edits persisted
    expect(screen.getByTestId('name-input')).toHaveValue('Rebecca')
    expect(screen.getByTestId('secondary-name-input')).toHaveValue('Becca')
    expect(screen.getByTestId('year-established-input')).toHaveValue(1980)
    expect(screen.getByTestId('area-input')).toHaveValue(40)
    expect(within(screen.getByTestId('parties')).getByTestId('parties-ngo-checkbox')).toBeChecked()
    expect(within(screen.getByTestId('rules')).getByTestId('rules-open-access-radio')).toBeChecked()
    expect(screen.getByTestId('compliance-select')).toHaveDisplayValue('somewhat')
  })
})
