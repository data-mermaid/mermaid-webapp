import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import { renderAuthenticated, screen } from '../../../testUtilities/testingLibraryWithHelpers'

import CollectRecord from './CollectRecord'

test('CollectRecord component renders with the expected UI elements', () => {
  renderAuthenticated(<CollectRecord />)

  expect(screen.getByText('I should fail'))
})
