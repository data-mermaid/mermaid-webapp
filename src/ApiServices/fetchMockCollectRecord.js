// import { collectRecords } from './useMermaidApi'
import { useMermaidApi } from './useMermaidApi'

export const fetchMockCollectRecord = (recordId) => {
  const { collectRecords } = useMermaidApi()

  return collectRecords.filter(({ id }) => id === recordId)
}
