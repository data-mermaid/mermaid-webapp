import { initiallyHydrateOfflineStorageWithMockData } from '../testUtilities/initiallyHydrateOfflineStorageWithMockData'

export const initiallyHydrateOfflineStorageWithApiData = (dexieInstance) => {
  /** this is very WIP.
   * Currently we only have fish species, and collect records being loaded into storage here
   * (so that suggesting a new species will work now and will work later with minimal refactor),
   * but the rest will come as we transition away
   * from using mocked data and mature the archetecture*/

  return dexieInstance.transaction(
    'rw',
    dexieInstance.fishSpecies,
    dexieInstance.hasInitialApiHydrationCompleted,
    dexieInstance.collectRecords,
    async () => {
      const isAlreadyInitialiazed = !!(
        await dexieInstance.hasInitialApiHydrationCompleted.toArray()
      ).length

      if (!isAlreadyInitialiazed) {
        initiallyHydrateOfflineStorageWithMockData(dexieInstance)

        dexieInstance.hasInitialApiHydrationCompleted.put({
          id: 'enforceOnlyOneRecordEverStoredAndOverwritten',
        })
      }
    },
  )
}
