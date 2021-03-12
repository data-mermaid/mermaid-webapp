import React from 'react'
import InputForm from '../generic/InputForm'
import InputSelect from '../generic/InputSelect'
import { H2 } from '../generic/text'

/**
 * Describe your component
 */
const FishBeltTransectForms = () => {
  return (
    <>
      <H2>Transect</H2>
      <InputForm
        type="number"
        name="transect-number"
        label="Transect Number"
        value={0}
        validation="ok"
        onChange={() => {}}
      />
      <InputForm type="text" name="label" label="Label" validation="ok" />
      <InputForm
        type="number"
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

export default FishBeltTransectForms
