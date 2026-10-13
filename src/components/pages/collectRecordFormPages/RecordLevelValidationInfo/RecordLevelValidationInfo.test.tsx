import React from 'react'
import { describe, expect, test, vi } from 'vitest'

import {
  renderUnauthenticatedOffline,
  screen,
  within,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import RecordLevelValidationInfo from './RecordLevelValidationInfo'

const SCROLL_TO_OBSERVATIONS = 'sample_units.scroll_to_observations'

const getRecordLevelWarning = (fields: string[]) => ({
  status: 'warning' as const,
  validation_id: 'fake-validation-id',
  code: 'all_attributes_same_category',
  fields,
  context: { category: 'Hard coral' },
})

const renderRecordLevelValidationInfo = (
  fields: string[],
  handleScrollToObservation = vi.fn(),
) => ({
  ...renderUnauthenticatedOffline(
    <RecordLevelValidationInfo
      areValidationsShowing={true}
      ignoreRecordLevelValidation={vi.fn()}
      resetRecordLevelValidation={vi.fn()}
      validations={[getRecordLevelWarning(fields)]}
      handleScrollToObservation={handleScrollToObservation}
    />,
  ),
  handleScrollToObservation,
})

describe('RecordLevelValidationInfo scroll to observations link', () => {
  // One observation field per protocol. A record-level validation carrying any of these
  // points at an observation table, so every one of them must offer the link.
  test.each([
    ['data.obs_belt_fishes'],
    ['data.obs_belt_inverts'],
    ['data.obs_benthic_lits'],
    ['data.obs_benthic_photo_quadrats'],
    ['data.obs_benthic_pits'],
    ['data.obs_colonies_bleached'],
    ['data.obs_habitat_complexities'],
    ['data.obs_quadrat_benthic_percent'],
  ])('is shown for a warning on %s', (field) => {
    renderRecordLevelValidationInfo([field])

    expect(screen.getByRole('button', { name: SCROLL_TO_OBSERVATIONS })).toBeInTheDocument()
  })

  test('scrolls to the observations when clicked', async () => {
    const { user, handleScrollToObservation } = renderRecordLevelValidationInfo([
      'data.obs_benthic_lits',
    ])

    await user.click(screen.getByRole('button', { name: SCROLL_TO_OBSERVATIONS }))

    expect(handleScrollToObservation).toHaveBeenCalledTimes(1)
  })

  test('is hidden for a warning on a non-observation field', () => {
    renderRecordLevelValidationInfo(['data.sample_event.site'])

    expect(screen.queryByRole('button', { name: SCROLL_TO_OBSERVATIONS })).not.toBeInTheDocument()
  })

  // `data.observers` shares the `data.obs` stem but is a form field, not a table.
  test('is hidden for a warning on the observers field', () => {
    renderRecordLevelValidationInfo(['data.observers'])

    expect(screen.queryByRole('button', { name: SCROLL_TO_OBSERVATIONS })).not.toBeInTheDocument()
  })

  test('is hidden for a warning with no fields', () => {
    renderRecordLevelValidationInfo([])

    expect(screen.queryByRole('button', { name: SCROLL_TO_OBSERVATIONS })).not.toBeInTheDocument()
  })
})

// The form status indicator chips count whatever this panel renders, so these two cases are
// the panel's half of that contract. getValidationSummary.test.ts holds the counting half.
describe('RecordLevelValidationInfo dry submit summary', () => {
  const drySubmitSummary = {
    status: 'error' as const,
    validation_id: 'summary',
    code: 'unsuccessful_dry_submit',
    // Rendered as "<key> : <value>" pairs, so the values have to be strings.
    context: { dry_submit_results: { 'One or more invalid fields': 'depth' } },
  }

  const renderWithSummary = (alongside: { status: 'error' | 'warning'; code: string }) =>
    renderUnauthenticatedOffline(
      <RecordLevelValidationInfo
        areValidationsShowing={true}
        ignoreRecordLevelValidation={vi.fn()}
        resetRecordLevelValidation={vi.fn()}
        validations={[drySubmitSummary, { ...alongside, validation_id: 'other' }]}
        handleScrollToObservation={vi.fn()}
      />,
    )

  test('is hidden while another record level error is unresolved', () => {
    renderWithSummary({ status: 'error', code: 'duplicate_transect' })

    expect(
      within(screen.getByTestId('record-level-validations')).getAllByRole('listitem'),
    ).toHaveLength(1)
  })

  test('is shown once it is the only record level error', () => {
    renderWithSummary({ status: 'warning', code: 'all_equal' })

    expect(
      within(screen.getByTestId('record-level-validations')).getAllByRole('listitem'),
    ).toHaveLength(2)
  })
})
