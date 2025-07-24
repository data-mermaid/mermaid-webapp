interface BboxParams {
  xmin: number
  ymin: number
  xmax: number
  ymax: number
}

interface OpenExploreLinkQueryParams {
  project?: string
  your_projects_only?: string | boolean
  bbox?: BboxParams
}

/**
 * Opens a new browser tab to the MERMAID Explore tool with query parameters constructed from the provided object.
 * Optionally includes a bounding box (`bbox`) as a comma-separated string.
 *
 * @param {OpenExploreLinkQueryParams} params - An object containing optional query parameters for the Explore URL.
 *   - `project`: (string) Optional. The project name to include in the URL.
 *   - `your_projects_only`: (string | boolean) Optional. Flag indicating if only user-specific projects should be shown.
 *   - `bbox`: (BboxParams) Optional. An object defining the bounding box (spatial extent) to include.
 *       - Format: { xmin: number, ymin: number, xmax: number, ymax: number }
 *       - Will be appended as a single "bbox" query parameter: "xmin,ymin,xmax,ymax"
 *
 * Notes:
 * - Each parameter (if provided) is encoded and appended to the query string.
 * - The resulting URL is opened in a new browser tab.
 */

export const openExploreLinkWithBbox = (params: OpenExploreLinkQueryParams): void => {
  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (key === 'bbox' && typeof value === 'object' && value !== null) {
      const { xmin, ymin, xmax, ymax } = value as BboxParams
      searchParams.append('bbox', `${xmin},${ymin},${xmax},${ymax}`)
    } else if (
      typeof value === 'string' ||
      typeof value === 'boolean' ||
      typeof value === 'number'
    ) {
      searchParams.append(key, encodeURIComponent(value.toString()))
    }
  }

  const url = `${import.meta.env.VITE_MERMAID_EXPLORE_LINK}/?${searchParams.toString()}`
  window.open(url, '_blank')
}
