import { NumberInput } from '@mantine/core'
import React, { useEffect, useRef, useState } from 'react'
import { styled, css } from 'styled-components'
import { inputTextareaSelectStyles } from '../form'
import { getBrowserLocale } from '../../../library/numbers/getBrowserLocale'
import theme from '../../../theme'

export interface GfcrNumberInputProps {
  id: string
  name?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  value: number | null
  onChange: (value: number | null) => void
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  onFocus?: React.FocusEventHandler<HTMLInputElement>
  decimalPlaces?: number
  min?: number
  max?: number
  allowNegatives?: boolean
  disabled?: boolean
  unit?: string
  alignUnitsLeft?: boolean
}

const innerInputStyles = css`
  text-align: right;
  height: auto;
  min-height: 0;
  border-radius: 0;
  font-size: inherit;
  font-family: inherit;
  color: inherit;
  box-sizing: border-box;
`

const InputWrapper = styled.div`
  input {
    ${inputTextareaSelectStyles}
    ${innerInputStyles}
  }
`

const UnitInputWrapper = styled.div`
  ${inputTextareaSelectStyles}
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  padding: 0;

  /* Mantine renders div > div > input with unstyled; propagate flex so they fill the container */
  & > div,
  & > div > div {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: stretch;
  }

  input {
    ${innerInputStyles}
    flex: 1;
    min-width: 0;
    border: none;
    padding: ${theme.spacing.xsmall};
    background: transparent;
    &:focus {
      outline: ${theme.color.outline};
      outline-offset: -3px;
    }
    &:disabled {
      background: transparent;
      cursor: not-allowed;
      color: ${theme.color.disabledTextDark};
    }
  }
`

const UnitLabel = styled.span`
  white-space: nowrap;
  background: ${theme.color.unitBackground};
  padding: 0 0.5em;
  font-size: ${theme.typography.defaultFontSize};
  display: flex;
  align-items: center;
`

function getLocaleFormatParts(locale: string): {
  decimalSeparator: string
  thousandSeparator: string
} {
  const parts = new Intl.NumberFormat(locale).formatToParts(1111.1)
  const decimal = parts.find((p) => p.type === 'decimal')?.value ?? '.'
  const group = parts.find((p) => p.type === 'group')?.value ?? ','
  return { decimalSeparator: decimal, thousandSeparator: group }
}

function roundToDecimalPlaces(value: number, places: number): number {
  return Number(value.toFixed(places))
}

// The largest value at `places` decimal places that is still within `value`.
// Rounding a ceiling can push it over: 999999.99999 to 2dp becomes 1000000.
function floorToDecimalPlaces(value: number, places: number): number {
  const rounded = Number(value.toFixed(places))

  if (rounded <= value) {
    return rounded
  }

  return Number((rounded - 10 ** -places).toFixed(places))
}

const GfcrNumberInput = ({
  id,
  name,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
  value,
  onChange,
  onBlur,
  onFocus,
  decimalPlaces,
  min,
  max,
  allowNegatives = false,
  disabled = false,
  unit,
  alignUnitsLeft = false,
}: GfcrNumberInputProps) => {
  const locale = getBrowserLocale()
  const { decimalSeparator, thousandSeparator } = getLocaleFormatParts(locale)

  // Mantine clamps to max on blur and we then round, so a max that is not representable at
  // this field's precision gets rounded back over the limit. Lower it so both steps agree.
  const boundedMax =
    max !== undefined && decimalPlaces !== undefined
      ? floorToDecimalPlaces(max, decimalPlaces)
      : max

  // Tracks intermediate typing states (e.g. "1.") that are not yet a valid number.
  // Prevents the controlled value prop from overwriting in-progress input.
  const [displayValue, setDisplayValue] = useState<number | string>(value ?? '')

  // Sync display when parent resets the value (e.g. form reset) but not on our own onChange calls.
  const lastExternalValue = useRef(value)
  useEffect(() => {
    if (value !== lastExternalValue.current) {
      lastExternalValue.current = value
      committedValue.current = value
      setDisplayValue(value ?? '')
    }
  }, [value])

  // Ref to hold the latest committed numeric value so handleBlur can read it synchronously
  // after Mantine's own blur/clamp logic has already called onChange.
  const committedValue = useRef<number | null>(value)

  const handleChange = (val: number | string) => {
    setDisplayValue(val)
    if (val === '') {
      committedValue.current = null
      lastExternalValue.current = null
      onChange(null)
    } else if (typeof val === 'number') {
      committedValue.current = val
      lastExternalValue.current = val
      onChange(val)
    }
    // Intermediate strings like "1." are reflected in displayValue but not propagated up.
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const committed = committedValue.current

    // A string can reach this ref if a caller passes an unparsed API value, and toFixed
    // would throw on it. Narrowing here keeps the rounding path safe by construction.
    if (
      decimalPlaces !== undefined &&
      typeof committed === 'number' &&
      Number.isFinite(committed)
    ) {
      const rounded = roundToDecimalPlaces(committed, decimalPlaces)
      if (rounded !== committed) {
        committedValue.current = rounded
        lastExternalValue.current = rounded
        setDisplayValue(rounded)
        onChange(rounded)
      }
    }
    onBlur?.(event)
  }

  const numberInput = (
    <NumberInput
      id={id}
      name={name}
      aria-labelledby={ariaLabelledby}
      // Mantine's Input spreads its own aria attributes after ...others, so an
      // aria-describedby passed as a normal prop is overwritten with undefined.
      // The attributes prop targets the inner input directly and survives.
      attributes={{ input: { 'aria-describedby': ariaDescribedby } }}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={onFocus}
      decimalSeparator={decimalSeparator}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore — thousandSeparator is a react-number-format prop forwarded via ...others
      thousandSeparator={thousandSeparator}
      hideControls
      clampBehavior="blur"
      allowNegative={allowNegatives}
      disabled={disabled}
      min={min}
      max={boundedMax}
      unstyled
    />
  )

  if (unit) {
    return (
      <UnitInputWrapper>
        {alignUnitsLeft && <UnitLabel>{unit}</UnitLabel>}
        {numberInput}
        {!alignUnitsLeft && <UnitLabel>{unit}</UnitLabel>}
      </UnitInputWrapper>
    )
  }

  return <InputWrapper>{numberInput}</InputWrapper>
}

export default GfcrNumberInput
