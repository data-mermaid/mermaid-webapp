import axios from '../../../library/axiosRetry'
import { getAuthorizationHeaders } from '../../../library/getAuthorizationHeaders'

const getUniqueIds = (ids = []) => Array.from(new Set(ids.filter(Boolean)))

export const ensureAttributesLoaded = async ({
  ids,
  dexieTable,
  detailUrlById,
  getAccessToken,
  isOnlineAuthenticatedAndReady,
}) => {
  if (!isOnlineAuthenticatedAndReady) {
    return
  }

  const uniqueIds = getUniqueIds(ids)

  if (!uniqueIds.length) {
    return
  }

  const existingItems = await dexieTable.bulkGet(uniqueIds)
  const missingIds = uniqueIds.filter((id, index) => !existingItems[index])

  if (!missingIds.length) {
    return
  }

  await Promise.all(
    missingIds.map(async (id) => {
      try {
        const response = await axios.get(
          detailUrlById(id),
          await getAuthorizationHeaders(getAccessToken),
        )

        if (response?.data) {
          await dexieTable.put({ ...response.data, uiState_pushToApi: false })
        }
      } catch {
        // Silently tolerate missing attributes and offline races.
      }
    }),
  )
}
