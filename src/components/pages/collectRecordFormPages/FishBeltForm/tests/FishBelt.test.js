import '@testing-library/jest-dom/extend-expect'
import { Route } from 'react-router-dom'
import React from 'react'
import userEvent from '@testing-library/user-event'

import {
  renderAuthenticatedOnline,
  renderAuthenticatedOffline,
  screen,
  waitForElementToBeRemoved,
  within,
} from '../../../../../testUtilities/testingLibraryWithHelpers'

import FishBeltForm from '../FishBeltForm'
import { getMockDexieInstancesAllSuccess } from '../../../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'

test('FishBelt component in EDIT mode renders with the expected UI elements', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting/fishbelt/:recordId">
      <FishBeltForm isNewRecord={false} />
    </Route>,
    {
      initialEntries: ['/projects/5/collecting/fishbelt/2'],
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const formTitle = screen.getByTestId('edit-collect-record-form-title')

  expect(within(formTitle).getByText('Site D'))
  expect(within(formTitle).getByText('2'))
  expect(within(formTitle).getByText('FB-2'))

  expect(
    screen.getByText('Sample Event', {
      selector: 'h2',
    }),
  )
  expect(
    screen.getByText('Transect', {
      selector: 'h2',
    }),
  )

  expect(screen.getByLabelText('Site'))
  expect(screen.getByLabelText('Management'))
  expect(screen.getByLabelText('Depth'))
  expect(screen.getByLabelText('Sample Date'))
  expect(screen.getByLabelText('Sample Time'))
  expect(screen.getByLabelText('Transect Number'))
  expect(screen.getByLabelText('Label'))
  expect(screen.getByLabelText('Transect Length Surveyed'))
  expect(screen.getByText(/width/i))
  expect(screen.getByText(/fish size bin/i))
  expect(screen.getByText(/reef slope/i))
  expect(screen.getByLabelText('Notes'))
  expect(screen.getByRole('button', { name: /Delete Record/i })).toBeEnabled()
})

test('FishBelt component in CREATE NEW mode renders with the expected UI elements', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting/fishbelt/:recordId">
      <FishBeltForm />
    </Route>,
    {
      initialEntries: ['/projects/5/collecting/fishbelt/2'],
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  expect(
    screen.getByText('Fish Belt', {
      selector: 'h2',
    }),
  )

  expect(
    screen.getByText('Sample Event', {
      selector: 'h2',
    }),
  )
  expect(
    screen.getByText('Transect', {
      selector: 'h2',
    }),
  )

  expect(screen.getByLabelText('Site'))
  expect(screen.getByLabelText('Management'))
  expect(screen.getByLabelText('Depth'))
  expect(screen.getByLabelText('Sample Date'))
  expect(screen.getByLabelText('Sample Time'))
  expect(screen.getByLabelText('Transect Number'))
  expect(screen.getByLabelText('Label'))
  expect(screen.getByLabelText('Transect Length Surveyed'))
  expect(screen.getByText(/width/i))
  expect(screen.getByText(/fish size bin/i))
  expect(screen.getByText(/reef slope/i))
  expect(screen.getByLabelText('Notes'))
  expect(screen.getByRole('button', { name: /Delete Record/i })).toBeDisabled()
})

test('FishBelt component in EDIT mode - form inputs are initialized with the correct values', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting/fishbelt/:recordId">
      <FishBeltForm isNewRecord={false} />
    </Route>,
    {
      initialEntries: ['/projects/5/collecting/fishbelt/2'],
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  // Site select
  expect(screen.getByDisplayValue('Site D'))
  // Management select
  expect(screen.getByDisplayValue('Management Regimes C'))
  expect(screen.getByLabelText('Depth')).toHaveValue(10)
  expect(screen.getByLabelText('Sample Date')).toHaveValue('2021-03-02')
  expect(screen.getByLabelText('Sample Time')).toHaveValue('11:55')
  expect(screen.getByLabelText('Transect Number')).toHaveValue(2)
  expect(screen.getByLabelText('Label')).toHaveValue('FB-2')
  expect(screen.getByLabelText('Transect Length Surveyed')).toHaveValue(6)
  // width radio
  expect(screen.getByLabelText('2m')).toBeChecked()
  // fish size bin radio
  expect(screen.getByLabelText('5')).toBeChecked()
  // reef slope radio
  expect(screen.getByLabelText('flat')).toBeChecked()
  expect(screen.getByLabelText('Notes')).toHaveValue('some fish notes')

  const observationsTable = screen.getByLabelText('Observations')

  const observationRows = within(observationsTable).getAllByRole('row')

  // three rows + one header row = 4
  expect(observationRows.length).toEqual(4)

  expect(within(observationRows[1]).getByDisplayValue('50+'))
  expect(within(observationRows[1]).getByDisplayValue('53'))
  expect(within(observationRows[1]).getByDisplayValue('1'))

  // observation record #2
  expect(within(observationRows[2]).getByDisplayValue('10 - 15'))
  expect(within(observationRows[2]).getByDisplayValue('2'))

  // observation record #3
  expect(within(observationRows[3]).getByDisplayValue('0 - 5'))
  expect(within(observationRows[3]).getByDisplayValue('4'))
})

