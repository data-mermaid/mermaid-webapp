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

  expect(screen.getByTestId('nav-header-metadata')).toBeInTheDocument()
  expect(screen.getByTestId('nav-collecting')).toBeInTheDocument()
  expect(screen.getByTestId('nav-sites')).toBeInTheDocument()
  expect(screen.getByTestId('nav-management-regimes')).toBeInTheDocument()
  expect(screen.getByTestId('nav-header-data')).toBeInTheDocument()
  expect(screen.getByTestId('nav-submitted')).toBeInTheDocument()
  expect(screen.getByTestId('nav-header-admin')).toBeInTheDocument()
  expect(screen.getByTestId('nav-header-overview')).toBeInTheDocument()
  expect(screen.getByTestId('nav-users')).toBeInTheDocument()
  expect(screen.getByTestId('nav-data-sharing')).toBeInTheDocument()
})

test('NavMenu component shows Metadata links; and hide Overview, data, admin links when offline', async () => {
  renderAuthenticatedOffline(<NavMenu />)

  await waitFor(() => {
    expect(screen.queryByTestId('nav-header-overview')).not.toBeInTheDocument()
  })

  expect(screen.getByTestId('nav-header-data')).toBeInTheDocument()
  expect(screen.getByTestId('nav-header-metadata')).toBeInTheDocument()
  expect(screen.getByTestId('nav-collecting')).toBeInTheDocument()
  expect(screen.getByTestId('nav-sites')).toBeInTheDocument()
  expect(screen.getByTestId('nav-management-regimes')).toBeInTheDocument()

  await waitFor(() => {
    expect(screen.queryByTestId('nav-submitted')).not.toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByTestId('nav-header-admin')).not.toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByTestId('nav-header-overview')).not.toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByTestId('nav-users')).not.toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByTestId('nav-data-sharing')).not.toBeInTheDocument()
  })
})
