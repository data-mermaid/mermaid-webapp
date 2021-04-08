import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import {
  renderAuthenticatedOnline,
  screen,
} from '../../testUtilities/testingLibraryWithHelpers'

import CollectRecordFormTitle from './CollectRecordFormTitle'

test('CollectRecordFormTitle component renders with the expected UI elements', () => {
  renderAuthenticatedOnline(<CollectRecordFormTitle defaultTitle="Fish Belt" />)

  expect(screen.getByLabelText(/collect form title/i))
})

test('CollectRecordFormTitle component renders with missing label props', () => {
  renderAuthenticatedOnline(<CollectRecordFormTitle defaultTitle="Fish Belt" />)

  expect(screen.getByText('Fish Belt'))
})
