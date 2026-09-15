import React from 'react'
import { describe, expect, test, vi } from 'vitest'

import {
  renderUnauthenticatedOffline,
  screen,
  within,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import FormStatusIndicators from './FormStatusIndicators'
import theme from '../../../../theme'

const renderIndicators = (props: Partial<React.ComponentProps<typeof FormStatusIndicators>>) => {
  const onNext = vi.fn()

  const { user } = renderUnauthenticatedOffline(
    <FormStatusIndicators
      areValidationsShowing={true}
      errorCount={0}
      warningCount={0}
      ignoredCount={0}
      nextAnnouncement=""
      onNext={onNext}
      {...props}
    />,
  )

  return { onNext, user }
}

describe('FormStatusIndicators', () => {
  test('hides the bar until validations are showing', () => {
    renderIndicators({ areValidationsShowing: false, errorCount: 2 })

    expect(screen.queryByTestId('form-status-indicators')).not.toBeInTheDocument()
  })

  test('hides the bar when every total is zero', () => {
    renderIndicators({})

    expect(screen.queryByTestId('form-status-indicators')).not.toBeInTheDocument()
  })

  test('shows only the chips with a total, in error, warning, ignored order', () => {
    renderIndicators({ errorCount: 2, ignoredCount: 1 })

    expect(screen.queryByTestId('form-status-chip-warning')).not.toBeInTheDocument()
    expect(
      within(screen.getByTestId('form-status-indicators'))
        .getAllByTestId(/form-status-chip-/)
        .map((chip) => chip.dataset.testid),
    ).toEqual(['form-status-chip-error', 'form-status-chip-ignored'])
  })

  test('gives each Next button its own accessible name', () => {
    renderIndicators({ errorCount: 2, warningCount: 1, ignoredCount: 1 })

    const names = screen.getAllByRole('button').map((button) => button.getAttribute('aria-label'))

    expect(new Set(names).size).toBe(3)
  })

  test('reports which chip was advanced', async () => {
    const { onNext, user } = renderIndicators({ errorCount: 2, warningCount: 1 })

    await user.click(within(screen.getByTestId('form-status-chip-warning')).getByRole('button'))

    expect(onNext).toHaveBeenCalledTimes(1)
    expect(onNext).toHaveBeenCalledWith('warning')
  })

  test('fills each chip with its design colour', () => {
    renderIndicators({ errorCount: 1, warningCount: 1, ignoredCount: 1 })

    expect(screen.getByTestId('form-status-chip-error')).toHaveStyle({
      backgroundColor: theme.color.chipErrorBackground,
    })
    expect(screen.getByTestId('form-status-chip-warning')).toHaveStyle({
      backgroundColor: theme.color.chipWarningBackground,
    })
    expect(screen.getByTestId('form-status-chip-ignored')).toHaveStyle({
      backgroundColor: theme.color.chipIgnoreBackground,
    })
  })
})
