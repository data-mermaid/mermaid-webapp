export const getPaginatedMermaidData = async ({
  url,
  authorizationHeaders,
  axios,
  errorCallback,
}) => {
  const dataItems = []
  const initialUrl = url

  const loadPaginatedDataItems = async (url) => {
    let nextPageUrl

    try {
      const response = await axios.get(url, authorizationHeaders)

      nextPageUrl = response.data.next
      dataItems.push(...(response.data.results ?? []))
    } catch (error) {
      // Must be awaited. A callback that returns a rejected promise was previously discarded here,
      // so this resolved with partial data while the rejection escaped as an unhandled rejection.
      await errorCallback(error)

      return
    }

    // Deliberately outside the try. Recursing inside it meant a failure on page N re-entered every
    // ancestor's catch, calling errorCallback N times for one failure.
    if (nextPageUrl) {
      await loadPaginatedDataItems(nextPageUrl)
    }
  }
  await loadPaginatedDataItems(initialUrl)
  return dataItems
}
