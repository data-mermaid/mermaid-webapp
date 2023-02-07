import { getObjectById } from './getObjectById'
import language from '../language'
import { getProtocolTransectType } from '../App/mermaidData/recordProtocolHelpers'

/**
 *
 * @param {Object} collectRecord - Collect record object
 * @param {Array<Site>} sites - Array of sites
 * @returns {name: string, number: number || string, label: string} Object of name, number and label for menu sub navigation node
 */

export const getRecordSubNavNodeInfo = (collectRecord, sites) => {
  const { data: recordData } = collectRecord
  const {
    protocol,
    sample_event: { site: siteId },
  } = recordData
  const protocolTransectType = getProtocolTransectType(protocol)

  const siteName = getObjectById(sites, siteId)?.name ?? language.protocolTitles[protocol]
  const transectNumber = recordData[protocolTransectType]?.number ?? ''
  const label = recordData[protocolTransectType]?.label ?? ''

  return { name: siteName, number: transectNumber, label }
}
