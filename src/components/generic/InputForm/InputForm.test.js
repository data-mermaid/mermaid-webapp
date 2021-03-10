import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import { renderAuthenticatedOnline, screen } from '../../testUtilities/testingLibraryWithHelpers'

import InputForm from './InputForm'

test('InputForm component renders with the expected UI elements', () => {
  renderAuthenticatedOnline(<InputForm />)

  expect(screen.getByText('I should fail'))
})
