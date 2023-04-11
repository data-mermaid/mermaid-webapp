import '@testing-library/jest-dom/extend-expect'
import { Route } from 'react-router-dom'
import React from 'react'
import userEvent from '@testing-library/user-event'

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

test('FishBelt observations size shows a numeric input when fish size bin is 1', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting/fishbelt">
      <FishBeltForm isNewRecord={false} currentUser={fakeCurrentUser} />
    </Route>,
    {
      isSyncInProgressOverride: true,
      dexiePerUserDataInstance,
      initialEntries: ['/projects/5/collecting/fishbelt/'],
    },
  )
  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))
  const fishbeltForm = screen.getByRole('form')

  const bin1Radio = within(fishbeltForm).getByLabelText('1')

  userEvent.click(bin1Radio)

  const observationsTable = within(fishbeltForm).getAllByRole('table')[0]

  const sizeInput = await within(observationsTable).findByLabelText('Size (cm)')

  // coming out as null for some reason
  // previous: expect(sizeInput).toHaveAttribute('type', 'number')
  // input now includes: type="text" inputmode="numeric" pattern="[0-9]*"
  expect(sizeInput).toHaveAttribute('inputmode', 'numeric')
})

test('FishBelt observations size shows a select input when fish size bin is 5', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting/fishbelt">
      <FishBeltForm isNewRecord={false} currentUser={fakeCurrentUser} />
    </Route>,
    {
      isSyncInProgressOverride: true,
      dexiePerUserDataInstance,
      initialEntries: ['/projects/5/collecting/fishbelt/'],
    },
  )
  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))
  const fishbeltForm = screen.getByRole('form')

  const bin5Radio = within(fishbeltForm).getByLabelText('5')

  userEvent.click(bin5Radio)

  const observationsTable = within(fishbeltForm).getAllByRole('table')[0]

  const sizeInput = await within(observationsTable).findByLabelText('Size (cm)')

  const areSizeOptions = within(sizeInput).getAllByRole('option').length > 0

  expect(areSizeOptions)
})

test('FishBelt observations size shows a select input when fish size bin is 10', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting/fishbelt">
      <FishBeltForm isNewRecord={false} currentUser={fakeCurrentUser} />
    </Route>,
    {
      isSyncInProgressOverride: true,
      dexiePerUserDataInstance,
      initialEntries: ['/projects/5/collecting/fishbelt/'],
    },
  )
  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))
  const fishbeltForm = screen.getByRole('form')

  const bin10Radio = within(fishbeltForm).getByLabelText('10')

  userEvent.click(bin10Radio)

  const observationsTable = within(fishbeltForm).getAllByRole('table')[0]

  const sizeInput = await within(observationsTable).findByLabelText('Size (cm)')

  const areSizeOptions = within(sizeInput).getAllByRole('option').length > 0

  expect(areSizeOptions)
})

test('FishBelt observations size shows a select input when fish size bin is AGRRA', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting/fishbelt">
      <FishBeltForm isNewRecord={false} currentUser={fakeCurrentUser} />
    </Route>,
    {
      isSyncInProgressOverride: true,
      dexiePerUserDataInstance,
      initialEntries: ['/projects/5/collecting/fishbelt/'],
    },
  )
  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))
  const fishbeltForm = screen.getByRole('form')

  const binAGRRARadio = within(fishbeltForm).getByLabelText('AGRRA')

  userEvent.click(binAGRRARadio)

  const observationsTable = within(fishbeltForm).getAllByRole('table')[0]

  const sizeInput = await within(observationsTable).findByLabelText('Size (cm)')

  const areSizeOptions = within(sizeInput).getAllByRole('option').length > 0

  expect(areSizeOptions)
})

test('Fishbelt observations shows extra input for sizes over 50', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting/fishbelt">
      <FishBeltForm isNewRecord={false} currentUser={fakeCurrentUser} />
    </Route>,
    {
      isSyncInProgressOverride: true,
      dexiePerUserDataInstance,
      initialEntries: ['/projects/5/collecting/fishbelt/'],
    },
  )
  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))
  const fishbeltForm = screen.getByRole('form')

  const binAGRRARadio = within(fishbeltForm).getByLabelText('AGRRA')

  userEvent.click(binAGRRARadio)

  const observationsTable = within(fishbeltForm).getAllByRole('table')[0]

  const sizeInput = await within(observationsTable).findByLabelText('Size (cm)')

  userEvent.selectOptions(sizeInput, '50')

  const sizeInputs = await within(observationsTable).findAllByLabelText('Size (cm)')

  await waitFor(() => expect(sizeInputs.length).toEqual(2))
})

test('Fish size bin radios are disabled when there are active observations, delete all observations -> Fish size bin radios are re-enabled', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting/fishbelt/:recordId">
      <FishBeltForm isNewRecord={false} currentUser={fakeCurrentUser} />
    </Route>,
    {
      initialEntries: ['/projects/5/collecting/fishbelt/2'],
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const fishbeltForm = screen.getByRole('form')

  const bin1Radio = within(fishbeltForm).getByLabelText('1')
  const bin5Radio = within(fishbeltForm).getByLabelText('5')
  const bin10Radio = within(fishbeltForm).getByLabelText('10')
  const binAGRRARadio = within(fishbeltForm).getByLabelText('AGRRA')
  const binWCSIndiaRadio = within(fishbeltForm).getByLabelText('WCS India')

  expect(bin1Radio).toBeDisabled()
  expect(bin5Radio).toBeDisabled()
  expect(bin10Radio).toBeDisabled()
  expect(binAGRRARadio).toBeDisabled()
  expect(binWCSIndiaRadio).toBeDisabled()

  const observationRows = within(screen.getByLabelText('Observations')).getAllByRole('row')

  userEvent.click(within(observationRows[1]).getByLabelText('Delete Observation'))
  userEvent.click(within(observationRows[2]).getByLabelText('Delete Observation'))
  userEvent.click(within(observationRows[3]).getByLabelText('Delete Observation'))

  expect(bin1Radio).toBeEnabled()
  expect(bin5Radio).toBeEnabled()
  expect(bin10Radio).toBeEnabled()
  expect(binAGRRARadio).toBeEnabled()
  expect(binWCSIndiaRadio).toBeEnabled()
})
