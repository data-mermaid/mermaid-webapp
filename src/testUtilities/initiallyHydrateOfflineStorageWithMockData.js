import mockMermaidData from './mockMermaidData'

export const initiallyHydrateOfflineStorageWithMockData = (dexieInstance) => {
  return dexieInstance.transaction(
    'rw',
    dexieInstance.fish_species,
    dexieInstance.collect_records,
    dexieInstance.projects,
    async () => {
      mockMermaidData.fishSpecies.forEach((specie) => {
        dexieInstance.fish_species.put(specie)
      })

      mockMermaidData.collectRecords.forEach((record) => {
        dexieInstance.collect_records.put(record)
      })

      mockMermaidData.projects.forEach((project) => {
        dexieInstance.projects.put(project)
      })
    },
  )
}