test('FishBelt component in EDIT mode - button group shows save, validate and submit buttons when online', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting/fishbelt/:recordId">
      <FishBeltForm isNewRecord={false} />
    </Route>,
    {
      initialEntries: ['/projects/5/collecting/fishbelt/2'],
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const collectButtonGroups = screen.getByTestId('fishbelt-form-buttons')
  const saveButton = within(collectButtonGroups).getByRole('button', {
    name: 'Saved',
  })

  const validateButton = within(collectButtonGroups).getByRole('button', {
    name: 'Validate',
  })

  const submitButton = within(collectButtonGroups).getByRole('button', {
    name: 'Submit',
  })

  expect(saveButton).toBeInTheDocument()
  expect(validateButton).toBeInTheDocument()
  expect(submitButton).toBeInTheDocument()
})

test('FishBelt component in EDIT mode - button group shows only save button when offline', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOffline(
    <Route path="/projects/:projectId/collecting/fishbelt/:recordId">
      <FishBeltForm isNewRecord={false} />
    </Route>,
    {
      initialEntries: ['/projects/5/collecting/fishbelt/2'],
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const collectButtonGroups = screen.getByTestId('fishbelt-form-buttons')
  const saveButton = within(collectButtonGroups).getByRole('button', {
    name: 'Saved',
  })

  const validateButton = within(collectButtonGroups).queryByRole('button', {
    name: 'Validate',
  })

  const submitButton = within(collectButtonGroups).queryByRole('button', {
    name: 'Submit',
  })

  expect(saveButton).toBeInTheDocument()
  expect(validateButton).not.toBeInTheDocument()
  expect(submitButton).not.toBeInTheDocument()
})

test('Fishbelt observations: add row button adds a row', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting/fishbelt/:recordId">
      <FishBeltForm isNewRecord={false} />
    </Route>,
    {
      initialEntries: ['/projects/5/collecting/fishbelt/2'],
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const observationsBeforeAdd = screen.getAllByRole('table')[0]

  expect(within(observationsBeforeAdd).getAllByRole('row').length).toEqual(4)

  userEvent.click(screen.getByRole('button', { name: 'Add Row' }))

  const observationsAfterAdd = screen.getAllByRole('table')[0]

  expect(within(observationsAfterAdd).getAllByRole('row').length).toEqual(5)
})

test('Fishbelt observations: delete observation button deleted observation', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting/fishbelt/:recordId">
      <FishBeltForm isNewRecord={false} />
    </Route>,
    {
      initialEntries: ['/projects/5/collecting/fishbelt/2'],
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const formBeforeDelete = screen.getByRole('form')
  const observationsTableBeforeDelete = within(formBeforeDelete).getAllByRole('table')[0]

  expect(within(observationsTableBeforeDelete).getAllByRole('row').length).toEqual(4)
  expect(within(observationsTableBeforeDelete).getByDisplayValue(2))

  userEvent.click(within(observationsTableBeforeDelete).getAllByLabelText('Delete Observation')[1])

  const formAfterDelete = screen.getByRole('form')
  const observationsTableAfterDelete = within(formAfterDelete).getAllByRole('table')[0]

  expect(within(observationsTableAfterDelete).getAllByRole('row').length).toEqual(3)
  expect(within(observationsTableAfterDelete).queryByDisplayValue(2)).not.toBeInTheDocument()
})

test('FishBelt component in EDIT mode - when change binsize = 10, fish size values is not selected/null', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting/fishbelt/:recordId">
      <FishBeltForm isNewRecord={false} />
    </Route>,
    {
      initialEntries: ['/projects/5/collecting/fishbelt/2'],
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const fishbeltForm = screen.getByRole('form')

  const radioToSelect = within(fishbeltForm).getByLabelText('10')

  userEvent.click(radioToSelect)

  const observationsTable = await screen.findByLabelText('Observations')

  expect(within(observationsTable).getAllByLabelText('Size')[0]).not.toHaveValue()

  expect(within(observationsTable).getAllByLabelText('Size')[1]).not.toHaveValue()

  expect(within(observationsTable).getAllByLabelText('Size')[2]).not.toHaveValue()
})
test('FishBelt component in EDIT mode - when change binsize = AGRRA, fish size values is not selected/null', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting/fishbelt/:recordId">
      <FishBeltForm isNewRecord={false} />
    </Route>,
    {
      initialEntries: ['/projects/5/collecting/fishbelt/2'],
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const fishbeltForm = screen.getByRole('form')

  const radioToSelect = within(fishbeltForm).getByLabelText('AGRRA')

  userEvent.click(radioToSelect)

  const observationsTable = await screen.findByLabelText('Observations')

  expect(within(observationsTable).getAllByLabelText('Size')[0]).not.toHaveValue()

  expect(within(observationsTable).getAllByLabelText('Size')[1]).not.toHaveValue()

  expect(within(observationsTable).getAllByLabelText('Size')[2]).not.toHaveValue()
})
test('FishBelt component in EDIT mode - when change binsize = 1, fish size values get transfered to numeric inputs', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(
    <Route path="/projects/:projectId/collecting/fishbelt/:recordId">
      <FishBeltForm isNewRecord={false} />
    </Route>,
    {
      initialEntries: ['/projects/5/collecting/fishbelt/2'],
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))
  const fishbeltForm = screen.getByRole('form')

  const radioToSelect = within(fishbeltForm).getByLabelText('1')

  userEvent.click(radioToSelect)

  const observationsTable = screen.getByLabelText('Observations')

  const observationRows = within(observationsTable).getAllByRole('row')

  // three rows + one header row = 4
  expect(observationRows.length).toEqual(4)

  // observation record #1

  expect(within(observationRows[1]).getByDisplayValue('53'))

  // observation record #2
  expect(await within(observationRows[2]).findByDisplayValue('12.5'))

  // observation record #3
  expect(within(observationRows[3]).getByDisplayValue('2.5'))
})