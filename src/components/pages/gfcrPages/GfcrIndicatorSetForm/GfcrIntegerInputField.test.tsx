import React from 'react'
import { useFormik } from 'formik'
import {
  screen,
  renderUnauthenticatedOffline,
} from '../../../../testUtilities/testingLibraryWithHelpers'
import GfcrIntegerInputField from './GfcrIntegerInputField'
import F3Form from './subPages/F3Form'
import { getFieldValueTotal } from './GfcrIndicatorSetForm'
import { GFCR_MAX_SMALL_INTEGER } from '../../../../library/numbers/gfcrFieldMaximums'

const captured: { values?: Record<string, unknown> } = {}

interface HarnessProps {
  initial: string | number | null
  noRow?: boolean
}

// Mirrors how the F forms wire the field: a formik instance keyed by the field id.
function Harness({ initial, noRow = false }: HarnessProps) {
  const formik = useFormik<Record<string, string | number | null>>({
    initialValues: { f3_5a: initial },
    onSubmit: () => {},
  })

  captured.values = formik.values

  return (
    <GfcrIntegerInputField
      id="f3_5a"
      label="Men"
      maxValue={GFCR_MAX_SMALL_INTEGER}
      helperText="help"
      displayHelp
      formik={formik}
      noRow={noRow}
    />
  )
}

describe('GfcrIntegerInputField', () => {
  it('settles an emptied field on 0, because the API rejects null', async () => {
    const { user } = renderUnauthenticatedOffline(<Harness initial="12" />)

    await user.clear(screen.getByRole('textbox'))
    await user.tab()

    expect(captured.values?.f3_5a).toBe(0)
  })

  it('settles a legacy empty string on 0', async () => {
    const { user } = renderUnauthenticatedOffline(<Harness initial="" />)

    await user.click(screen.getByRole('textbox'))
    await user.tab()

    expect(captured.values?.f3_5a).toBe(0)
  })

  it('rounds a decimal entry to a whole number on blur', async () => {
    const { user } = renderUnauthenticatedOffline(<Harness initial={null} />)

    await user.type(screen.getByRole('textbox'), '4.5')
    await user.tab()

    expect(captured.values?.f3_5a).toBe(5)
  })

  it('clamps to maxValue on blur', async () => {
    const { user } = renderUnauthenticatedOffline(<Harness initial={null} />)

    await user.type(screen.getByRole('textbox'), '99999')
    await user.tab()

    expect(captured.values?.f3_5a).toBe(GFCR_MAX_SMALL_INTEGER)
  })

  it('leaves an untouched value alone across focus and blur', async () => {
    const { user } = renderUnauthenticatedOffline(<Harness initial="12" />)

    await user.click(screen.getByRole('textbox'))
    await user.tab()

    expect(captured.values?.f3_5a).toBe('12')
  })

  it.each([false, true])('associates the label and helper text (noRow: %s)', (noRow) => {
    renderUnauthenticatedOffline(<Harness initial={1} noRow={noRow} />)

    const input = screen.getByRole('textbox', { name: 'Men' })

    expect(input).toHaveAttribute('aria-describedby', 'aria-descpf3_5a')
    expect(document.getElementById('aria-descpf3_5a')).toHaveTextContent('help')
  })

  it('asks for the digits-only mobile keypad', () => {
    renderUnauthenticatedOffline(<Harness initial={1} />)

    expect(screen.getByRole('textbox')).toHaveAttribute('inputmode', 'numeric')
  })
})

function F3Harness({ men, women }: { men: string | number; women: string | number }) {
  const formik = useFormik<Record<string, string | number | null>>({
    initialValues: { f3_5a: men, f3_5b: women },
    onSubmit: () => {},
  })

  return (
    <F3Form
      formik={formik}
      displayHelp={false}
      handleInputFocus={() => {}}
      getFieldValueTotal={getFieldValueTotal}
    />
  )
}

describe('headcount Total', () => {
  it('treats an emptied headcount as 0', async () => {
    const { user } = renderUnauthenticatedOffline(<F3Harness men="7" women="3" />)

    const total = document.getElementById('f3_5total')

    // form.js only right-aligns a text input, so the Total has to declare its type to line up
    // with the GfcrNumberInput fields beside it.
    expect(total).toHaveAttribute('type', 'text')
    expect(total).toHaveValue('10')

    await user.clear(document.getElementById('f3_5b') as HTMLInputElement)

    expect(total).toHaveValue('7')
  })

  it('formats the sum with the same thousands separator as the fields beside it', () => {
    renderUnauthenticatedOffline(<F3Harness men={1000} women={0} />)

    const men = document.getElementById('f3_5a') as HTMLInputElement

    expect(men.value).not.toBe('1000')
    expect(document.getElementById('f3_5total')).toHaveValue(men.value)
  })
})
