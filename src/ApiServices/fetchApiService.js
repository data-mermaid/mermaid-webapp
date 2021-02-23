// import { collectRecords } from './useMermaidApi'
import { useMermaidApi } from './useMermaidApi'

const fetchCollectRecord = (recordId) => {
  const { collectRecords } = useMermaidApi()

  return collectRecords.filter(({ id }) => id === recordId)
}

export { fetchCollectRecord }
