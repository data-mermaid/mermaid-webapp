import React from 'react'
import { GPUInitializationError } from 'maplibre-gl'
import i18n from '../../../i18n'
import PageUnavailable from '../pages/PageUnavailable'

interface MapErrorBoundaryProps {
  children: React.ReactNode
}

interface MapErrorBoundaryState {
  error: unknown
}

// The MapLibre Map constructor throws GPUInitializationError when the browser cannot create a
// WebGL2 context. Catching it here keeps the rest of the page usable instead of failing the
// whole page at the page-level ErrorBoundary.
class MapErrorBoundary extends React.Component<MapErrorBoundaryProps, MapErrorBoundaryState> {
  state: MapErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: unknown) {
    return { error }
  }

  render() {
    const { error } = this.state

    if (error === null) {
      return this.props.children
    }

    // Any other error is a bug, so pass it on to the page-level ErrorBoundary, which reports it.
    if (!(error instanceof GPUInitializationError)) {
      throw error
    }

    return <PageUnavailable>{i18n.t('map.webgl2_unavailable')}</PageUnavailable>
  }
}

const withMapErrorBoundary = <P extends object>(MapComponent: React.ComponentType<P>) => {
  const MapWithErrorBoundary = (props: P) => (
    <MapErrorBoundary>
      <MapComponent {...props} />
    </MapErrorBoundary>
  )

  return MapWithErrorBoundary
}

export default withMapErrorBoundary
