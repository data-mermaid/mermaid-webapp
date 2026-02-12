import { describe, expect, test } from "vitest";
import { http, HttpResponse } from 'msw'
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
    expect(within(screen.getByTestId('rules')).getByTestId('rules-open-access-radio')).toBeChecked()
    expect(within(screen.getByTestId('rules')).getByTestId('rules-no-take-radio')).not.toBeChecked()
    expect(
      within(screen.getByTestId('rules')).getByTestId('rules-partial-restrictions-radio'),
    ).not.toBeChecked()
    expect(screen.getByTestId('compliance-select')).toHaveDisplayValue('choose...')
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

    expect(await screen.findByTestId('management-regime-toast-success')).toBeInTheDocument()

    expect(await screen.findByTestId('edit-management-regime-form-title'))

    expect(screen.getByTestId('name-input')).toHaveValue('Rebecca')
    expect(screen.getByTestId('secondary-name-input')).toHaveValue('Becca')
    expect(screen.getByTestId('year-established-input')).toHaveValue(1980)
    expect(screen.getByTestId('area-input')).toHaveValue(40)
    expect(within(screen.getByTestId('parties')).getByTestId('parties-ngo-checkbox')).toBeChecked()
    expect(within(screen.getByTestId('rules')).getByTestId('rules-open-access-radio')).toBeChecked()
    expect(screen.getByTestId('compliance-select')).toHaveDisplayValue('somewhat')
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

    expect(await screen.findByTestId('management-regime-toast-success')).toBeInTheDocument()

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
      http.post(`${apiBaseUrl}/push/`, () => {
        return HttpResponse.json(mock400StatusCodeForAllDataTypesPush)
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

    const errorToast = await screen.findByTestId('management-regime-toast-error')
    expect(errorToast).toBeInTheDocument()

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

  test('New MR save will handle 500 push status codes with a generic message and spare the user any api generated error details. Edits persist', async () => {
    mockMermaidApiAllSuccessful.use(
      // append the validated data on the pull response, because that is what the UI uses to update itself
      http.post(`${apiBaseUrl}/push/`, () => {
        return HttpResponse.json(mock500StatusCodeForAllDataTypesPush)
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

    const errorToast = await screen.findByTestId('management-regime-toast-error')
    expect(errorToast).toBeInTheDocument()

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
