import mockMermaidData from './mockMermaidData'

export const initiallyHydrateOfflineStorageWithMockData = (dexieInstance) => {
  return dexieInstance.transaction(
    'rw',
    dexieInstance.fishSpecies,
    dexieInstance.collectRecords,
    async () => {
      mockMermaidData.fishSpecies.forEach((specie) => {
        dexieInstance.fishSpecies.put(specie)
      })

      mockMermaidData.collectRecords.forEach((record) => {
        dexieInstance.collectRecords.put(record)
      })
    },
  )
}
