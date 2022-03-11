import { getObjectById } from './getObjectById'

const transectDefaultName = { fishbelt_transect: 'Fish Belt' }

export const getRecordName = (recordData, sites, transect_type) => {
  const recordSiteId = recordData?.sample_event?.site
  const siteName = getObjectById(sites, recordSiteId)?.name ?? transectDefaultName[transect_type]
  const transectNumber = recordData[transect_type]?.number ?? ''
  const label = recordData[transect_type]?.label ?? ''

  return { name: siteName, number: transectNumber, label }
}
