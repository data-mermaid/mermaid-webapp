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
} from '../../../../testUtilities/testingLibraryWithHelpers'

import ManagementRegime from '../ManagementRegime'
import { getMockDexieInstanceAllSuccess } from '../../../../testUtilities/mockDexie'
import { initiallyHydrateOfflineStorageWithMockData } from '../../../../testUtilities/initiallyHydrateOfflineStorageWithMockData'

const fakeCurrentUser = {
  id: 'fake-id',
  first_name: 'FakeFirstName',
}
