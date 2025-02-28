export const getPaginatedMermaidData = async ({
  url,
  authorizationHeaders,
  axios,
  errorCallback,
}) => {
  const dataItems = []
  const initialUrl = url

  const loadPaginatedDataItems = async (url) => {
    try {
      const response = await axios.get(url, authorizationHeaders)
      const paginatedDataItems = response.data.results
      const nextPageUrl = response.data.next
      dataItems.push(...paginatedDataItems)

      if (nextPageUrl) {
        await loadPaginatedDataItems(response.data.next)
      }
    } catch (error) {
      errorCallback(error)
    }
  }
  await loadPaginatedDataItems(initialUrl)
  return dataItems
}
