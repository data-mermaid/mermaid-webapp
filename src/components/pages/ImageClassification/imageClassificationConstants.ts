import { LngLatLike } from 'maplibre-gl'

export const EXCLUDE_PARAMS_FOR_GET_ALL_IMAGES_IN_COLLECT_RECORD =
  'data,created_by,updated_by,updated_on,original_image_width,original_image_height,location,comments,image,photo_timestamp'
export const DEFAULT_MAP_CENTER: LngLatLike = [0, 0] // this value doesn't matter, default to null island
export const DEFAULT_MAP_ZOOM = 2 // needs to be > 1 otherwise bounds become > 180 and > 85
export const DEFAULT_MAP_ANIMATION_DURATION = 1000
