const persistLastRevisionNumbersPulled = ({ dexiePerUserDataInstance, apiData, projectId }) => {
  return dexiePerUserDataInstance.transaction(
    'rw',
    dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled,
    async () => {
      const dataTypes = [
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

      dataTypes.forEach((dataType) => {
        if (apiData[dataType]) {
          const isDataTypeProjectAssociated =
            dataType === 'collect_records' ||
            dataType === 'project_managements' ||
            dataType === 'project_profiles' ||
            dataType === 'project_sites'

          const projectIdToUse = isDataTypeProjectAssociated
            ? projectId ?? 'n/a' // this hedges against the api sending more dataTypes than were asked for, eg in tests
            : 'n/a'

          dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled.put({
            dataType,
            projectId: projectIdToUse,
            lastRevisionNumber: apiData[dataType].last_revision_num,
          })
        }
      })
    },
  )
}

const getLastRevisionNumbersPulledForAProject = async ({ dexiePerUserDataInstance, projectId }) => {
  const lastRevisionNumberDexieRecords =
    await dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled
      .where('projectId')
      .anyOf(projectId, 'n/a')
      .toArray()

  const lastRevisionNumbersObject = lastRevisionNumberDexieRecords.reduce(
    (accumulator, lastRevisionNumberRecord) => ({
      ...accumulator,
      [lastRevisionNumberRecord.dataType]: lastRevisionNumberRecord.lastRevisionNumber,
    }),
    {},
  )

  return lastRevisionNumbersObject
}

export { persistLastRevisionNumbersPulled, getLastRevisionNumbersPulledForAProject }
