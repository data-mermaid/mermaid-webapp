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
      let response

      try {
        response = await axios.get(detailUrlById(id), await getAuthorizationHeaders(getAccessToken))
      } catch {
        // Tolerate network failures and offline races — the attribute name will
        // just render blank rather than breaking the page load.
        return
      }

      if (response?.data) {
        try {
          await dexieTable.put({ ...response.data, uiState_pushToApi: false })
        } catch (writeError) {
          // Tolerate write failures (e.g. storage quota exceeded, schema mismatch).
          // The fetch succeeded, so the page can still render; the attribute simply
          // won't be cached for next time.
          console.warn('ensureAttributesLoaded: failed to cache attribute', id, writeError)
        }
      }
    }),
  )
}
