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

import FishBelt from '../FishBelt'
import { getMockDexieInstanceAllSuccess } from '../../../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'

const fakeCurrentUser = {
  id: 'fake-id',
  first_name: 'FakeFirstName',
}

test('FishBelt observations size shows a numeric input when fish bin size is undefined', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting/fishbelt">
      <FishBelt isNewRecord={false} currentUser={fakeCurrentUser} />
    </Route>,
    {
      isSyncInProgressOverride: true,
      dexieInstance,
      initialEntries: ['/projects/5/collecting/fishbelt/'],
    },
  )
  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('project pages loading indicator'),
  )
  const fishbeltForm = screen.getByRole('form')

  userEvent.click(within(fishbeltForm).getByRole('button', { name: 'Add Row' }))

  const observationsTable = within(fishbeltForm).getAllByRole('table')[0]

  const sizeInput = within(observationsTable).getByLabelText('Size')

  expect(sizeInput).toHaveAttribute('type', 'number')
})

test('FishBelt observations size shows a numeric input when fish bin size is undefined', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting/fishbelt">
      <FishBelt isNewRecord={false} currentUser={fakeCurrentUser} />
    </Route>,
    {
      isSyncInProgressOverride: true,
      dexieInstance,
      initialEntries: ['/projects/5/collecting/fishbelt/'],
    },
  )
  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('project pages loading indicator'),
  )
  const fishbeltForm = screen.getByRole('form')

  const bin1Radio = within(fishbeltForm).getByLabelText('1')

  userEvent.click(bin1Radio)

  userEvent.click(within(fishbeltForm).getByRole('button', { name: 'Add Row' }))

  const observationsTable = within(fishbeltForm).getAllByRole('table')[0]

  const sizeInput = await within(observationsTable).findByLabelText('Size')

  expect(sizeInput).toHaveAttribute('type', 'number')
})

test('FishBelt observations size shows a select input when fish bin size is 5', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting/fishbelt">
      <FishBelt isNewRecord={false} currentUser={fakeCurrentUser} />
    </Route>,
    {
      isSyncInProgressOverride: true,
      dexieInstance,
      initialEntries: ['/projects/5/collecting/fishbelt/'],
    },
  )
  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('project pages loading indicator'),
  )
  const fishbeltForm = screen.getByRole('form')

  const bin5Radio = within(fishbeltForm).getByLabelText('5')

  userEvent.click(bin5Radio)

  userEvent.click(within(fishbeltForm).getByRole('button', { name: 'Add Row' }))

  const observationsTable = within(fishbeltForm).getAllByRole('table')[0]

  const sizeInput = await within(observationsTable).findByLabelText('Size')

  const areSizeOptions = within(sizeInput).getAllByRole('option').length > 0

  expect(areSizeOptions)
})

test('FishBelt observations size shows a select input when fish bin size is 10', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting/fishbelt">
      <FishBelt isNewRecord={false} currentUser={fakeCurrentUser} />
    </Route>,
    {
      isSyncInProgressOverride: true,
      dexieInstance,
      initialEntries: ['/projects/5/collecting/fishbelt/'],
    },
  )
  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('project pages loading indicator'),
  )
  const fishbeltForm = screen.getByRole('form')

  const bin10Radio = within(fishbeltForm).getByLabelText('10')

  userEvent.click(bin10Radio)

  userEvent.click(within(fishbeltForm).getByRole('button', { name: 'Add Row' }))

  const observationsTable = within(fishbeltForm).getAllByRole('table')[0]

  const sizeInput = await within(observationsTable).findByLabelText('Size')

  const areSizeOptions = within(sizeInput).getAllByRole('option').length > 0

  expect(areSizeOptions)
})

test('FishBelt observations size shows a select input when fish bin size is AGRRA', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting/fishbelt">
      <FishBelt isNewRecord={false} currentUser={fakeCurrentUser} />
    </Route>,
    {
      isSyncInProgressOverride: true,
      dexieInstance,
      initialEntries: ['/projects/5/collecting/fishbelt/'],
    },
  )
  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('project pages loading indicator'),
  )
  const fishbeltForm = screen.getByRole('form')

  const binAGRRARadio = within(fishbeltForm).getByLabelText('AGRRA')

  userEvent.click(binAGRRARadio)

  userEvent.click(within(fishbeltForm).getByRole('button', { name: 'Add Row' }))

  const observationsTable = within(fishbeltForm).getAllByRole('table')[0]

  const sizeInput = await within(observationsTable).findByLabelText('Size')

  const areSizeOptions = within(sizeInput).getAllByRole('option').length > 0

  expect(areSizeOptions)
})

test('Fishbelt observations shows extra input for sizes over 50', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting/fishbelt">
      <FishBelt isNewRecord={false} currentUser={fakeCurrentUser} />
    </Route>,
    {
      isSyncInProgressOverride: true,
      dexieInstance,
      initialEntries: ['/projects/5/collecting/fishbelt/'],
    },
  )
  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('project pages loading indicator'),
  )
  const fishbeltForm = screen.getByRole('form')

  const binAGRRARadio = within(fishbeltForm).getByLabelText('AGRRA')

  userEvent.click(binAGRRARadio)

  userEvent.click(within(fishbeltForm).getByRole('button', { name: 'Add Row' }))

  const observationsTable = within(fishbeltForm).getAllByRole('table')[0]

  const sizeInput = await within(observationsTable).findByLabelText('Size')

  userEvent.selectOptions(sizeInput, '50')

  const sizeInputs = await within(observationsTable).findAllByLabelText('Size')

  await waitFor(() => expect(sizeInputs.length).toEqual(2))
})

test('Fishbelt observations hide and show fish name reference link appropriately', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexieInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting/fishbelt">
      <FishBelt isNewRecord={false} currentUser={fakeCurrentUser} />
    </Route>,
    {
      isSyncInProgressOverride: true,
      dexieInstance,
      initialEntries: ['/projects/5/collecting/fishbelt/'],
    },
  )

  await waitForElementToBeRemoved(() =>
    screen.queryByLabelText('project pages loading indicator'),
  )

  userEvent.click(await screen.findByRole('button', { name: 'Add Row' }))

  // wait for new row to show up
  await screen.findByLabelText('Size')

  expect(screen.queryByLabelText('fish name reference')).not.toBeInTheDocument()

  const fishNameInput = await screen.findByLabelText('Fish Name')

  userEvent.type(fishNameInput, 'neb')

  const fishNameList = screen.getByRole('listbox')

  const nebriusOption = screen.getByRole('option', {
    name: 'Nebrius',
  })

  userEvent.selectOptions(fishNameList, nebriusOption)

  expect(
    await screen.findByLabelText('fish name reference'),
  ).toBeInTheDocument()
})
