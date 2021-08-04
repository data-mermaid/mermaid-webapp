const persistLastRevisionNumbersPulled = ({ dexieInstance, apiData }) => {
  return dexieInstance.transaction(
    'rw',
    dexieInstance.lastRevisionNumbersPulled,
    async () => {
      const dataNames = [
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

      dataNames.forEach((dataName) => {
        if (apiData[dataName]) {
          dexieInstance.lastRevisionNumbersPulled.put({
            id: dataName,
            lastRevisionNumber: apiData[dataName].last_revision_num,
          })
        }
      })
    },
  )
}

const getLastRevisionNumbersPulled = async ({ dexieInstance }) => {
  const lastRevisionNumberDexieRecords = await dexieInstance.lastRevisionNumbersPulled.toArray()

  const lastRevisionNumbersObject = lastRevisionNumberDexieRecords.reduce(
    (accumulator, lastRevisionNumberRecord) => ({
      ...accumulator,
      [lastRevisionNumberRecord.id]:
        lastRevisionNumberRecord.lastRevisionNumber,
    }),
    {},
  )

  return lastRevisionNumbersObject
}

export { persistLastRevisionNumbersPulled, getLastRevisionNumbersPulled }
