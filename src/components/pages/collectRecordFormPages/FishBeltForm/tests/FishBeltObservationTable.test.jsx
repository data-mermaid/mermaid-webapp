import '@testing-library/jest-dom'
import { Route, Routes } from 'react-router-dom'
import React from 'react'

import {
  renderAuthenticatedOnline,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '../../../../../testUtilities/testingLibraryWithHelpers'

import FishBeltForm from '../FishBeltForm'
import { getMockDexieInstancesAllSuccess } from '../../../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'

const fakeCurrentUser = {
  id: 'fake-id',
  first_name: 'FakeFirstName',
}

test('FishBelt observations size shows a numeric pattern when fish size bin is 1', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route
        path="/projects/:projectId/collecting/fishbelt"
        element={<FishBeltForm isNewRecord={true} currentUser={fakeCurrentUser} />}
      />
    </Routes>,

    {
      isSyncInProgressOverride: true,
      dexiePerUserDataInstance,
      initialEntries: ['/projects/5/collecting/fishbelt/'],
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))
  const fishbeltForm = screen.getByRole('form')

  // Fish size bin select on 1
  await user.selectOptions(
    within(screen.getByTestId('size_bin')).getByRole('combobox'),
    '67c1356f-e0a7-4383-8034-77b2f36e1a49',
  )

  const observationsTable = within(fishbeltForm).getAllByRole('table')[0]

  const sizeInput = await within(observationsTable).findByTestId('fish-size-input')

  expect(sizeInput).toHaveAttribute('pattern', '[0-9]*')
})

test('FishBelt observations size shows a select input when fish size bin is 5', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route
        path="/projects/:projectId/collecting/fishbelt"
        element={<FishBeltForm isNewRecord={true} currentUser={fakeCurrentUser} />}
      />
    </Routes>,
    {
      isSyncInProgressOverride: true,
      dexiePerUserDataInstance,
      initialEntries: ['/projects/5/collecting/fishbelt/'],
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))
  const fishbeltForm = screen.getByRole('form')

  // Fish size bin select on 5
  await user.selectOptions(
    within(screen.getByTestId('size_bin')).getByRole('combobox'),
    'ab91e41a-c0d5-477f-baf3-f0571d7c0dcf',
  )

  const observationsTable = within(fishbeltForm).getAllByRole('table')[0]

  const sizeSelect = await within(observationsTable).findByTestId('fish-size-select')

  const areSizeOptions = within(sizeSelect).getAllByRole('option').length > 0

  expect(areSizeOptions)
})

test('FishBelt observations size shows a select input when fish size bin is 10', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route
        path="/projects/:projectId/collecting/fishbelt"
        element={<FishBeltForm isNewRecord={true} currentUser={fakeCurrentUser} />}
      />
    </Routes>,
    {
      isSyncInProgressOverride: true,
      dexiePerUserDataInstance,
      initialEntries: ['/projects/5/collecting/fishbelt/'],
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))
  const fishbeltForm = screen.getByRole('form')

  // Fish size bin select on 10
  await user.selectOptions(
    within(screen.getByTestId('size_bin')).getByRole('combobox'),
    '3232100a-a9b2-462c-955c-0dae7b72514f',
  )

  const observationsTable = within(fishbeltForm).getAllByRole('table')[0]

  const sizeSelect = await within(observationsTable).findByTestId('fish-size-select')

  const areSizeOptions = within(sizeSelect).getAllByRole('option').length > 0

  expect(areSizeOptions)
})

test('FishBelt observations size shows a select input when fish size bin is AGRRA', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route
        path="/projects/:projectId/collecting/fishbelt"
        element={<FishBeltForm isNewRecord={true} currentUser={fakeCurrentUser} />}
      />
    </Routes>,
    {
      isSyncInProgressOverride: true,
      dexiePerUserDataInstance,
      initialEntries: ['/projects/5/collecting/fishbelt/'],
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))
  const fishbeltForm = screen.getByRole('form')

  // Fish size bin select on AGRRA
  await user.selectOptions(
    within(screen.getByTestId('size_bin')).getByRole('combobox'),
    'ccef720a-a1c9-4956-906d-09ed56f16249',
  )

  const observationsTable = within(fishbeltForm).getAllByRole('table')[0]

  const sizeSelect = await within(observationsTable).findByTestId('fish-size-select')

  const areSizeOptions = within(sizeSelect).getAllByRole('option').length > 0

  expect(areSizeOptions)
})

test('Fishbelt observations shows extra input for sizes over 50', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route
        path="/projects/:projectId/collecting/fishbelt"
        element={<FishBeltForm isNewRecord={true} currentUser={fakeCurrentUser} />}
      />
    </Routes>,
    {
      isSyncInProgressOverride: true,
      dexiePerUserDataInstance,
      initialEntries: ['/projects/5/collecting/fishbelt/'],
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))
  const fishbeltForm = screen.getByRole('form')

  // Fish size bin select on AGRRA
  await user.selectOptions(
    within(screen.getByTestId('size_bin')).getByRole('combobox'),
    'ccef720a-a1c9-4956-906d-09ed56f16249',
  )

  const observationsTable = within(fishbeltForm).getAllByRole('table')[0]

  const sizeSelect = await within(observationsTable).findByTestId('fish-size-select')
  await user.selectOptions(sizeSelect, '50')

  const sizeInput = await within(observationsTable).findByTestId('fish-size-50-input')
  await waitFor(() => expect(sizeInput).toBeInTheDocument())
})
