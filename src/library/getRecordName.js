import { getObjectById } from './getObjectById'

const transectDefaultName = { fishbelt_transect: 'Fish Belt' }

/**
 *
 * @param {string} recordData
 * @param {Array<Site>} sites
 * @param {string} transectType
 * @returns {name: string, number: number || string, label: string}
 */

export const getRecordName = (recordData, sites, transectType) => {
  const recordSiteId = recordData?.sample_event?.site
  const siteName = getObjectById(sites, recordSiteId)?.name ?? transectDefaultName[transectType]
  const transectNumber = recordData[transectType]?.number ?? ''
  const label = recordData[transectType]?.label ?? ''

  return { name: siteName, number: transectNumber, label }
}
