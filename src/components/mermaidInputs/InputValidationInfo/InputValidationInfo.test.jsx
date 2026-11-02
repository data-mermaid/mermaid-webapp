import React from 'react'
import { describe, expect, test, vi } from 'vitest'

import {
  renderUnauthenticatedOffline,
  screen,
  within,
} from '../../../testUtilities/testingLibraryWithHelpers'
import InputValidationInfo from './InputValidationInfo'

const messages = [
  { id: 'e', status: 'error', code: 'required' },
  { id: 'w', status: 'warning', code: 'max_depth' },
  { id: 'i', status: 'ignore', code: 'sample_time_out_of_range' },
]

const renderField = (props) => {
  const ignoreNonObservationFieldValidations = vi.fn()
  const unignoreNonObservationFieldValidations = vi.fn()
  const view = renderUnauthenticatedOffline(
    <InputValidationInfo
      validationPath="data.fishbelt_transect.depth"
      validationType="error"
      validationMessages={messages}
      ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
      unignoreNonObservationFieldValidations={unignoreNonObservationFieldValidations}
      {...props}
    />,
  )

  return { ...view, ignoreNonObservationFieldValidations, unignoreNonObservationFieldValidations }
}

const getMessage = (status) => screen.getByTestId(`inline-message-${status}`).parentElement

describe('InputValidationInfo ignore controls', () => {
  test('gives each warning its own box and none to an error', () => {
    renderField()

    expect(
      within(getMessage('error')).queryByTestId('ignore-warning-checkbox'),
    ).not.toBeInTheDocument()
    expect(within(getMessage('warning')).getByTestId('ignore-warning-checkbox')).not.toBeChecked()
    expect(within(getMessage('ignore')).getByTestId('ignore-warning-checkbox')).toBeChecked()
  })

  test('ignores and un-ignores the one message whose box was ticked, by path and id', async () => {
    const { user, ignoreNonObservationFieldValidations, unignoreNonObservationFieldValidations } =
      renderField()

    await user.click(within(getMessage('warning')).getByTestId('ignore-warning-checkbox'))
    await user.click(within(getMessage('ignore')).getByTestId('ignore-warning-checkbox'))

    expect(ignoreNonObservationFieldValidations).toHaveBeenCalledWith({
      validationPath: 'data.fishbelt_transect.depth',
      validationId: 'w',
    })
    expect(unignoreNonObservationFieldValidations).toHaveBeenCalledWith({
      validationPath: 'data.fishbelt_transect.depth',
      validationId: 'i',
    })
  })
})

describe('InputValidationInfo greyed messages', () => {
  test('fades each greyed message, keeps its pill, and explains once', () => {
    renderField({
      validationMessages: [
        { ...messages[0], isStale: true },
        { ...messages[1], isStale: true },
        messages[2],
      ],
    })

    expect(getMessage('error').dataset.stale).toBe('true')
    expect(screen.getByTestId('message-pill-error')).toBeInTheDocument()
    expect(getMessage('warning').dataset.stale).toBe('true')
    expect(getMessage('ignore').dataset.stale).toBe('false')
    expect(screen.getAllByText('validations.edited_revalidate')).toHaveLength(1)
  })

  test('shows messages from forms that pass no status, using the field type, with no note or box', () => {
    renderField({
      validationType: 'error',
      validationMessages: [{ id: 'm', code: 'similar_name_other_form' }],
    })

    expect(screen.getByTestId('message-pill-error')).toBeInTheDocument()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    expect(screen.queryByText('validations.edited_revalidate')).not.toBeInTheDocument()
  })
})
