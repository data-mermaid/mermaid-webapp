import { NumberInput, type NumberInputProps } from '@mantine/core'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { styled, css } from 'styled-components'
import { HelperText, inputTextareaSelectStyles } from '../form'
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

// UnitInputWrapper is width: 100%, which only fills the row if its parent does too.
const FieldWrapper = styled.div<{ $hasUnit: boolean }>`
  ${({ $hasUnit }) => $hasUnit && 'width: 100%;'}
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
  max,
  allowNegatives = false,
  disabled = false,
  unit,
  alignUnitsLeft = false,
}: GfcrNumberInputProps) => {
  const { t } = useTranslation()
  const locale = getBrowserLocale()
  const { decimalSeparator, thousandSeparator } = getLocaleFormatParts(locale)

  // Blur rounds to decimalPlaces, so a max that is not representable at this field's precision
  // would let an accepted value round over the limit. Lower it so typing and rounding agree.
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
  // after Mantine's own blur logic has already called onChange.
  const committedValue = useRef<number | null>(value)

  // Why the last keystroke or paste was refused, shown under the input until the next accepted
  // change or blur.
  const [refusalMessage, setRefusalMessage] = useState<string | null>(null)

  const isAllowed: NumberInputProps['isAllowed'] = ({ value: rawValue, floatValue }) => {
    // rawValue always uses "." as the separator, whatever the locale displays. The separator
    // itself is let through so that "1.5" stops at "1." rather than running together as "15".
    if (decimalPlaces === 0 && /\.\d/.test(rawValue)) {
      setRefusalMessage(t('forms.number_whole_only'))
      return false
    }

    if (boundedMax !== undefined && floatValue !== undefined && floatValue > boundedMax) {
      const formattedMax = new Intl.NumberFormat(locale, {
        maximumFractionDigits: decimalPlaces ?? 20,
      }).format(boundedMax)
      setRefusalMessage(t('forms.number_maximum', { max: formattedMax }))
      return false
    }

    return true
  }

  const handleChange = (val: number | string) => {
    setRefusalMessage(null)
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
    setRefusalMessage(null)

    // Leaving an intermediate string such as "1." on screen would not match the stored number.
    if (typeof displayValue === 'string') {
      setDisplayValue(committed ?? '')
    }

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
      // The attributes prop targets the inner input directly and survives. The same applies to
      // inputMode, which NumberInput hardcodes to "decimal" after spreading its other props.
      // A whole-number field asks for the digits-only mobile keypad instead.
      attributes={{
        input: {
          'aria-describedby': ariaDescribedby,
          inputMode: decimalPlaces === 0 ? 'numeric' : 'decimal',
        },
      }}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={onFocus}
      decimalSeparator={decimalSeparator}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore — thousandSeparator is a react-number-format prop forwarded via ...others
      thousandSeparator={thousandSeparator}
      hideControls
      // Over-maximum entries are refused as they are typed. Clamping on blur would swap in a
      // value the user never entered.
      clampBehavior="none"
      isAllowed={isAllowed}
      // Arrow-key stepping bypasses isAllowed and, with no max passed, has no ceiling at all.
      // The step controls are already hidden, so switch the keys off too.
      withKeyboardEvents={false}
      allowNegative={allowNegatives}
      disabled={disabled}
      unstyled
    />
  )

  return (
    <FieldWrapper $hasUnit={Boolean(unit)}>
      {unit ? (
        <UnitInputWrapper>
          {alignUnitsLeft && <UnitLabel>{unit}</UnitLabel>}
          {numberInput}
          {!alignUnitsLeft && <UnitLabel>{unit}</UnitLabel>}
        </UnitInputWrapper>
      ) : (
        <InputWrapper>{numberInput}</InputWrapper>
      )}
      {/* Always rendered, so screen readers announce the message when it appears. */}
      <HelperText role="status">{refusalMessage}</HelperText>
    </FieldWrapper>
  )
}

export default GfcrNumberInput
