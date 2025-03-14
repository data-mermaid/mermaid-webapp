import '@testing-library/jest-dom'
import React from 'react'

import {
  renderAuthenticatedOffline,
  renderAuthenticatedOnline,
  screen,
  waitFor,
} from '../../testUtilities/testingLibraryWithHelpers'
import NavMenu from '.'

test('NavMenu component shows Overview, Metadata, data, admin links when online', async () => {
  renderAuthenticatedOnline(<NavMenu />)

  expect(screen.getByText('Metadata')).toBeInTheDocument()
  expect(screen.getByText('Collecting')).toBeInTheDocument()
  expect(screen.getByText('Sites')).toBeInTheDocument()
  expect(screen.getByText('Management Regimes')).toBeInTheDocument()
  expect(screen.getByText('Data')).toBeInTheDocument()
  expect(screen.getByText('Submitted')).toBeInTheDocument()
  expect(screen.getByText('Admin')).toBeInTheDocument()
  expect(screen.getByText('Overview')).toBeInTheDocument()
  expect(screen.getByText('Users')).toBeInTheDocument()
  expect(screen.getByText('Data Sharing')).toBeInTheDocument()
})

test('NavMenu component shows Metadata links; and hide Overview, data, admin links when offline', async () => {
  renderAuthenticatedOffline(<NavMenu />)

  await waitFor(() => {
    expect(screen.queryByText('Overview')).not.toBeInTheDocument()
  })

  expect(screen.getByText('Data')).toBeInTheDocument()
  expect(screen.getByText('Metadata')).toBeInTheDocument()
  expect(screen.getByText('Collecting')).toBeInTheDocument()
  expect(screen.getByText('Sites')).toBeInTheDocument()
  expect(screen.getByText('Management Regimes')).toBeInTheDocument()

  await waitFor(() => {
    expect(screen.queryByText('Submitted')).not.toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByText('admin')).not.toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByText('overview')).not.toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByText('users')).not.toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByText('data sharing')).not.toBeInTheDocument()
  })
})
