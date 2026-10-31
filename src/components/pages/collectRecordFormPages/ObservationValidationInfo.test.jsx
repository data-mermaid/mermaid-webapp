import React from 'react'
import { describe, expect, test, vi } from 'vitest'

import {
  renderUnauthenticatedOffline,
  screen,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'
import ObservationValidationInfo from './ObservationValidationInfo'

const messages = [
  { id: 'e', status: 'error', code: 'required', name: 'size_list_required_validator' },
  { id: 'w', status: 'warning', code: 'max_fish_size' },
  { id: 'i', status: 'ignore', code: 'no_region_match' },
  { id: 'd', status: 'warning', code: 'duplicate_values' },
]

const renderRow = (observationValidationMessages) => {
  const ignoreObservationValidations = vi.fn()
  const unignoreObservationValidations = vi.fn()
  const view = renderUnauthenticatedOffline(
    <table>
      <tbody>
        <tr>
          <ObservationValidationInfo
            observationId="obs-1"
            isObservationValid={false}
            observationValidationMessages={observationValidationMessages}
            ignoreObservationValidations={ignoreObservationValidations}
            unignoreObservationValidations={unignoreObservationValidations}
          />
        </tr>
      </tbody>
    </table>,
  )

  return { ...view, ignoreObservationValidations, unignoreObservationValidations }
}

describe('ObservationValidationInfo ignore controls', () => {
  test('gives each warning its own box, and none to an error or the duplicate observations warning', () => {
    renderRow(messages)

    const [error, warning, ignored, duplicate] = screen.getAllByRole('listitem')

    expect(within(error).queryByTestId('ignore-warning-checkbox')).not.toBeInTheDocument()
    expect(within(warning).getByTestId('ignore-warning-checkbox')).not.toBeChecked()
    expect(within(ignored).getByTestId('ignore-warning-checkbox')).toBeChecked()
    expect(within(duplicate).queryByTestId('ignore-warning-checkbox')).not.toBeInTheDocument()
  })

  test('ignores and un-ignores the one message whose box was ticked', async () => {
    const { user, ignoreObservationValidations, unignoreObservationValidations } =
      renderRow(messages)
    const [, warning, ignored] = screen.getAllByRole('listitem')

    await user.click(within(warning).getByTestId('ignore-warning-checkbox'))
    await user.click(within(ignored).getByTestId('ignore-warning-checkbox'))

    expect(ignoreObservationValidations).toHaveBeenCalledWith({
      observationId: 'obs-1',
      validationId: 'w',
    })
    expect(unignoreObservationValidations).toHaveBeenCalledWith({
      observationId: 'obs-1',
      validationId: 'i',
    })
  })
})

describe('ObservationValidationInfo greyed messages', () => {
  test('fades each greyed message, keeps its pill, and explains once', () => {
    renderRow([{ ...messages[0], isStale: true }, { ...messages[1], isStale: true }, messages[2]])

    const [error, warning, ignored] = screen.getAllByRole('listitem')

    expect(error.querySelector('[data-stale="true"]')).not.toBeNull()
    expect(within(error).getByTestId('message-pill-error')).toBeInTheDocument()
    expect(warning.querySelector('[data-stale="true"]')).not.toBeNull()
    expect(ignored.querySelector('[data-stale="true"]')).toBeNull()
    expect(screen.getAllByText('validations.edited_revalidate')).toHaveLength(1)
  })

  test('says nothing about editing when no message is greyed', () => {
    renderRow(messages)

    expect(screen.queryByText('validations.edited_revalidate')).not.toBeInTheDocument()
  })
})
