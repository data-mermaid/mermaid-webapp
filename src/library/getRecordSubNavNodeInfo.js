import { getObjectById } from './getObjectById'
import language from '../language'
import { getProtocolTransectType } from '../App/mermaidData/recordProtocolHelpers'

/**
 *
 * @param {Object} collectRecord - Collect record object
 * @param {Array<Site>} sites - Array of sites
 * @param {string} protocol - Name of protocol
 * @returns {name: string, number: number || string, label: string} Object of name, number and label for menu sub navigation node
 */

export const getRecordSubNavNodeInfo = (sampleUnitRecordData, sites, protocol) => {
  const {
    sample_event: { site: siteId },
  } = sampleUnitRecordData
  const protocolTransectType = getProtocolTransectType(protocol)

  const siteName = getObjectById(sites, siteId)?.name ?? language.protocolTitles[protocol]
  const transectNumber = sampleUnitRecordData[protocolTransectType]?.number ?? ''
  const label = sampleUnitRecordData[protocolTransectType]?.label ?? ''

  return { name: siteName, number: transectNumber, label }
}
