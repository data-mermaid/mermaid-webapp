import mockMermaidData from './mockMermaidData'

export const initiallyHydrateOfflineStorageWithMockData = (dexieInstance) => {
  return dexieInstance.transaction(
    'rw',
    dexieInstance.benthic_attributes,
    dexieInstance.choices,
    dexieInstance.collect_records,
    dexieInstance.fish_families,
    dexieInstance.fish_genera,
    dexieInstance.fish_species,
    dexieInstance.project_managements,
    dexieInstance.project_profiles,
    dexieInstance.project_sites,
    dexieInstance.projects,
    async () => {
      // choices is not an array, so not like th others
      const allThePullableDataNamesButChoices = [
        'benthic_attributes',
        'collect_records',
        'fish_families',
        'fish_genera',
        'fish_species',
        'project_managements',
        'project_profiles',
        'project_sites',
        'projects',
      ]

      allThePullableDataNamesButChoices.forEach((dataType) => {
        dexieInstance[dataType].bulkPut(mockMermaidData[dataType])
      })

      dexieInstance.choices.put({
        id: 'enforceOnlyOneRecordEverStoredAndOverwritten',
        choices: mockMermaidData.choices,
      })
    },
  )
}
