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
    dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled,

    async () => {
      // choices are not an array, so not like the others
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

export const initiallyHydrateOfflineStorageWithMockDataNoDemoProject = (
  dexiePerUserDataInstance,
) => {
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
    dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled,

    async () => {
      const allThePullableDataNamesButChoicesAndProjects = [
        'benthic_attributes',
        'collect_records',
        'fish_families',
        'fish_genera',
        'fish_species',
        'project_managements',
        'project_profiles',
        'project_sites',
      ]

      allThePullableDataNamesButChoicesAndProjects.forEach((dataType) => {
        dexiePerUserDataInstance[dataType].bulkPut(mockMermaidData[dataType])
      })

      // Filter out demo projects (is_demo: true)
      const projectsWithoutDemo = mockMermaidData.projects.filter(
        (project) => project.is_demo !== true,
      )
      dexiePerUserDataInstance.projects.bulkPut(projectsWithoutDemo)

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
