import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import {
  renderAuthenticatedOffline,
  renderAuthenticatedOnline,
  screen,
  waitFor,
} from '../../testUtilities/testingLibraryWithHelpers'
import NavMenu from '.'

test('NavMenu component shows project overview, collect, data, admin links when online', () => {
  renderAuthenticatedOnline(<NavMenu />)

  expect(screen.getByText(/project overview/i)).toBeInTheDocument()
  expect(screen.getByText(/project health/i)).toBeInTheDocument()
  expect(screen.getByText('Collect')).toBeInTheDocument()
  expect(screen.getByText('Collecting')).toBeInTheDocument()
  expect(screen.getByText(/sites/i)).toBeInTheDocument()
  expect(screen.getByText(/management regimes/i)).toBeInTheDocument()
  expect(screen.getByText('Data')).toBeInTheDocument()
  expect(screen.getByText(/submitted/i)).toBeInTheDocument()
  expect(screen.getByText(/admin/i)).toBeInTheDocument()
  expect(screen.getByText(/project info/i)).toBeInTheDocument()
  expect(screen.getByText(/users/i)).toBeInTheDocument()
  expect(screen.getByText(/fish families/i)).toBeInTheDocument()
  expect(screen.getByText(/data sharing/i)).toBeInTheDocument()
})

test('NavMenu component shows collect links; and hide project overview, data, admin links when offline', async () => {
  renderAuthenticatedOffline(<NavMenu />)

  await waitFor(() => {
    expect(screen.queryByText(/project overview/i)).not.toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByText(/project health/i)).not.toBeInTheDocument()
  })

  expect(screen.getByText('Collect')).toBeInTheDocument()
  expect(screen.getByText('Collecting')).toBeInTheDocument()
  expect(screen.getByText('Sites')).toBeInTheDocument()
  expect(screen.getByText('Management Regimes')).toBeInTheDocument()

  await waitFor(() => {
    expect(screen.queryByText(/data/i)).not.toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByText(/submitted/i)).not.toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByText(/graphs and maps/i)).not.toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByText(/admin/i)).not.toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByText(/project info/i)).not.toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByText(/users/i)).not.toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByText(/fish families/i)).not.toBeInTheDocument()
  })

  await waitFor(() => {
    expect(screen.queryByText(/data sharing/i)).not.toBeInTheDocument()
  })
})
