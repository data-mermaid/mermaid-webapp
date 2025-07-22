interface BboxParams {
  xmin: number
  ymin: number
  xmax: number
  ymax: number
}

interface OpenExploreLinkQueryParams {
  project: string
  your_projects_only?: string | boolean
  bbox?: BboxParams
}

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
