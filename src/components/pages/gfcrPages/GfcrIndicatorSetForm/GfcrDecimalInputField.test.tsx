import React from 'react'
import { useFormik } from 'formik'
import {
  screen,
  renderUnauthenticatedOffline,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import GfcrDecimalInputField from './GfcrDecimalInputField'
import {
  GFCR_MAX_AREA_SQ_KM,
  GFCR_MAX_PERCENTAGE,
} from '../../../../library/numbers/gfcrFieldMaximums'

const captured: { values?: Record<string, unknown> } = {}

interface HarnessProps {
  initial: string | number | null
  maxValue?: number
  maxNumberOfDecimals?: number
}

// Mirrors how the F forms wire the field: a formik instance keyed by the field id.
function Harness({ initial, maxValue, maxNumberOfDecimals = 1 }: HarnessProps) {
  const formik = useFormik<Record<string, string | number | null>>({
    initialValues: { f4_1: initial },
    onSubmit: () => {},
  })

  captured.values = formik.values

  return (
    <GfcrDecimalInputField
      id="f4_1"
      label="F 4.1"
      unit="%"
      maxNumberOfDecimals={maxNumberOfDecimals}
      maxValue={maxValue}
      helperText="help"
      displayHelp
      formik={formik}
    />
  )
}

describe('GfcrDecimalInputField', () => {
  it('settles an emptied field on 0, because the API rejects null', async () => {
    const { user } = renderUnauthenticatedOffline(<Harness initial={1.5} />)

    await user.clear(screen.getByRole('textbox'))
    await user.tab()

    expect(captured.values?.f4_1).toBe(0)
  })

  it('settles a legacy empty string on 0', async () => {
    const { user } = renderUnauthenticatedOffline(<Harness initial="" />)

    await user.click(screen.getByRole('textbox'))
    await user.tab()

    expect(captured.values?.f4_1).toBe(0)
  })

  it('rounds to the allowed decimal places on blur', async () => {
    const { user } = renderUnauthenticatedOffline(<Harness initial={null} />)

    await user.type(screen.getByRole('textbox'), '1.28')
    await user.tab()

    expect(captured.values?.f4_1).toBe(1.3)
  })

  it('parses a value the API returned as a string', () => {
    renderUnauthenticatedOffline(<Harness initial="12.5" />)

    expect(screen.getByRole('textbox')).toHaveValue('12.5')
  })

  it('leaves an untouched value alone across focus and blur', async () => {
    const { user } = renderUnauthenticatedOffline(<Harness initial="12.5" />)

    await user.click(screen.getByRole('textbox'))
    await user.tab()

    expect(captured.values?.f4_1).toBe('12.5')
  })

  it('clamps to maxValue on blur', async () => {
    const { user } = renderUnauthenticatedOffline(
      <Harness initial={null} maxValue={GFCR_MAX_PERCENTAGE} />,
    )

    await user.type(screen.getByRole('textbox'), '150')
    await user.tab()

    expect(captured.values?.f4_1).toBe(100)
  })

  it('clamps to a ceiling the field can actually represent', async () => {
    // The km² ceiling carries 5 decimals but F 1.1 allows 2. Clamping to 999999.99999 and
    // then rounding produced 1000000, which the API rejects for having 7 leading digits.
    const { user } = renderUnauthenticatedOffline(
      <Harness initial={null} maxValue={GFCR_MAX_AREA_SQ_KM} maxNumberOfDecimals={2} />,
    )

    await user.type(screen.getByRole('textbox'), '9999999')
    await user.tab()

    expect(captured.values?.f4_1).toBe(999999.99)
  })

  it('keeps the full ceiling when the field has the decimals for it', async () => {
    const { user } = renderUnauthenticatedOffline(
      <Harness initial={null} maxValue={GFCR_MAX_AREA_SQ_KM} maxNumberOfDecimals={5} />,
    )

    await user.type(screen.getByRole('textbox'), '9999999')
    await user.tab()

    expect(captured.values?.f4_1).toBe(999999.99999)
  })

  it('leaves a value within maxValue alone', async () => {
    const { user } = renderUnauthenticatedOffline(
      <Harness initial={null} maxValue={GFCR_MAX_PERCENTAGE} />,
    )

    await user.type(screen.getByRole('textbox'), '99.5')
    await user.tab()

    expect(captured.values?.f4_1).toBe(99.5)
  })

  it('associates the label and helper text with the input', () => {
    renderUnauthenticatedOffline(<Harness initial={1} />)

    const input = screen.getByRole('textbox')

    expect(input).toHaveAttribute('aria-labelledby', 'aria-labelf4_1')
    expect(input).toHaveAttribute('aria-describedby', 'aria-descpf4_1')
    expect(document.getElementById('aria-descpf4_1')).toHaveTextContent('help')
  })
})
