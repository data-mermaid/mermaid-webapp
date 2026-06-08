import { expect, test } from 'vitest'
import '@testing-library/jest-dom'
import React from 'react'
import { renderAuthenticatedOnline, screen } from '../../testUtilities/testingLibraryWithHelpers'
import MethodsFilterDropDown from './MethodsFilterDropDown'

const macroinvertebrateEnabledUser = {
  id: 'fake-id',
  first_name: 'FakeFirstName',
  last_name: 'FakeLastName',
  full_name: 'FakeFirstName FakeLastName',
  projects: [],
  collect_state: {},
  optional_features: [{ label: 'macroinvertebrate_enabled', enabled: true }],
}

const macroinvertebrateDisabledUser = {
  id: 'fake-id',
  first_name: 'FakeFirstName',
  last_name: 'FakeLastName',
  full_name: 'FakeFirstName FakeLastName',
  projects: [],
  collect_state: {},
  optional_features: [],
}

test('MethodsFilterDropDown renders 7 options when macroinvertebrate feature is enabled', async () => {
  const { user } = renderAuthenticatedOnline(
    <MethodsFilterDropDown handleMethodsColumnFilterChange={() => {}} />,
    { currentUserOverride: macroinvertebrateEnabledUser },
  )

  await user.click(screen.getByRole('combobox'))
  expect(screen.getAllByRole('option')).toHaveLength(7)
})

test('MethodsFilterDropDown renders 6 options when macroinvertebrate feature is disabled', async () => {
  const { user } = renderAuthenticatedOnline(
    <MethodsFilterDropDown handleMethodsColumnFilterChange={() => {}} />,
    { currentUserOverride: macroinvertebrateDisabledUser },
  )

  await user.click(screen.getByRole('combobox'))
  expect(screen.getAllByRole('option')).toHaveLength(6)
})
