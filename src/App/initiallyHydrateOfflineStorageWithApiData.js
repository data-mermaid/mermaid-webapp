import { initiallyHydrateOfflineStorageWithMockData } from '../testUtilities/initiallyHydrateOfflineStorageWithMockData'

export const initiallyHydrateOfflineStorageWithApiData = (dexieInstance) => {
  /** this is very WIP.
   * Currently we only have fish species, and collect records being loaded into storage here
   * (so that suggesting a new species will work now and will work later with minimal refactor),
   * but the rest will come as we transition away
   * from using mocked data and mature the architecture*/


  return dexieInstance.transaction(
    'rw',
    dexieInstance.fishSpecies,
    dexieInstance.collectRecords,
    async () => {
      initiallyHydrateOfflineStorageWithMockData(dexieInstance)
    },
  )
}
