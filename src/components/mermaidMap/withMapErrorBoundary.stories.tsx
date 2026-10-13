import React, { useEffect } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { GPUInitializationError } from 'maplibre-gl'

import ErrorBoundary from '../ErrorBoundary'
import withMapErrorBoundary from './withMapErrorBoundary'

// Stands in for a map component. Real maps construct MapLibre inside useEffect, so the
// errors are thrown from an effect here too.
const StandInMap = ({ error }: { error?: unknown }) => {
  useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return <div style={{ height: 200, background: '#9cc3d5' }}>Map</div>
}

const MapWithErrorBoundary = withMapErrorBoundary(StandInMap)

const meta = {
  component: MapWithErrorBoundary,
  // The page-level ErrorBoundary and the text around the map show that only the map is replaced.
  decorators: [
    (Story) => (
      <ErrorBoundary>
        <p>Content before the map</p>
        <Story />
        <p>Content after the map</p>
      </ErrorBoundary>
    ),
  ],
} satisfies Meta<typeof MapWithErrorBoundary>

type Story = StoryObj<typeof meta>

export const MapRenders: Story = {
  args: {},
}

export const WebGL2Unavailable: Story = {
  args: { error: new GPUInitializationError({}, null) },
}

export const OtherErrorReachesPageBoundary: Story = {
  args: { error: new Error('Something else broke') },
}

export default meta
