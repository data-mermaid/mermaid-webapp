import { http, HttpResponse } from 'msw'

import mockMermaidApiAllSuccessful from './mockMermaidApiAllSuccessful'
import mockMermaidData from './mockMermaidData'

const apiBaseUrl = import.meta.env.VITE_MERMAID_API

// Makes the pull that follows Validate return `validatedCollectRecord`, which is what the UI
// shows as the validation result. The page's load sync may still be pulling when Validate is
// clicked, so pulls made before the validate request fall through to the default handler.
const mockPullAfterValidate = (validatedCollectRecord) => {
  let isValidateRequested = false

  mockMermaidApiAllSuccessful.use(
    http.post(`${apiBaseUrl}/projects/5/collectrecords/validate/`, () => {
      isValidateRequested = true

      return new HttpResponse(null, { status: 200 })
    }),
    http.post(`${apiBaseUrl}/pull/`, () => {
      if (!isValidateRequested) {
        return undefined
      }

      return HttpResponse.json({
        benthic_attributes: { updates: mockMermaidData.benthic_attributes },
        invert_attributes: { updates: mockMermaidData.invert_attributes },
        choices: { updates: mockMermaidData.choices },
        collect_records: { updates: [validatedCollectRecord] },
        fish_families: { updates: mockMermaidData.fish_families },
        fish_genera: { updates: mockMermaidData.fish_genera },
        fish_species: { updates: mockMermaidData.fish_species },
        project_managements: { updates: mockMermaidData.project_managements },
        project_profiles: { updates: mockMermaidData.project_profiles },
        project_sites: { updates: mockMermaidData.project_sites },
        projects: { updates: mockMermaidData.projects },
      })
    }),
  )
}

export default mockPullAfterValidate
