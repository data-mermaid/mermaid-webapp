import { rest } from 'msw'
import React from 'react'

import { getMockDexieInstancesAllSuccess } from '../../../testUtilities/mockDexie'
import {
  mockMermaidApiAllSuccessful,
  renderAuthenticatedOnline,
  screen,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'
import App from '../../App'
import {
  mock400StatusCodeForAllDataTypesPush,
  mock500StatusCodeForAllDataTypesPush,
} from '../../../testUtilities/mockPushStatusCodes'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

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

describe('Online', () => {
  test('New MR button navigates to new MR form properly', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    const { user } = renderAuthenticatedOnline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/management-regimes/'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await user.click(await screen.findByTestId('new-management-regime-button'))

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

    const { user } = renderAuthenticatedOnline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/management-regimes/new'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await saveMR(user)

    expect(
      await screen.findByText('The management regime has been saved on your computer and online.'),
    )

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
    expect(screen.getByLabelText('Compliance')).toHaveDisplayValue('somewhat')
  })
  test('New MR save success show new record in MR table', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    const { user } = renderAuthenticatedOnline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/management-regimes/new'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await saveMR(user)

    expect(
      await screen.findByText('The management regime has been saved on your computer and online.'),
    )

    const sideNav = await screen.findByTestId('content-page-side-nav')

    await user.click(within(sideNav).getByTestId('nav-management-regimes'))

    // show all the records
    await user.selectOptions(await screen.findByTestId('page-size-selector'), '4')
    const table = await screen.findByRole('table')

    const tableRows = await screen.findAllByRole('row')

    // 5 here because the header row + the 3 mock records + the one we just created
    expect(tableRows).toHaveLength(5)

    expect(await within(table).findByText('Rebecca'))
  })
  test('New MR save will handle 400 push status codes by passing on reasoning to the user. Edits persist', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    mockMermaidApiAllSuccessful.use(
      // append the validated data on the pull response, because that is what the UI uses to update itself
      rest.post(`${apiBaseUrl}/push/`, (_req, res, ctx) => {
        return res(ctx.json(mock400StatusCodeForAllDataTypesPush))
      }),
    )

    const { user } = renderAuthenticatedOnline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/management-regimes/new'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await saveMR(user)

    expect(await screen.findByTestId('management-regime-toast-error')).toHaveTextContent(
      'The management regime has been saved on your computer, but not online.',
    )
    expect(await screen.findByTestId('management-regime-toast-error')).toHaveTextContent(
      'an error message from api',
    )
    expect(await screen.findByTestId('management-regime-toast-error')).toHaveTextContent(
      'another error message from api',
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
    expect(screen.getByLabelText('Compliance')).toHaveDisplayValue('somewhat')
  })

  test('New MR save will handle 500 push status codes with a generic message and spare the user any api generated error details. Edits persist', async () => {
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
        initialEntries: ['/projects/5/management-regimes/new'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await saveMR(user)

    expect(await screen.findByTestId('management-regime-toast-error')).toHaveTextContent(
      'The management regime has been saved on your computer, but not online.',
    )
    expect(await screen.findByTestId('management-regime-toast-error')).toHaveTextContent(
      'MERMAID error: please contact support@datamermaid.org',
    )
    expect(await screen.findByTestId('management-regime-toast-error')).not.toHaveTextContent(
      'an error message from api',
    )
    expect(await screen.findByTestId('management-regime-toast-error')).not.toHaveTextContent(
      'another error message from api',
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
    expect(screen.getByLabelText('Compliance')).toHaveDisplayValue('somewhat')
  })
})
