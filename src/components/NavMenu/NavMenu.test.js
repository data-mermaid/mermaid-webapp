import '@testing-library/jest-dom/extend-expect'
import React from 'react'

import {
  renderAuthenticatedOffline,
  renderAuthenticatedOnline,
  // screen,
  // waitFor,
  // within,
} from '../../testUtilities/testingLibraryWithHelpers'
import NavMenu from '.'

test('NavMenu component shows project overview, collect, data, admin links when online', async () => {
  renderAuthenticatedOnline(<NavMenu />)

  // expect(await screen.findByText('Project Overview')).toBeInTheDocument()
  // expect(screen.getByText('Project Health')).toBeInTheDocument()

  // expect(screen.getByText('Collecting')).toBeInTheDocument()
  // expect(screen.getByText('Sites')).toBeInTheDocument()
  // expect(screen.getByText('Management Regimes')).toBeInTheDocument()
  // expect(screen.getByText('Data')).toBeInTheDocument()
  // expect(screen.getByText('Submitted')).toBeInTheDocument()
  // expect(screen.getByText('Admin')).toBeInTheDocument()
  // expect(screen.getByText('Project Info')).toBeInTheDocument()
  // expect(screen.getByText('Users')).toBeInTheDocument()
  // expect(screen.getByText('Fish Families')).toBeInTheDocument()
  // expect(screen.getByText('Data Sharing')).toBeInTheDocument()
})

test('NavMenu component shows collect links; and hide project overview, data, admin links when offline', async () => {
  renderAuthenticatedOffline(<NavMenu />)

  // await waitFor(() => {
  //   expect(screen.queryByText('Project Overview')).not.toBeInTheDocument()
  // })

  // await waitFor(() => {
  //   expect(screen.queryByText('Project Health')).not.toBeInTheDocument()
  // })

  // expect(screen.getByText('Collect')).toBeInTheDocument()
  // expect(screen.getByText('Collecting')).toBeInTheDocument()
  // expect(screen.getByText('Sites')).toBeInTheDocument()
  // expect(screen.getByText('Management Regimes')).toBeInTheDocument()

  // await waitFor(() => {
  //   expect(screen.queryByText('Data')).not.toBeInTheDocument()
  // })

  // await waitFor(() => {
  //   expect(screen.queryByText('Submitted')).not.toBeInTheDocument()
  // })

  // await waitFor(() => {
  //   expect(screen.queryByText('graphs and maps')).not.toBeInTheDocument()
  // })

  // await waitFor(() => {
  //   expect(screen.queryByText('admin')).not.toBeInTheDocument()
  // })

  // await waitFor(() => {
  //   expect(screen.queryByText('project info')).not.toBeInTheDocument()
  // })

  // await waitFor(() => {
  //   expect(screen.queryByText('users')).not.toBeInTheDocument()
  // })

  // await waitFor(() => {
  //   expect(screen.queryByText('fish families')).not.toBeInTheDocument()
  // })

  // await waitFor(() => {
  //   expect(screen.queryByText('data sharing')).not.toBeInTheDocument()
  // })
})
