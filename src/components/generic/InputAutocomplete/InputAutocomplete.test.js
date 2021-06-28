import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
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

test('InputAutocomplete: default no results view', () => {
  renderAuthenticatedOffline(
    <InputAutocomplete options={options} onChange={() => {}} />,
  )

  expect(screen.queryByText('No Results')).not.toBeInTheDocument()

  userEvent.type(screen.getByRole('textbox'), 'teiwhjfkdsjfskdl')

  expect(screen.getByText('No Results')).toBeInTheDocument()
})

test('InputAutocomplete: custom no results view', () => {
  renderAuthenticatedOffline(
    <InputAutocomplete
      options={options}
      onChange={() => {}}
      noResultsDisplay={<>Custom View</>}
    />,
  )

  expect(screen.queryByText('No Results')).not.toBeInTheDocument()
  expect(screen.queryByText('Custom View')).not.toBeInTheDocument()

  userEvent.type(screen.getByRole('textbox'), 'teiwhjfkdsjfskdl')

  expect(screen.getByText('Custom View')).toBeInTheDocument()
  expect(screen.queryByText('No Results')).not.toBeInTheDocument()
})
