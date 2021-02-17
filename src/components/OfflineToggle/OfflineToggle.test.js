import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import {
  renderAuthenticated,
  fireEvent,
} from '../../testUtilities/testingLibraryWithHelpers'

import OfflineToggle from './OfflineToggle'

const setup = () => {
  const utils = renderAuthenticated(<OfflineToggle />)
  const input = utils.getByLabelText('offline-toggle-switch')
  return {
    input,
    ...utils,
  }
}

test('Toggle wifi is false initially, should be true when toggle is switch', () => {
  const { input } = setup()
  expect(input.checked).toBe(false)
  fireEvent.change(input, { target: { checked: true } })
  expect(input.checked).toBe(true)
})
