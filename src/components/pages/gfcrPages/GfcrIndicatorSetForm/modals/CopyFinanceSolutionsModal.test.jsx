import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import {
  renderAuthenticatedOnline,
  screen,
  within,
} from '../../../../../testUtilities/testingLibraryWithHelpers'
import CopyFinanceSolutionsModal from './CopyFinanceSolutionsModal'

// CurrentProjectProvider keeps gfcrIndicatorSets in local state with no way to seed it, so the
// hook is mocked rather than the provider wrapped.
const mockGfcrIndicatorSets = vi.hoisted(() => ({ current: [] }))

vi.mock('../../../../../App/CurrentProjectContext', async (importOriginal) => ({
  ...(await importOriginal()),
  useCurrentProject: () => ({ gfcrIndicatorSets: mockGfcrIndicatorSets.current }),
}))

const BUSINESS = 'business-solution-id'

const choices = {
  financesolutiontypes: { data: [{ id: BUSINESS, name: 'Business solution' }] },
}

const makeFinanceSolution = (id, name) => ({ id, name, fs_type: BUSINESS })

const indicatorSet = {
  id: 'current-set',
  title: 'Current set',
  indicator_set_type: 'report',
  report_date: '2026-12-31',
  finance_solutions: [makeFinanceSolution('existing-1', 'Already here')],
}

const otherIndicatorSet = {
  id: 'other-set',
  title: 'Other set',
  indicator_set_type: 'report',
  report_date: '2026-08-20',
  finance_solutions: [
    makeFinanceSolution('row-already-added', 'Already here'),
    makeFinanceSolution('row-alpha', 'Alpha'),
    // Same solution as row-alpha once name casing and padding are normalised
    makeFinanceSolution('row-alpha-again', ' alpha '),
  ],
}

const renderModal = () => {
  mockGfcrIndicatorSets.current = [indicatorSet, otherIndicatorSet]

  return renderAuthenticatedOnline(
    <CopyFinanceSolutionsModal
      isOpen
      onDismiss={() => {}}
      indicatorSet={indicatorSet}
      setIndicatorSet={() => {}}
      choices={choices}
    />,
    { initialEntries: ['/projects/fake-project-id/gfcr'] },
  )
}

const getRowCheckbox = (name) =>
  within(screen.getByRole('cell', { name }).closest('tr')).getByRole('checkbox')

const copyButton = () =>
  screen.getByRole('button', { name: /gfcr.forms.finance_solutions.copy_selected/ })

describe('CopyFinanceSolutionsModal duplicate blocking', () => {
  it('a row already in the indicator set cannot be ticked', async () => {
    const { user } = renderModal()

    const blocked = getRowCheckbox('Already here')

    expect(blocked).toHaveAttribute('aria-disabled', 'true')

    await user.click(blocked)

    expect(blocked).not.toBeChecked()
    expect(copyButton()).toBeDisabled()
  })

  it('the space key cannot tick a row already in the indicator set', async () => {
    const { user } = renderModal()

    const blocked = getRowCheckbox('Already here')

    blocked.focus()
    await user.keyboard(' ')

    expect(blocked).not.toBeChecked()
    expect(copyButton()).toBeDisabled()
  })

  it('ticking a row blocks its duplicate but leaves the row itself deselectable', async () => {
    const { user } = renderModal()

    const alpha = getRowCheckbox('Alpha')
    const alphaAgain = getRowCheckbox('alpha')

    await user.click(alpha)

    expect(alpha).toBeChecked()
    expect(alpha).toHaveAttribute('aria-disabled', 'false')
    expect(alphaAgain).toHaveAttribute('aria-disabled', 'true')

    await user.click(alphaAgain)

    expect(alphaAgain).not.toBeChecked()

    // The selected row must stay untickable-in-reverse, otherwise the selection is a trap
    await user.click(alpha)

    expect(alpha).not.toBeChecked()
    expect(copyButton()).toBeDisabled()
  })
})
