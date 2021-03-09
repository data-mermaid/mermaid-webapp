import React from 'react'
import PropTypes from 'prop-types'
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
        onChange={() => {}}
      />
      <InputText name="label" label="Label" />
      <InputNumber
        name="transect-length-survey"
        label="Transect Length Survey"
        value={0}
        onChange={() => {}}
      />
      <InputSelect
        name="width"
        label="Width"
        options={[]}
        value=""
        onChange={() => {}}
      />
      <InputSelect
        name="fish-size-bin"
        label="Fish Size Bin"
        options={[]}
        value=""
        onChange={() => {}}
      />
      <InputSelect
        name="reef-slope"
        label="Reef Slope"
        options={[]}
        value=""
        onChange={() => {}}
      />
    </>
  )
}

TransectForms.propTypes = {}

export default TransectForms
