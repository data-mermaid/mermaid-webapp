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
  await user.type(await screen.findByLabelText('Name'), 'Rebecca')
  await user.type(screen.getByLabelText('Secondary Name'), 'Becca')
  await user.type(screen.getByLabelText('Year Established'), '1980')
  await user.type(screen.getByLabelText('Area'), '40')
  await user.click(within(screen.getByLabelText('Parties')).getByLabelText('NGO'))
  await user.click(
    within(screen.getByLabelText('Rules')).getByLabelText('Open Access', { exact: false }),
  )
  await user.selectOptions(
    screen.getByLabelText('Compliance'),
    'f76d7866-5b0d-428d-928c-738c2912d6e0',
  )
  await user.type(screen.getByLabelText('Notes'), 'some notes')

  await user.click(screen.getByText('Save', { selector: 'button' }))
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
    expect(
      await screen.findByText('Management Regime', {
        selector: 'h2',
      }),
    )

    // form empty
    expect(screen.getByLabelText('Name')).toHaveValue('')
    expect(screen.getByLabelText('Secondary Name')).toHaveValue('')
    expect(screen.getByLabelText('Year Established')).toHaveValue(null)
    expect(screen.getByLabelText('Area')).toHaveValue(null)

    const parties = screen.getByLabelText('Parties')

    expect(within(parties).getByLabelText('NGO')).not.toBeChecked()
    expect(within(parties).getByLabelText('community/local government')).not.toBeChecked()
    expect(within(parties).getByLabelText('government')).not.toBeChecked()
    expect(within(parties).getByLabelText('private sector')).not.toBeChecked()
    expect(
      within(screen.getByLabelText('Rules')).getByLabelText('Open Access', { exact: false }),
    ).toBeChecked()
    expect(
      within(screen.getByLabelText('Rules')).getByLabelText('No Take', { exact: false }),
    ).not.toBeChecked()
    expect(
      within(screen.getByLabelText('Rules')).getByLabelText('Partial Restrictions', {
        exact: false,
      }),
    ).not.toBeChecked()
    expect(screen.getByLabelText('Compliance')).toHaveDisplayValue('Choose...')
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

    expect(await screen.findByText('The management regime has been saved on your computer.'))

    // ensure the new form is now the edit form
    expect(await screen.findByTestId('edit-management-regime-form-title'))

    await waitFor(() => expect(screen.getByLabelText('Name')).toHaveValue('Rebecca'))
    expect(screen.getByLabelText('Secondary Name')).toHaveValue('Becca')
    expect(screen.getByLabelText('Year Established')).toHaveValue(1980)
    expect(screen.getByLabelText('Area')).toHaveValue(40)
    await waitFor(() =>
      expect(within(screen.getByLabelText('Parties')).getByLabelText('NGO')).toBeChecked(),
    )
    expect(
      within(screen.getByLabelText('Rules')).getByLabelText('Open Access', { exact: false }),
    ).toBeChecked()
    expect(screen.getByLabelText('Compliance')).toHaveDisplayValue('somewhat')
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

    expect(await screen.findByText('The management regime has been saved on your computer.'))

    const sideNav = await screen.findByTestId('content-page-side-nav')

    await user.click(within(sideNav).getByText('Management Regimes'))

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
    const consoleSpy = jest.spyOn(console, 'error')

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

    expect(await screen.findByTestId('management-regime-toast-error')).toHaveTextContent(
      'The management regime failed to save both on your computer and online.',
    )
    expect(consoleSpy).toHaveBeenCalledWith(dexieError)

    // ensure the were not in edit mode, but new management regime mode
    expect(
      screen.getByText('Management Regime', {
        selector: 'h2',
      }),
    )

    // edits persisted
    expect(screen.getByLabelText('Name')).toHaveValue('Rebecca')
    expect(screen.getByLabelText('Secondary Name')).toHaveValue('Becca')
    expect(screen.getByLabelText('Year Established')).toHaveValue(1980)
    expect(screen.getByLabelText('Area')).toHaveValue(40)
    expect(within(screen.getByLabelText('Parties')).getByLabelText('NGO')).toBeChecked()
    expect(
      within(screen.getByLabelText('Rules')).getByLabelText('Open Access', { exact: false }),
    ).toBeChecked()
    expect(screen.getByLabelText('Compliance')).toHaveDisplayValue('somewhat')
  })
})
