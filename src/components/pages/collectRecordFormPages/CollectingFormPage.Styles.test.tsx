import React from 'react'
import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { StickyObservationTable, StickyObservationTableWrapTh } from './CollectingFormPage.Styles'

const renderTable = (Component: typeof StickyObservationTable, label: string) =>
  render(
    <Component aria-label={label}>
      <tbody>
        <tr>
          <td>Acropora</td>
        </tr>
      </tbody>
    </Component>,
  )

// styled() wraps this table twice before it reaches the DOM, so the attribute is only useful if it
// survives that. A page translator ignores an opt-out it never sees.
test('observation tables opt out of browser translation', () => {
  renderTable(StickyObservationTable, 'observations')

  expect(screen.getByRole('table', { name: 'observations' })).toHaveAttribute('translate', 'no')
})

// ColoniesBleachedObservationsTable renders this third-level wrapper, so it is the deepest chain the
// attribute has to survive.
test('the wrapped-header variant inherits the opt-out', () => {
  renderTable(StickyObservationTableWrapTh, 'colonies bleached')

  expect(screen.getByRole('table', { name: 'colonies bleached' })).toHaveAttribute(
    'translate',
    'no',
  )
})
