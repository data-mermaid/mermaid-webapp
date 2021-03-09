import React from 'react'
import InputSelect from '../generic/InputSelect'
import InputNumber from '../generic/InputNumber'
import InputText from '../generic/InputText'
import { H2 } from '../generic/text'

/**
 * Describe your component
 */
const TransectForms = () => {
  return (
    <>
      <H2>Transect</H2>
      <InputNumber
        name="transect-number"
        label="Transect Number"
        value={0}
        validation="ok"
        onChange={() => {}}
      />
      <InputText name="label" label="Label" validation="ok" />
      <InputNumber
        name="transect-length-survey"
        label="Transect Length Survey"
        value={0}
        validation="warning"
        onChange={() => {}}
      />
      <InputSelect
        name="width"
        label="Width"
        options={[]}
        value=""
        validation="ok"
        onChange={() => {}}
      />
      <InputSelect
        name="fish-size-bin"
        label="Fish Size Bin"
        options={[]}
        value=""
        validation="warning"
        onChange={() => {}}
      />
      <InputSelect
        name="reef-slope"
        label="Reef Slope"
        options={[]}
        value=""
        validation="error"
        onChange={() => {}}
      />
    </>
  )
}

export default TransectForms
