import { expect, test } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'

import {
  renderAuthenticatedOffline,
  screen,
  within,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import App from '../../../App'
import { getMockDexieInstancesAllSuccess } from '../../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'

test('Macroinvertebrate observations: another users proposed attribute is not selectable, but the current users own proposed attribute is', async () => {
  const { dexiePerUserDataInstance, dexieCurrentUserInstance } = getMockDexieInstancesAllSuccess()

  await initiallyHydrateOfflineStorageWithMockData(dexiePerUserDataInstance)

  // Simulate another user's proposed attribute having ended up in offline storage,
  // eg from viewing a submitted record that references it (see ensureAttributesLoaded).
  await dexiePerUserDataInstance.invert_attributes.put({
    id: 'other-users-proposed-invert-attribute',
    name: 'Other Users Proposed Invert Attribute',
    status: 10,
    created_by: 'some-other-user-profile-id',
    parent: '8b70dc27-598e-47ef-b413-53f8d02e5750',
    uiState_pushToApi: false,
  })

  const { user } = renderAuthenticatedOffline(
    <App dexieCurrentUserInstance={dexieCurrentUserInstance} />,
    {
      initialEntries: ['/projects/5/collecting/macroinvertebrate/'],
      dexiePerUserDataInstance,
      dexieCurrentUserInstance,
    },
  )

  await screen.findByTestId('macroinvertebrate-page-title')

  await user.click(await screen.findByTestId('add-observation-row'))

  const observationsTable = await screen.findByTestId('invert-observations-table')
  const speciesNameInput = within(observationsTable).getAllByTestId('species-name-autocomplete')[0]

  // the other user's proposed attribute is not offered as an option
  await user.type(speciesNameInput, 'Other Users Proposed Invert Attribute')

  expect(await screen.findByTestId('propose-new-species-button')).toBeInTheDocument()
  expect(
    screen.queryByRole('option', { name: 'Other Users Proposed Invert Attribute' }),
  ).not.toBeInTheDocument()

  // the current user's own proposed attribute is offered as an option
  await user.clear(speciesNameInput)
  await user.type(speciesNameInput, 'Test Proposed Invert Attribute')

  const ownProposedAttributeOption = await screen.findByRole('option', {
    name: 'Test Proposed Invert Attribute',
  })

  await user.click(ownProposedAttributeOption)

  expect(speciesNameInput).toHaveValue('Test Proposed Invert Attribute')
})
