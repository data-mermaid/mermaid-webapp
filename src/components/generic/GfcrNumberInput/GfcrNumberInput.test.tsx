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
  min?: number
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

  it('clamps to min on blur', async () => {
    const onChangeSpy = vi.fn()
    const { user } = renderUnauthenticatedOffline(
      <ControlledInput onChangeSpy={onChangeSpy} min={0} allowNegatives />,
    )
    const input = screen.getByRole('textbox')
    await user.type(input, '-5')
    fireEvent.blur(input)
    expect(onChangeSpy).toHaveBeenLastCalledWith(0)
  })

  it('clamps to max on blur', async () => {
    const onChangeSpy = vi.fn()
    const { user } = renderUnauthenticatedOffline(
      <ControlledInput onChangeSpy={onChangeSpy} max={10} />,
    )
    const input = screen.getByRole('textbox')
    await user.type(input, '50')
    fireEvent.blur(input)
    expect(onChangeSpy).toHaveBeenLastCalledWith(10)
  })

  it('does not render stepper controls', () => {
    renderUnauthenticatedOffline(<ControlledInput />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
