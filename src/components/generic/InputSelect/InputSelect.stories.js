import React from 'react'

import InputSelect from '.'

export default {
  title: 'InputSelect',
  component: InputSelect,
}
export const basic = () => {
  const sampleSiteOptions = [
    { name: 'Phone' },
    { name: 'Table' },
    { name: 'Desk' },
    { name: 'Computer' },
  ]

  return <InputSelect label="Input Type Select" options={sampleSiteOptions} />
}
export const selectedValueInInputField = () => {
  const sampleSiteOptions = [
    { name: 'Dog' },
    { name: 'Cat' },
    { name: 'Mouse' },
    { name: 'Lion' },
  ]
  const sampleSelectedValue = 'Lion'

  return (
    <InputSelect
      label="Input Type Select"
      options={sampleSiteOptions}
      value={sampleSelectedValue}
    />
  )
}
