interface BboxParams {
  xmin: number
  ymin: number
  xmax: number
  ymax: number
}

/**
 * Opens a new browser tab with a constructed URL that includes query parameters and an optional bounding box (bbox).
 *
 * @param {Record<string, string>} queryParamsObject - An object containing key-value pairs to be converted into query parameters.
 * @param {BboxParams} [bbox] - An optional bounding box object with properties xmin, ymin, xmax, and ymax.
 *                              If provided, it will be appended to the query parameters as "bbox".
 *                              Example: { xmin: -75.0, ymin: 45.0, xmax: -74.0, ymax: 46.0 }
 */

export const openExploreLinkWithBbox = (
  queryParamsObject: Record<string, string>,
  bbox?: BboxParams,
): void => {
  const queryParams = new URLSearchParams(queryParamsObject)

  if (bbox) {
    queryParams.append('bbox', `${bbox.xmin},${bbox.ymin},${bbox.xmax},${bbox.ymax}`)
  }

  window.open(`${import.meta.env.VITE_MERMAID_EXPLORE_LINK}/?${queryParams.toString()}`, '_blank')
}
