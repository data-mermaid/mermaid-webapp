import '@testing-library/jest-dom'
import { Route, Routes } from 'react-router-dom'
import React from 'react'

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
    <Routes>
      <Route
        path="/projects/:projectId/collecting/fishbelt/:recordId"
        element={<FishBeltForm isNewRecord={false} />}
      />
    </Routes>,
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
  expect(screen.getByLabelText('Width'))
  expect(screen.getByLabelText('Fish Size Bin (cm)'))
  expect(screen.getByLabelText('Reef Slope'))
  expect(screen.getByLabelText('Visibility'))
  expect(screen.getByLabelText('Current'))
  expect(screen.getByLabelText('Relative Depth'))
  expect(screen.getByLabelText('Tide'))
  expect(screen.getByLabelText('Notes'))
  expect(screen.getByRole('button', { name: /Delete Record/i })).toBeEnabled()
})

test('FishBelt component in CREATE NEW mode renders with the expected UI elements', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(
    <Routes>
      <Route path="/projects/:projectId/collecting/fishbelt/:recordId" element={<FishBeltForm />} />
    </Routes>,
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
  expect(screen.getByLabelText('Width'))
  expect(screen.getByLabelText('Fish Size Bin (cm)'))
  expect(screen.getByLabelText('Reef Slope'))
  expect(screen.getByLabelText('Visibility'))
  expect(screen.getByLabelText('Current'))
  expect(screen.getByLabelText('Relative Depth'))
  expect(screen.getByLabelText('Tide'))
  expect(screen.getByLabelText('Notes'))
  expect(screen.getByRole('button', { name: /Delete Record/i })).toBeDisabled()
})

test('FishBelt component in EDIT mode - form inputs are initialized with the correct values', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  renderAuthenticatedOnline(
    <Routes>
      <Route
        path="/projects/:projectId/collecting/fishbelt/:recordId"
        element={<FishBeltForm isNewRecord={false} />}
      />
    </Routes>,
    {
      initialEntries: ['/projects/5/collecting/fishbelt/2'],
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  expect(screen.getByLabelText('Site')).toHaveDisplayValue('Site D')
  expect(screen.getByLabelText('Management')).toHaveDisplayValue(
    'Management Regimes C [Management Regimes 3]',
  )
  expect(screen.getByLabelText('Depth')).toHaveValue(10)
  expect(screen.getByLabelText('Sample Date')).toHaveValue('2021-03-02')
  expect(screen.getByLabelText('Sample Time')).toHaveValue('11:55')
  expect(screen.getByLabelText('Transect Number')).toHaveValue(2)
  expect(screen.getByLabelText('Label')).toHaveValue('FB-2')
  expect(screen.getByLabelText('Transect Length Surveyed')).toHaveValue(6)
  expect(screen.getByDisplayValue('flat'))
  expect(screen.getByLabelText('Width')).toHaveDisplayValue('2m')
  expect(screen.getByLabelText('Fish Size Bin (cm)')).toHaveDisplayValue('5')
  expect(screen.getByLabelText('Reef Slope')).toHaveDisplayValue('flat')
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
    <Routes>
      <Route
        path="/projects/:projectId/collecting/fishbelt/:recordId"
        element={<FishBeltForm isNewRecord={false} />}
      />
    </Routes>,
    {
      initialEntries: ['/projects/5/collecting/fishbelt/2'],
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const collectButtonGroups = screen.getByTestId('collect-record-form-buttons')
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
    <Routes>
      <Route
        path="/projects/:projectId/collecting/fishbelt/:recordId"
        element={<FishBeltForm isNewRecord={false} />}
      />
    </Routes>,
    {
      initialEntries: ['/projects/5/collecting/fishbelt/2'],
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const collectButtonGroups = screen.getByTestId('collect-record-form-buttons')
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

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route
        path="/projects/:projectId/collecting/fishbelt/:recordId"
        element={<FishBeltForm isNewRecord={false} />}
      />
    </Routes>,
    {
      initialEntries: ['/projects/5/collecting/fishbelt/2'],
      dexiePerUserDataInstance,
      isSyncInProgressOverride: true,
    },
  )

  await waitForElementToBeRemoved(() => screen.queryByLabelText('project pages loading indicator'))

  const observationsBeforeAdd = screen.getAllByRole('table')[0]

  expect(within(observationsBeforeAdd).getAllByRole('row').length).toEqual(4)

  await user.click(screen.getByRole('button', { name: 'Add Row' }))

  const observationsAfterAdd = screen.getAllByRole('table')[0]

  expect(within(observationsAfterAdd).getAllByRole('row').length).toEqual(5)
})

test('Fishbelt observations: delete observation button deleted observation', async () => {
  const { dexiePerUserDataInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  const { user } = renderAuthenticatedOnline(
    <Routes>
      <Route
        path="/projects/:projectId/collecting/fishbelt/:recordId"
        element={<FishBeltForm isNewRecord={false} />}
      />
    </Routes>,
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

  await user.click(within(observationsTableBeforeDelete).getAllByLabelText('Delete Observation')[1])

  const formAfterDelete = screen.getByRole('form')
  const observationsTableAfterDelete = within(formAfterDelete).getAllByRole('table')[0]

  expect(within(observationsTableAfterDelete).getAllByRole('row').length).toEqual(3)
  expect(within(observationsTableAfterDelete).queryByDisplayValue(2)).not.toBeInTheDocument()
})
