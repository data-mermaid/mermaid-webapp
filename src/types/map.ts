import { Map } from 'maplibre-gl'
import { RefObject } from 'react'

export type MapRef = RefObject<Map | null | undefined>
