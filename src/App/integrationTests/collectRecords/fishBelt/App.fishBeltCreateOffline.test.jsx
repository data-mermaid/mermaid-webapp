import '@testing-library/jest-dom'
import React from 'react'

import {
  screen,
  within,
  renderAuthenticatedOffline,
  waitFor,
  waitForElementToBeRemoved,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import App from '../../../App'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'

const saveFishbeltRecord = async (user) => {
  await user.selectOptions(await screen.findByLabelText('Site'), '1')
  await user.selectOptions(screen.getByLabelText('Management'), '2')
  await user.type(screen.getByTestId('depth-input'), '10000')
  await user.type(screen.getByTestId('sample_date-input'), '2021-04-21')
  await user.type(screen.getByTestId('sample_time-input'), '12:34')
  await user.type(screen.getByTestId('transect_number-input'), '56')
  await user.type(screen.getByTestId('label-input'), 'some label')
  await user.type(screen.getByTestId('len_surveyed-input'), '2')
  await user.selectOptions(
    screen.getByTestId('width-select'),
    '228c932d-b5da-4464-b0df-d15a05c05c02',
  )
  await user.selectOptions(
    screen.getByTestId('size_bin-select'),
    '67c1356f-e0a7-4383-8034-77b2f36e1a49',
  )
  await user.selectOptions(
    screen.getByTestId('reef_slope-select'),
    'c04bcf7e-2d5a-48d3-817a-5eb2a213b6fa',
  )
  await user.selectOptions(
    screen.getByTestId('visibility-select'),
    'a3ba3f14-330d-47ee-9763-bc32d37d03a5',
  )
  await user.selectOptions(
    screen.getByTestId('current-select'),
    'e5dcb32c-614d-44ed-8155-5911b7ee774a',
  )
  await user.selectOptions(
    screen.getByTestId('relative_depth-select'),
    '8f381e71-219e-469c-8c13-231b088fb861',
  )
  await user.selectOptions(
    screen.getByTestId('tide-select'),
    '97a63da7-e98c-4be7-8f13-e95d38aa17ae',
  )
  await user.type(screen.getByTestId('notes-textarea'), 'some notes')
  await user.click(screen.getByText('Save', { selector: 'button' }))
}
describe('Offline', () => {
  test('New fishbelt save success shows saved input values, toast, and navigates to edit fishbelt page for new record', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/fishbelt/'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await screen.findByLabelText('project pages loading indicator')
    await waitForElementToBeRemoved(() =>
      screen.queryByLabelText('project pages loading indicator'),
    )

    await saveFishbeltRecord(user)

    expect(await screen.findByText('Record saved.'))

    // ensure the new form is now the edit form
    expect(await screen.findByTestId('edit-collect-record-form-title'))

    expect(screen.getByLabelText('Site')).toHaveDisplayValue('Site A')
    expect(screen.getByLabelText('Management')).toHaveDisplayValue(
      'Management Regimes B [Management Regimes 2]',
    )
    expect(screen.getByTestId('depth-input')).toHaveValue(10000)
    expect(screen.getByTestId('sample_date-input')).toHaveValue('2021-04-21')
    expect(screen.getByTestId('sample_time-input')).toHaveValue('12:34')
    expect(screen.getByTestId('transect_number-input')).toHaveValue(56)
    expect(screen.getByTestId('label-input')).toHaveValue('some label')
    expect(screen.getByTestId('len_surveyed-input')).toHaveValue(2)
    expect(screen.getByTestId('width-select')).toHaveDisplayValue('10m')
    expect(screen.getByTestId('size_bin-select')).toHaveDisplayValue('1')
    expect(screen.getByTestId('reef_slope-select')).toHaveDisplayValue('flat')
    expect(screen.getByTestId('visibility-select')).toHaveDisplayValue('1-5m - poor')
    expect(screen.getByTestId('current-select')).toHaveDisplayValue('high')
    expect(screen.getByTestId('relative_depth-select')).toHaveDisplayValue('deep')
    expect(screen.getByTestId('tide-select')).toHaveDisplayValue('falling')
    expect(screen.getByTestId('notes-textarea')).toHaveValue('some notes')
  })

  test('New fishbelt save success show new record in collecting table', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/fishbelt/'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await saveFishbeltRecord(user)

    expect(await screen.findByText('Record saved.'))

    const sideNav = await screen.findByTestId('content-page-side-nav')

    await user.click(within(sideNav).getByText('Collecting'))

    const pageSizeSelector = await screen.findByTestId('page-size-selector')

    // show all the records
    await waitFor(() => expect(pageSizeSelector))
    await user.selectOptions(pageSizeSelector, '22')
    const table = await screen.findByRole('table')

    const linksToFishbeltRecords = within(table).getAllByRole('link', { name: 'Fish Belt' })

    // 17 the 16 mock records + the one we just created
    expect(linksToFishbeltRecords).toHaveLength(17)

    // expect unique depth as proxy for new fishbelt
    expect(await within(table).findByText('10000'))
  })

  test('New fishbelt save failure shows toast message with edits persisting', async () => {
    const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

    await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

    dexiePerUserDataInstance.collect_records.put = () => Promise.reject()
    const { user } = renderAuthenticatedOffline(
      <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
      {
        initialEntries: ['/projects/5/collecting/fishbelt/'],
        dexiePerUserDataInstance,
        dexieCurrentUserInstance,
      },
    )

    await screen.findByLabelText('project pages loading indicator')
    await waitForElementToBeRemoved(() =>
      screen.queryByLabelText('project pages loading indicator'),
    )

    await saveFishbeltRecord(user)

    expect(await screen.findByText('The sample unit has not been saved.'))

    // ensure the were not in edit mode, but new fish belt mode
    expect(
      screen.getByText('Fish Belt', {
        selector: 'h2',
      }),
    )

    expect(screen.getByLabelText('Site')).toHaveDisplayValue('Site A')
    expect(screen.getByLabelText('Management')).toHaveDisplayValue(
      'Management Regimes B [Management Regimes 2]',
    )
    expect(screen.getByTestId('depth-input')).toHaveValue(10000)
    expect(screen.getByTestId('sample_date-input')).toHaveValue('2021-04-21')
    expect(screen.getByTestId('sample_time-input')).toHaveValue('12:34')
    expect(screen.getByTestId('transect_number-input')).toHaveValue(56)
    expect(screen.getByTestId('label-input')).toHaveValue('some label')
    expect(screen.getByTestId('len_surveyed-input')).toHaveValue(2)
    expect(screen.getByTestId('width-select')).toHaveDisplayValue('10m')
    expect(screen.getByTestId('size_bin-select')).toHaveDisplayValue('1')
    expect(screen.getByTestId('reef_slope-select')).toHaveDisplayValue('flat')
    expect(screen.getByTestId('visibility-select')).toHaveDisplayValue('1-5m - poor')
    expect(screen.getByTestId('current-select')).toHaveDisplayValue('high')
    expect(screen.getByTestId('relative_depth-select')).toHaveDisplayValue('deep')
    expect(screen.getByTestId('tide-select')).toHaveDisplayValue('falling')
    expect(screen.getByTestId('notes-textarea')).toHaveValue('some notes')
  })
})
