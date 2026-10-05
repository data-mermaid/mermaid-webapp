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
        renderInput={renderInput}
      />,
    )

    expect(renderInput).toHaveBeenCalledWith({
      id: 'depth',
      'aria-labelledby': 'aria-labeldepth',
      'aria-describedby': 'aria-descpdepth',
      'data-testid': 'depth-input',
      unit: 'm',
    })
    expect(screen.getByLabelText('Depth')).toBe(screen.getByTestId('depth-input'))
  })
})
