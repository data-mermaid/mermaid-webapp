import { beforeEach, expect, test, vi } from 'vitest'
import React, { useEffect } from 'react'
import { render, screen } from '@testing-library/react'
import { GPUInitializationError } from 'maplibre-gl'

import ErrorBoundary from '../ErrorBoundary'
import withMapErrorBoundary from './withMapErrorBoundary'

// Maps construct MapLibre inside useEffect, so these throw from an effect too.
const MapThrowing = ({ error }: { error: Error }) => {
  useEffect(() => {
    throw error
  }, [error])

  return <p>Map</p>
}

const WrappedMap = withMapErrorBoundary(MapThrowing)

beforeEach(() => {
  // React logs every error a boundary catches.
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

test('replaces only the map with a message when WebGL2 is unavailable', () => {
  render(
    <ErrorBoundary>
      <p>Rest of the page</p>
      <WrappedMap error={new GPUInitializationError({}, null)} />
    </ErrorBoundary>,
  )

  expect(screen.getByText('map.webgl2_unavailable')).toBeInTheDocument()
  expect(screen.getByText('Rest of the page')).toBeInTheDocument()
  expect(screen.queryByTestId('error-boundary-message')).not.toBeInTheDocument()
})

test('passes any other error to the page-level ErrorBoundary', () => {
  render(
    <ErrorBoundary>
      <WrappedMap error={new Error('Something else broke')} />
    </ErrorBoundary>,
  )

  expect(screen.getByTestId('error-boundary-message')).toBeInTheDocument()
  expect(screen.queryByText('map.webgl2_unavailable')).not.toBeInTheDocument()
})
