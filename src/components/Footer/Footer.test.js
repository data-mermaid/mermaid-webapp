import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import { render } from '../../../testUtilities/reactTestingLibraryRenderOverride'

import Footer from './Footer'

test('Footer component renders with the expected UI elements', () => {
  const utilities = render(<Footer />)

  expect(utilities.getByText('I should fail'))
})
