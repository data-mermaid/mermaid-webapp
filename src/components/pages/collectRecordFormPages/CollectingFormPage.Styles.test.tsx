import React from 'react'
import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { StickyObservationTable } from './CollectingFormPage.Styles'

// styled() wraps this table twice before it reaches the DOM, so the attribute is only useful if it
// survives that. A page translator ignores an opt-out it never sees.
test('observation tables opt out of browser translation', () => {
  render(
    <StickyObservationTable aria-label="observations">
      <tbody>
        <tr>
          <td>Acropora</td>
        </tr>
      </tbody>
    </StickyObservationTable>,
  )

  expect(screen.getByRole('table', { name: 'observations' })).toHaveAttribute('translate', 'no')
})
