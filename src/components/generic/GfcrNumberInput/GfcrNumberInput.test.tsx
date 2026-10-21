import { MantineProvider } from '@mantine/core'
import React, { useState } from 'react'
import {
  screen,
  fireEvent,
  renderUnauthenticatedOffline,
} from '../../../testUtilities/testingLibraryWithHelpers'
import GfcrNumberInput from './GfcrNumberInput'

interface ControlledInputProps {
  initialValue?: number | null
  onChangeSpy?: (v: number | null) => void
  decimalPlaces?: number
  max?: number
  allowNegatives?: boolean
  disabled?: boolean
}

// Stateful wrapper so the controlled component responds to onChange like it would in a form.
function ControlledInput({ initialValue = null, onChangeSpy, ...rest }: ControlledInputProps) {
  const [value, setValue] = useState<number | null>(initialValue ?? null)
  const handleChange = (v: number | null) => {
    setValue(v)
    onChangeSpy?.(v)
  }
  return (
    <MantineProvider>
      <GfcrNumberInput id="test" value={value} onChange={handleChange} {...rest} />
    </MantineProvider>
  )
}

describe('GfcrNumberInput', () => {
  it('calls onChange with null when input is cleared', async () => {
    const onChangeSpy = vi.fn()
    const { user } = renderUnauthenticatedOffline(
      <ControlledInput initialValue={1.5} onChangeSpy={onChangeSpy} />,
    )
    const input = screen.getByRole('textbox')
    await user.clear(input)
    expect(onChangeSpy).toHaveBeenLastCalledWith(null)
  })

  it('calls onChange with a number for en-US decimal input', async () => {
    const onChangeSpy = vi.fn()
    const { user } = renderUnauthenticatedOffline(<ControlledInput onChangeSpy={onChangeSpy} />)
    const input = screen.getByRole('textbox')
    await user.type(input, '1.5')
    expect(onChangeSpy).toHaveBeenLastCalledWith(1.5)
  })

  it('accepts comma as decimal separator for comma-decimal locales', async () => {
    const originalLanguage = navigator.language
    Object.defineProperty(navigator, 'language', { value: 'de-DE', configurable: true })
    try {
      const onChangeSpy = vi.fn()
      const { user } = renderUnauthenticatedOffline(<ControlledInput onChangeSpy={onChangeSpy} />)
      const input = screen.getByRole('textbox')
      await user.type(input, '1,5')
      expect(onChangeSpy).toHaveBeenLastCalledWith(1.5)
    } finally {
      Object.defineProperty(navigator, 'language', { value: originalLanguage, configurable: true })
    }
  })

  it('rounds to decimalPlaces on blur', async () => {
    const onChangeSpy = vi.fn()
    const { user } = renderUnauthenticatedOffline(
      <ControlledInput onChangeSpy={onChangeSpy} decimalPlaces={2} />,
    )
    const input = screen.getByRole('textbox')
    await user.type(input, '1.239')
    fireEvent.blur(input)
    expect(onChangeSpy).toHaveBeenLastCalledWith(1.24)
  })

  it('does not round when value already fits within decimalPlaces', async () => {
    const onChangeSpy = vi.fn()
    const { user } = renderUnauthenticatedOffline(
      <ControlledInput onChangeSpy={onChangeSpy} decimalPlaces={2} />,
    )
    const input = screen.getByRole('textbox')
    await user.type(input, '1.5')
    const callsBefore = onChangeSpy.mock.calls.length
    fireEvent.blur(input)
    expect(onChangeSpy.mock.calls.length).toBe(callsBefore)
  })

  it('rejects negative values when allowNegatives is false', async () => {
    const onChangeSpy = vi.fn()
    const { user } = renderUnauthenticatedOffline(
      <ControlledInput onChangeSpy={onChangeSpy} allowNegatives={false} />,
    )
    const input = screen.getByRole('textbox')
    await user.type(input, '-5')
    // Mantine strips the minus sign; any number passed to onChange must be non-negative
    onChangeSpy.mock.calls.forEach(([value]) => {
      if (typeof value === 'number') {
        expect(value).toBeGreaterThanOrEqual(0)
      }
    })
  })

  it('refuses a keystroke that would go over max and says why', async () => {
    const onChangeSpy = vi.fn()
    const { user } = renderUnauthenticatedOffline(
      <ControlledInput onChangeSpy={onChangeSpy} max={100} />,
    )
    const input = screen.getByRole('textbox')
    await user.type(input, '101')
    expect(input).toHaveValue('10')
    expect(onChangeSpy).toHaveBeenLastCalledWith(10)
    expect(screen.getByRole('status')).toHaveTextContent('forms.number_maximum')
  })

  it('refuses a paste that would go over max', async () => {
    const onChangeSpy = vi.fn()
    const { user } = renderUnauthenticatedOffline(
      <ControlledInput onChangeSpy={onChangeSpy} max={100} />,
    )
    const input = screen.getByRole('textbox')
    await user.click(input)
    await user.paste('150')
    expect(input).toHaveValue('')
    expect(onChangeSpy).not.toHaveBeenCalled()
    expect(screen.getByRole('status')).toHaveTextContent('forms.number_maximum')
  })

  it('does not step over max with the arrow keys', async () => {
    const onChangeSpy = vi.fn()
    const { user } = renderUnauthenticatedOffline(
      <ControlledInput onChangeSpy={onChangeSpy} max={100} />,
    )
    const input = screen.getByRole('textbox')
    await user.type(input, '100')
    await user.keyboard('{ArrowUp}')
    expect(input).toHaveValue('100')
    expect(onChangeSpy).toHaveBeenLastCalledWith(100)
  })

  it('clears the refusal message on the next accepted keystroke', async () => {
    const { user } = renderUnauthenticatedOffline(<ControlledInput max={100} />)
    const input = screen.getByRole('textbox')
    await user.type(input, '101')
    await user.type(input, '{Backspace}5')
    expect(input).toHaveValue('15')
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('clears the refusal message on blur', async () => {
    const { user } = renderUnauthenticatedOffline(<ControlledInput max={100} />)
    const input = screen.getByRole('textbox')
    await user.type(input, '101')
    fireEvent.blur(input)
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('refuses digits after a decimal separator on a whole-number field', async () => {
    const onChangeSpy = vi.fn()
    const { user } = renderUnauthenticatedOffline(
      <ControlledInput onChangeSpy={onChangeSpy} decimalPlaces={0} />,
    )
    const input = screen.getByRole('textbox')
    await user.type(input, '1.5')
    expect(screen.getByRole('status')).toHaveTextContent('forms.number_whole_only')
    fireEvent.blur(input)
    expect(input).toHaveValue('1')
    expect(onChangeSpy).toHaveBeenLastCalledWith(1)
  })

  it('does not emit a change when an untouched value is focused and blurred', () => {
    // Regression guard: a value arriving as a string made Mantine coerce it on blur, which
    // marked the form dirty and rewrote the stored amount without the user typing anything.
    const onChangeSpy = vi.fn()
    renderUnauthenticatedOffline(
      <ControlledInput initialValue={1234.56} onChangeSpy={onChangeSpy} decimalPlaces={2} />,
    )
    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    fireEvent.blur(input)
    expect(onChangeSpy).not.toHaveBeenCalled()
  })

  it('does not render stepper controls', () => {
    renderUnauthenticatedOffline(<ControlledInput />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('asks for the digits-only mobile keypad on a whole-number field', () => {
    renderUnauthenticatedOffline(<ControlledInput decimalPlaces={0} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('inputmode', 'numeric')
  })

  it('asks for the decimal mobile keypad on a fractional field', () => {
    renderUnauthenticatedOffline(<ControlledInput decimalPlaces={2} />)
    expect(screen.getByRole('textbox')).toHaveAttribute('inputmode', 'decimal')
  })
})
