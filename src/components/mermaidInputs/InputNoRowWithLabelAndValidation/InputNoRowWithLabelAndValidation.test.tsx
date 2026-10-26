import React from 'react'
import {
  screen,
  renderUnauthenticatedOffline,
} from '../../../testUtilities/testingLibraryWithHelpers'
import InputNoRowWithLabelAndValidation from './InputNoRowWithLabelAndValidation'

describe('InputNoRowWithLabelAndValidation', () => {
  it('passes its input props to renderInput', () => {
    const renderInput = vi.fn(({ unit: _unit, ...inputProps }) => <input {...inputProps} />)

    renderUnauthenticatedOffline(
      <InputNoRowWithLabelAndValidation
        id="depth"
        label="Depth"
        testId="depth"
        unit="m"
        isInputDisabled
        renderInput={renderInput}
      />,
    )

    expect(renderInput).toHaveBeenCalledWith({
      id: 'depth',
      'aria-labelledby': 'aria-labeldepth',
      'aria-describedby': 'aria-descpdepth',
      'data-testid': 'depth-input',
      unit: 'm',
      disabled: true,
    })
    expect(screen.getByTestId('depth-input')).toBeDisabled()
    expect(screen.getByLabelText('Depth')).toBe(screen.getByTestId('depth-input'))
  })
})
