import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import { render } from '@testing-library/react'

import ButtonMenu from './ButtonMenu'

test('ButtonMenu component renders with the expected UI elements', () => {
  const utilities = render(<ButtonMenu />)

  expect(utilities.getByText('I should fail'))
})
