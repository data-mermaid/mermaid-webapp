import React from 'react'
import { expect, test, vi } from 'vitest'

import {
  renderUnauthenticatedOffline,
  screen,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import ObservationsHeadingValidations, {
  ObservationsHeadingValidationsContext,
} from './ObservationsHeadingValidations'

const tooFew = {
  status: 'warning' as const,
  validation_id: 'too-few',
  code: 'too_few_observations',
  fields: ['data.obs_belt_fishes'],
  context: { observation_count_range: [5, 200] },
}

const renderWithContext = (overrides = {}) => {
  const value = {
    validations: [tooFew],
    areValidationsShowing: true,
    ignoreRecordLevelValidation: vi.fn(),
    unignoreRecordLevelValidation: vi.fn(),
    ...overrides,
  }

  return {
    ...renderUnauthenticatedOffline(
      <ObservationsHeadingValidationsContext value={value}>
        <ObservationsHeadingValidations />
      </ObservationsHeadingValidationsContext>,
    ),
    value,
  }
}

test('renders nothing without a provider', () => {
  renderUnauthenticatedOffline(<ObservationsHeadingValidations />)

  expect(screen.queryByTestId('observations-heading-validations')).not.toBeInTheDocument()
})

test.each([
  ['validations are hidden', { areValidationsShowing: false }],
  ['the table has no validations', { validations: [] }],
  ['every validation is ok', { validations: [{ ...tooFew, status: 'ok' }] }],
])('renders nothing when %s', (_, overrides) => {
  renderWithContext(overrides)

  expect(screen.queryByTestId('observations-heading-validations')).not.toBeInTheDocument()
})
