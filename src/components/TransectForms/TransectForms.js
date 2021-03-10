import React from 'react'
import InputForm from '../generic/InputForm'
import { H2 } from '../generic/text'

/**
 * Describe your component
 */
const TransectForms = () => {
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
      <InputForm
        type="select"
        name="width"
        label="Width"
        options={[]}
        value=""
        validation="ok"
        onChange={() => {}}
      />
      <InputForm
        type="select"
        name="fish-size-bin"
        label="Fish Size Bin"
        options={[]}
        value=""
        validation="warning"
        onChange={() => {}}
      />
      <InputForm
        type="select"
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
