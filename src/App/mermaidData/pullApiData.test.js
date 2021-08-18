import { rest } from 'msw'
import { getMockDexieInstanceAllSuccess } from '../../testUtilities/mockDexie'
import mockMermaidApiAllSuccessful from '../../testUtilities/mockMermaidApiAllSuccessful'
import mockMermaidData from '../../testUtilities/mockMermaidData'
import { pullApiData } from './pullApiData'

const allTheDataNames = [
  'benthic_attributes',
  'choices',
  'collect_records',
  'fish_families',
  'fish_genera',
  'fish_species',
  'project_managements',
  'project_profiles',
  'project_sites',
  'projects',
]
const apiBaseUrl = process.env.REACT_APP_MERMAID_API
const auth0Token = 'fakewhatever'
const projectId = '5'

test('pullApiData strips _pushToApi properties from api response', async () => {
  const dexieInstance = getMockDexieInstanceAllSuccess()

  mockMermaidApiAllSuccessful.use(
    rest.post(`${process.env.REACT_APP_MERMAID_API}/pull/`, (req, res, ctx) => {
      const response = {
        benthic_attributes: {
          updates: [
            { ...mockMermaidData.benthic_attributes[0], _pushToApi: true },
          ],
        },
        // choices is weird
        choices: {
          updates: { ...mockMermaidData.choices[0], _pushToApi: true },
        },
        collect_records: {
          updates: [
            { ...mockMermaidData.collect_records[0], _pushToApi: true },
          ],
        },
        fish_families: {
          updates: [{ ...mockMermaidData.fish_families[0], _pushToApi: true }],
        },
        fish_genera: {
          updates: [{ ...mockMermaidData.fish_genera[0], _pushToApi: true }],
        },
        fish_species: {
          updates: [{ ...mockMermaidData.fish_species[0], _pushToApi: true }],
        },
        project_managements: {
          updates: [
            { ...mockMermaidData.project_managements[0], _pushToApi: true },
          ],
        },
        project_profiles: {
          updates: [
            { ...mockMermaidData.project_profiles[0], _pushToApi: true },
          ],
        },
        project_sites: {
          updates: [{ ...mockMermaidData.project_sites[0], _pushToApi: true }],
        },
        projects: {
          updates: [{ ...mockMermaidData.projects[0], _pushToApi: true }],
        },
      }

      return res(ctx.json(response))
    }),
  )

  await pullApiData({
    dexieInstance,
    auth0Token,
    apiBaseUrl,
    apiDataNamesToPull: allTheDataNames,
    projectId,
  })

  await Promise.all([
    dexieInstance.benthic_attributes.toArray(),
    dexieInstance.choices.toArray(),
    dexieInstance.collect_records.toArray(),
    dexieInstance.fish_families.toArray(),
    dexieInstance.fish_genera.toArray(),
    dexieInstance.fish_species.toArray(),
    dexieInstance.project_managements.toArray(),
    dexieInstance.project_profiles.toArray(),
    dexieInstance.project_sites.toArray(),
    dexieInstance.projects.toArray(),
  ]).then(
    ([
      benthicAttributesStored,
      choicesStored,
      collectRecordsStored,
      fishFamiliesStored,
      fishGeneraStored,
      fishSpeciesStored,
      projectManagementsStored,
      projectProfilesStored,
      projectStiesStored,
      projectsStored,
    ]) => {
      expect(benthicAttributesStored[0]._pushToApi).toBeFalsy()
      // choices is weird
      expect(choicesStored[0].choices._pushToApi).toBeFalsy()
      expect(collectRecordsStored[0]._pushToApi).toBeFalsy()
      expect(fishFamiliesStored[0]._pushToApi).toBeFalsy()
      expect(fishGeneraStored[0]._pushToApi).toBeFalsy()
      expect(fishSpeciesStored[0]._pushToApi).toBeFalsy()
      expect(projectManagementsStored[0]._pushToApi).toBeFalsy()
      expect(projectProfilesStored[0]._pushToApi).toBeFalsy()
      expect(projectStiesStored[0]._pushToApi).toBeFalsy()
      expect(projectsStored[0]._pushToApi).toBeFalsy()
    },
  )
})
