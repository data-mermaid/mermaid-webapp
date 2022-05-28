import React from 'react'
import userEvent from '@testing-library/user-event'

import { getMockDexieInstancesAllSuccess } from '../../../testUtilities/mockDexie'
import {
  renderAuthenticatedOnline,
  screen,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'
import App from '../../App'

const saveMR = async () => {
  userEvent.type(await screen.findByLabelText('Name'), 'Rebecca')
  userEvent.type(screen.getByLabelText('Secondary Name'), 'Becca')
  userEvent.type(screen.getByLabelText('Year Established'), '1980')
  userEvent.type(screen.getByLabelText('Area'), '40')
  userEvent.click(within(screen.getByLabelText('Parties')).getByLabelText('NGO'))
  userEvent.click(
    within(screen.getByLabelText('Rules')).getByLabelText('Open Access', { exact: false }),
  )
  userEvent.click(within(screen.getByLabelText('Compliance')).getByLabelText('somewhat'))
  userEvent.type(screen.getByLabelText('Notes'), 'some notes')

  userEvent.click(screen.getByText('Save', { selector: 'button' }))
}

describe('Online', () => {
  test('New MR button navigates to new MR form properly', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
      initialEntries: ['/projects/5/management-regimes/'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    })

    userEvent.click(await screen.findByRole('link', { name: 'New MR' }))

    // ensure the were not in edit mode, but new management regime mode
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
    ).not.toBeChecked()
    expect(
      within(screen.getByLabelText('Rules')).getByLabelText('No Take', { exact: false }),
    ).not.toBeChecked()
    expect(
      within(screen.getByLabelText('Rules')).getByLabelText('Partial Restrictions', {
        exact: false,
      }),
    ).not.toBeChecked()
    expect(within(screen.getByLabelText('Compliance')).getByLabelText('full')).not.toBeChecked()
    expect(within(screen.getByLabelText('Compliance')).getByLabelText('low')).not.toBeChecked()
    expect(within(screen.getByLabelText('Compliance')).getByLabelText('none')).not.toBeChecked()
    expect(within(screen.getByLabelText('Compliance')).getByLabelText('somewhat')).not.toBeChecked()
  })
  test('New MR save success shows saved inputs, toast, and navigates to the edit MR page for the newly created MR', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
      initialEntries: ['/projects/5/management-regimes/new'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    })

    await saveMR()

    expect(await screen.findByText('Management Regime saved.'))

    // ensure the new form is now the edit form
    expect(await screen.findByTestId('edit-management-regime-form-title'))

    expect(screen.getByLabelText('Name')).toHaveValue('Rebecca')
    expect(screen.getByLabelText('Secondary Name')).toHaveValue('Becca')
    expect(screen.getByLabelText('Year Established')).toHaveValue(1980)
    expect(screen.getByLabelText('Area')).toHaveValue(40)
    expect(within(screen.getByLabelText('Parties')).getByLabelText('NGO')).toBeChecked()
    expect(
      within(screen.getByLabelText('Rules')).getByLabelText('Open Access', { exact: false }),
    ).toBeChecked()
    expect(within(screen.getByLabelText('Compliance')).getByLabelText('somewhat')).toBeChecked()
  })
  test('New MR save success show new record in MR table', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
      initialEntries: ['/projects/5/management-regimes/new'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    })

    await saveMR()

    expect(await screen.findByText('Management Regime saved.'))

    const sideNav = await screen.findByTestId('content-page-side-nav')

    userEvent.click(within(sideNav).getByText('Management Regimes'))

    // show all the records
    userEvent.selectOptions(await screen.findByTestId('page-size-selector'), '100')
    const table = await screen.findByRole('table')

    const tableRows = await screen.findAllByRole('row')

    // 5 here because the header row + the 3 mock records + the one we just created
    expect(tableRows).toHaveLength(5)

    expect(await within(table).findByText('Rebecca'))
  })
  test('New MR save failure shows toast message with edits persisting', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    dexiePerUserDataInstance.project_managements.put = () => Promise.reject()

    renderAuthenticatedOnline(<App dexieCurrentUserInstance={dexieCurrentUserInstance} />, {
      initialEntries: ['/projects/5/management-regimes/new'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    })

    await saveMR()

    expect(
      await screen.findByText('Something went wrong. The management regime has not been saved.'),
    )

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
    expect(within(screen.getByLabelText('Compliance')).getByLabelText('somewhat')).toBeChecked()
  })
})
