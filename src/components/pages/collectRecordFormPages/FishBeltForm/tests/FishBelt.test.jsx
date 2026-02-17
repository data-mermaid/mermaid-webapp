import { expect, test } from 'vitest'
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

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  const formTitle = screen.getByTestId('record-form-title')

  expect(within(formTitle).getByText('Site D'))
  expect(within(formTitle).getByText('2'))
  expect(within(formTitle).getByText('FB-2'))

  expect(screen.getByTestId('site')).toBeInTheDocument()
  expect(screen.getByTestId('management')).toBeInTheDocument()
  expect(screen.getByTestId('depth')).toBeInTheDocument()
  expect(screen.getByTestId('sample-date')).toBeInTheDocument()
  expect(screen.getByTestId('sample-time')).toBeInTheDocument()
  expect(screen.getByTestId('transect-number')).toBeInTheDocument()
  expect(screen.getByTestId('label')).toBeInTheDocument()
  expect(screen.getByTestId('len-surveyed')).toBeInTheDocument()
  expect(screen.getByTestId('width')).toBeInTheDocument()
  expect(screen.getByTestId('size-bin')).toBeInTheDocument()
  expect(screen.getByTestId('reef-slope')).toBeInTheDocument()
  expect(screen.getByTestId('visibility')).toBeInTheDocument()
  expect(screen.getByTestId('current')).toBeInTheDocument()
  expect(screen.getByTestId('relative-depth')).toBeInTheDocument()
  expect(screen.getByTestId('tide')).toBeInTheDocument()
  expect(screen.getByTestId('notes')).toBeInTheDocument()
  expect(screen.getByTestId('delete-record-button')).toBeEnabled()
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

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  expect(screen.getByTestId('site')).toBeInTheDocument()
  expect(screen.getByTestId('management')).toBeInTheDocument()
  expect(screen.getByTestId('depth')).toBeInTheDocument()
  expect(screen.getByTestId('sample-date')).toBeInTheDocument()
  expect(screen.getByTestId('sample-time')).toBeInTheDocument()
  expect(screen.getByTestId('transect-number')).toBeInTheDocument()
  expect(screen.getByTestId('label')).toBeInTheDocument()
  expect(screen.getByTestId('len-surveyed')).toBeInTheDocument()
  expect(screen.getByTestId('width')).toBeInTheDocument()
  expect(screen.getByTestId('size-bin')).toBeInTheDocument()
  expect(screen.getByTestId('reef-slope')).toBeInTheDocument()
  expect(screen.getByTestId('visibility')).toBeInTheDocument()
  expect(screen.getByTestId('current')).toBeInTheDocument()
  expect(screen.getByTestId('relative-depth')).toBeInTheDocument()
  expect(screen.getByTestId('tide')).toBeInTheDocument()
  expect(screen.getByTestId('notes')).toBeInTheDocument()
  expect(screen.getByTestId('delete-record-button')).toBeDisabled()
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

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  expect(screen.getByTestId('site-select')).toHaveDisplayValue('Site D')
  expect(screen.getByTestId('management-select')).toHaveDisplayValue(
    'Management Regimes C [Management Regimes 3]',
  )
  expect(screen.getByTestId('depth-input')).toHaveValue(10)
  expect(screen.getByTestId('sample-date-input')).toHaveValue('2021-03-02')
  expect(screen.getByTestId('sample-time-input')).toHaveValue('11:55')
  expect(screen.getByTestId('transect-number-input')).toHaveValue(2)
  expect(screen.getByTestId('label-input')).toHaveValue('FB-2')
  expect(screen.getByTestId('len-surveyed-input')).toHaveValue(6)
  expect(screen.getByTestId('width-select')).toHaveDisplayValue('2m')
  expect(screen.getByTestId('size-bin-select')).toHaveDisplayValue('5')
  expect(screen.getByTestId('reef-slope-select')).toHaveDisplayValue('flat')
  expect(screen.getByTestId('notes-textarea')).toHaveValue('some fish notes')

  const observationsTable = screen.getByTestId('observations-section')

  const observationRows = within(observationsTable).getAllByRole('row')

  // three rows + one header row = 4
  expect(observationRows.length).toEqual(6)

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

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  const collectButtonGroups = screen.getByTestId('collect-record-form-buttons')
  const saveButton = within(collectButtonGroups).getByTestId('saved-button')

  const validateButton = within(collectButtonGroups).getByTestId('validate-button')

  const submitButton = within(collectButtonGroups).getByTestId('submit-button')

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

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  const collectButtonGroups = screen.getByTestId('collect-record-form-buttons')
  const saveButton = within(collectButtonGroups).getByTestId('saved-button')

  const validateButton = within(collectButtonGroups).queryByTestId('validate-button')
  const submitButton = within(collectButtonGroups).queryByTestId('submit-button')

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

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  const observationsBeforeAdd = screen.getAllByRole('table')[0]

  expect(within(observationsBeforeAdd).getAllByRole('row').length).toEqual(4)

  await user.click(screen.getByTestId('add-observation-row'))

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

  await waitForElementToBeRemoved(() => screen.queryByTestId('loading-indicator'))

  const formBeforeDelete = screen.getByRole('form')
  const observationsTableBeforeDelete = within(formBeforeDelete).getAllByRole('table')[0]

  expect(within(observationsTableBeforeDelete).getAllByRole('row').length).toEqual(4)
  expect(within(observationsTableBeforeDelete).getByDisplayValue(2))

  const observationRows = within(observationsTableBeforeDelete).getAllByRole('row')
  await user.click(within(observationRows[3]).getByTestId('delete-observation-button'))

  const formAfterDelete = screen.getByRole('form')
  const observationsTableAfterDelete = within(formAfterDelete).getAllByRole('table')[0]

  expect(within(observationsTableAfterDelete).getAllByRole('row').length).toEqual(3)
  expect(within(observationsTableAfterDelete).queryByDisplayValue(4)).not.toBeInTheDocument()
})
