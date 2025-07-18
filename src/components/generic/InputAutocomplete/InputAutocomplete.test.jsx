import '@testing-library/jest-dom'

import React from 'react'
import {
  renderAuthenticatedOffline,
  screen,
} from '../../../testUtilities/testingLibraryWithHelpers'
import InputAutocomplete from './InputAutocomplete'

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

test('InputAutocomplete: default no results view, noResultsText provided', async () => {
  const { user } = renderAuthenticatedOffline(
    <InputAutocomplete
      options={options}
      onChange={() => {}}
      noResultsText={'No results'}
      id="someId"
    />,
  )

  expect(screen.queryByTestId('noResult')).not.toBeInTheDocument()

  await user.type(screen.getByRole('textbox'), 'teiwhjfkdsjfskdl')
  expect(screen.getByTestId('noResult')).toBeInTheDocument()
})

test('InputAutocomplete: default no results view, no noResultsText provided', async () => {
  const { user } = renderAuthenticatedOffline(
    <InputAutocomplete options={options} onChange={() => {}} id="someId" />,
  )

  expect(screen.queryByTestId('noResult')).not.toBeInTheDocument()

  await user.type(screen.getByRole('textbox'), 'teiwhjfkdsjfskdl')
  expect(screen.queryByTestId('noResult')).not.toBeInTheDocument()
})

test('InputAutocomplete: custom no results view', async () => {
  const { user } = renderAuthenticatedOffline(
    <InputAutocomplete
      id="someId"
      options={options}
      onChange={() => {}}
      noResultsText="No Results"
      noResultsAction={<>Custom View</>}
    />,
  )

  expect(screen.queryByText('No Results')).not.toBeInTheDocument()
  expect(screen.queryByText('Custom View')).not.toBeInTheDocument()

  await user.type(screen.getByRole('textbox'), 'teiwhjfkdsjfskdl')

  expect(screen.getByText('Custom View')).toBeInTheDocument()
})
