import React from 'react'

import InputSelectWithLabelAndValidation from '.'

export default {
  title: 'InputSelectWithLabelAndValidation',
  component: InputSelectWithLabelAndValidation,
}

const options = [
  { label: 'Label 1', value: 1 },
  { label: 'Label 2', value: 'two' },
]

export const basic = () => (
  <InputSelectWithLabelAndValidation options={options} />
)
