import { getObjectById } from './getObjectById'
import language from '../language'

/**
 *
 * @param {string} recordData
 * @param {Array<Site>} sites
 * @param {string} sampleUnit
 * @returns {name: string, number: number || string, label: string}
 */

export const getRecordSubNavNodeInfo = (recordData, sites, sampleUnit) => {
  const recordSiteId = recordData?.sample_event?.site
  const siteName =
    getObjectById(sites, recordSiteId)?.name ?? language.protocolTitles[recordData.protocol]
  const transectNumber = recordData[sampleUnit]?.number ?? ''
  const label = recordData[sampleUnit]?.label ?? ''

  return { name: siteName, number: transectNumber, label }
}
