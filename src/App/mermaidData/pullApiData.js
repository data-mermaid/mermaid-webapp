import axios from 'axios'
import {
  getLastRevisionNumbersPulled,
  persistLastRevisionNumbersPulled,
} from './lastRevisionNumbers'

const resetPushToApiTagFromItems = (items) =>
  items.map((item) => ({ ...item, uiState_pushToApi: false }))

export const pullApiData = async ({
  dexieInstance,
  auth0Token,
  apiBaseUrl,
  apiDataNamesToPull,
  projectId,
}) => {
  const lastRevisionNumbersPulled = await getLastRevisionNumbersPulled({
    dexieInstance,
  })

  const pullRequestBody = apiDataNamesToPull.reduce(
    (accumulator, apiDataName) => ({
      ...accumulator,
      [apiDataName]: {
        last_revision: lastRevisionNumbersPulled?.[apiDataName] ?? null,
        project: projectId ?? null,
      },
    }),
    {},
  )

  const pullResponse = await axios.post(
    `${apiBaseUrl}/pull/`,
    pullRequestBody,
    {
      headers: {
        Authorization: `Bearer ${auth0Token}`,
      },
    },
  )

  const apiData = pullResponse.data

  await persistLastRevisionNumbersPulled({
    dexieInstance,
    apiData,
  })

  await dexieInstance.transaction(
    'rw',
    dexieInstance.benthic_attributes,
    dexieInstance.choices,
    dexieInstance.collect_records,
    dexieInstance.fish_families,
    dexieInstance.fish_genera,
    dexieInstance.fish_species,
    dexieInstance.project_managements,
    dexieInstance.project_profiles,
    dexieInstance.project_sites,
    dexieInstance.projects,
    async () => {
      apiDataNamesToPull.forEach((apiDataType) => {
        if (apiDataType === 'choices') {
          // choices deletes property will always be empty, so we just ignore it
          // additionally the updates property is an object, not an array, so we just store it directly

          dexieInstance.choices.put({
            id: 'enforceOnlyOneRecordEverStoredAndOverwritten',
            choices: { ...apiData.choices?.updates, uiState_pushToApi: false },
          })
        }
        if (apiDataType !== 'choices') {
          const updates = apiData[apiDataType]?.updates ?? []
          const updatesWithPushToApiTagReset = resetPushToApiTagFromItems(
            updates,
          )
          const deletes = apiData[apiDataType]?.deletes ?? []
          const deleteIds = deletes.map(({ id }) => id)

          dexieInstance[apiDataType].bulkPut(updatesWithPushToApiTagReset)
          dexieInstance[apiDataType].bulkDelete(deleteIds)
        }
      })
    },
  )

  return pullResponse
}
