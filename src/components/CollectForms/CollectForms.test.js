import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import { renderAuthenticatedOnline, screen } from '../../testUtilities/testingLibraryWithHelpers'

import CollectForms from './CollectForms'

test('CollectForms component renders with the expected UI elements', () => {
  renderAuthenticatedOnline(<CollectForms />)

  expect(screen.getByText('I should fail'))
})
