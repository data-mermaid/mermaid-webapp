import { getObjectById } from './getObjectById'

const transectDefaultName = { fishbelt_transect: 'Fish Belt' }

/**
 *
 * @param {string} recordData
 * @param {Array<Site>} sites
 * @param {string} sampleUnit
 * @returns {name: string, number: number || string, label: string}
 */

export const getRecordName = (recordData, sites, sampleUnit) => {
  const recordSiteId = recordData?.sample_event?.site
  const siteName = getObjectById(sites, recordSiteId)?.name ?? transectDefaultName[sampleUnit]
  const transectNumber = recordData[sampleUnit]?.number ?? ''
  const label = recordData[sampleUnit]?.label ?? ''

  return { name: siteName, number: transectNumber, label }
}
