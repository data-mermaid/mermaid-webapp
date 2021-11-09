import { action } from '@storybook/addon-actions'
import React from 'react'
import styled from 'styled-components'

import InputAutocomplete from './InputAutocomplete'

export default {
  title: 'InputAutocomplete',
  component: InputAutocomplete,
}
const options = [
  { label: 'label1', value: 'value1' },
  { label: 'label2', value: 'value2' },
  { label: 'label3', value: 'value3' },
  { label: 'label4', value: 'value4' },
  { label: 'label5', value: 'value5' },
  { label: 'label6', value: 'value6' },
  { label: 'label7', value: 'value7' },
  { label: 'label8', value: 'value8' },
  { label: 'label9', value: 'value9' },
  { label: 'label10', value: 'value10' },
]

export const noInitialValue = () => (
  <InputAutocomplete
    id="autoComplete"
    options={options}
    onChange={action('on change')}
    helperText="I'm here to help. I'm helper text"
  />
)

export const initialValue = () => (
  <InputAutocomplete options={options} onChange={action('on change')} value={options[7].value} />
)

const CustomNoResultsContainer = styled.div`
  border: dotted thick darkmagenta;
`

export const customNoResults = () => (
  <InputAutocomplete
    options={options}
    onChange={action('on change')}
    noResultsDisplay={
      <CustomNoResultsContainer>
        custom no results view
        <button type="button" onClick={action('click')}>
          click me
        </button>
      </CustomNoResultsContainer>
    }
  />
)
