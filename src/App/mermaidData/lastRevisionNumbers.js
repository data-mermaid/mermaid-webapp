const persistLastRevisionNumbersPulled = ({ dexieInstance, apiData }) => {
  const objectToStore = {
    id: 'enforceOnlyOneRecordEverStoredAndOverwritten',
    lastRevisionNumbers: {
      collectRecords: apiData.collect_records?.last_revision_num,
    },
  }

  return dexieInstance.lastRevisionNumbersPulled.put(objectToStore)
}

const getLastRevisionNumbersPulled = async ({ dexieInstance }) => {
  return (await dexieInstance.lastRevisionNumbersPulled.toArray())[0]
    ?.lastRevisionNumbers
}

export { persistLastRevisionNumbersPulled, getLastRevisionNumbersPulled }
