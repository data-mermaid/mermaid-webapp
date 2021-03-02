import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import { renderAuthenticatedOnline, screen } from '../../testUtilities/testingLibraryWithHelpers'

import NavItem from './NavItem'

test('NavItem component renders with the expected UI elements', () => {
  renderAuthenticatedOnline(<NavItem />)

  expect(screen.getByText('I should fail'))
})
