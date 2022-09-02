import axios from 'axios'
import {
  getLastRevisionNumbersPulledForAProject,
  persistLastRevisionNumbersPulled,
} from './lastRevisionNumbers'
import { getAuthorizationHeaders } from '../../library/getAuthorizationHeaders'

const resetPushToApiTagFromItems = (items) =>
  items.map((item) => ({ ...item, uiState_pushToApi: false }))

export const pullApiData = async ({
  dexiePerUserDataInstance,
  getAccessToken,
  apiBaseUrl,
  apiDataNamesToPull,
  projectId,
}) => {
  const lastRevisionNumbersPulled = await getLastRevisionNumbersPulledForAProject({
    dexiePerUserDataInstance,
    projectId,
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
    await getAuthorizationHeaders(getAccessToken),
  )

  const apiData = pullResponse.data

  await dexiePerUserDataInstance.transaction(
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
    dexiePerUserDataInstance.uiState_lastRevisionNumbersPulled,
    async () => {
      persistLastRevisionNumbersPulled({
        dexiePerUserDataInstance,
        apiData,
        projectId,
      })

      apiDataNamesToPull.forEach((apiDataType) => {
        if (apiDataType === 'choices') {
          // choices deletes property will always be empty, so we just ignore it
          // additionally the updates property is an object, not an array, so we just store it directly

          dexiePerUserDataInstance.choices.put({
            id: 'enforceOnlyOneRecordEverStoredAndOverwritten',
            choices: { ...apiData.choices?.updates, uiState_pushToApi: false },
          })
        }
        if (apiDataType !== 'choices') {
          const updates = apiData[apiDataType]?.updates ?? []
          const updatesWithPushToApiTagReset = resetPushToApiTagFromItems(updates)
          const deletes = apiData[apiDataType]?.deletes ?? []
          const deleteIds = deletes.map(({ id }) => id)
          const errorIds = apiData[apiDataType]?.error?.record_ids ?? []
          // Use Set to remove duplicates
          const bulkDeleteIds = Array.from(new Set([...deleteIds, ...errorIds]))

          dexiePerUserDataInstance[apiDataType].bulkPut(updatesWithPushToApiTagReset)
          dexiePerUserDataInstance[apiDataType].bulkDelete(bulkDeleteIds)
        }
      })
    },
  )

  return pullResponse
}
