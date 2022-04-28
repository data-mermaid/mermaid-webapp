import mockMermaidData from './mockMermaidData'

export const initiallyHydrateOfflineStorageWithMockData = (dexiePerUserDataInstance) => {
  return dexiePerUserDataInstance.transaction(
    'rw',
    dexiePerUserDataInstance.benthic_attributes,
    dexiePerUserDataInstance.choices,
    dexiePerUserDataInstance.collect_records,
    dexiePerUserDataInstance.fish_families,
    dexiePerUserDataInstance.fish_genera,
    dexiePerUserDataInstance.fish_species,
    dexiePerUserDataInstance.project_managements,
    dexiePerUserDataInstance.project_profiles,
    dexiePerUserDataInstance.project_sites,
    dexiePerUserDataInstance.projects,
    dexiePerUserDataInstance.uiState_offlineReadyProjects,

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
        dexiePerUserDataInstance[dataType].bulkPut(mockMermaidData[dataType])
      })

      dexiePerUserDataInstance.choices.put({
        id: 'enforceOnlyOneRecordEverStoredAndOverwritten',
        choices: mockMermaidData.choices,
      })

      dexiePerUserDataInstance.uiState_offlineReadyProjects.put({
        id: '1',
      })
    },
  )
}
