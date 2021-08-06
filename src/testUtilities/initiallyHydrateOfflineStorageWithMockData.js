import mockMermaidData from './mockMermaidData'

export const initiallyHydrateOfflineStorageWithMockData = (dexieInstance) => {
  return dexieInstance.transaction(
    'rw',
    dexieInstance.fish_species,
    dexieInstance.fish_genera,
    dexieInstance.fish_families,
    dexieInstance.collect_records,
    dexieInstance.projects,
    async () => {
      mockMermaidData.fish_species.forEach((specie) => {
        dexieInstance.fish_species.put(specie)
      })
      mockMermaidData.fish_genera.forEach((genera) => {
        dexieInstance.fish_genera.put(genera)
      })
      mockMermaidData.fish_families.forEach((specie) => {
        dexieInstance.fish_families.put(specie)
      })

      mockMermaidData.collect_records.forEach((record) => {
        dexieInstance.collect_records.put(record)
      })

      mockMermaidData.projects.forEach((project) => {
        dexieInstance.projects.put(project)
      })
    },
  )
}
