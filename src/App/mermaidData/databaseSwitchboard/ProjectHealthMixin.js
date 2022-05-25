import axios from 'axios'
import moment from 'moment'
import { getRecordProtocolLabel } from '../getRecordProtocolLabel'
import { getAuthorizationHeaders } from '../../../library/getAuthorizationHeaders'

const ProjectHealthMixin = (Base) =>
  class extends Base {
    #toFindDuplicates = function toFindDuplicates(array) {
      return new Set(array).size !== array.length
    }

    #removeDateFromName = function removeDateFromName(name) {
      const names = name.split(' ')
      const isDateInNames = moment(names[names.length - 1], 'YYYY-MM-DD', true).isValid()

      if (names.length > 1) {
        if (isDateInNames) {
          names.splice(-1, 1)

          return names[0]
        }

        return names.join(' ')
      }

      return names[0]
    }

    #groupSampleUnitNumbersBySampleDate = function groupSampleUnitNumbersBySampleDate(
      sampleUnitNumbers,
    ) {
      return sampleUnitNumbers.reduce((accumulator, sampleUnit) => {
        accumulator[sampleUnit.sample_date] = accumulator[sampleUnit.sample_date] || []
        accumulator[sampleUnit.sample_date].push(sampleUnit)

        return accumulator
      }, {})
    }

    #updateAndAddRecords = function updateAndAddRecords(
      sampleEventUnitRecords,
      siteRecordGroup,
      siteId,
    ) {
      /* eslint-disable max-depth */
      const siteName = siteRecordGroup[0]
      const protocols = siteRecordGroup[1]

      for (const transect in protocols) {
        if (Object.prototype.hasOwnProperty.call(protocols, transect)) {
          if (transect !== 'bleachingqc') {
            const protocolTransectNumbers = protocols[transect]
            const sampleUnitNumbers = protocolTransectNumbers.map(
              ({ sample_unit_number }) => sample_unit_number,
            )
            const sampleDates = protocolTransectNumbers.map(({ sample_date }) => sample_date)

            const sampleEventRecord = {
              site_id: siteId,
              site_name: siteName,
              method: getRecordProtocolLabel(transect),
              sample_unit_numbers: protocols[transect],
              transect_protocol: transect,
            }

            const hasDuplicateTransectNumbersInSampleUnit =
              this.#toFindDuplicates(sampleUnitNumbers)
            const hasMoreThanOneSampleDatesInSampleUnit = new Set(sampleDates).size > 1

            if (hasDuplicateTransectNumbersInSampleUnit && hasMoreThanOneSampleDatesInSampleUnit) {
              const sampleUnitNumbersGroup =
                this.#groupSampleUnitNumbersBySampleDate(protocolTransectNumbers)

              for (const sampleDateUnit in sampleUnitNumbersGroup) {
                if (Object.prototype.hasOwnProperty.call(sampleUnitNumbersGroup, sampleDateUnit)) {
                  sampleEventUnitRecords.push({
                    ...sampleEventRecord,
                    site_name: `${siteName} ${sampleDateUnit}`,
                    sample_unit_numbers: sampleUnitNumbersGroup[sampleDateUnit],
                  })
                }
              }
            } else {
              sampleEventUnitRecords.push(sampleEventRecord)
            }
          }
        }
      }
    }

    #populateAdditionalRecords = function populateAdditionalRecords(
      sampleEventUnitRecords,
      availableProtocols,
    ) {
      /* Rule: If at least one submitted sample unit has a method, show that method in each site row.
      Example: there is only ONE sample unit submitted with the Habitat Complexity property, but it is given its own row in every site row */
      const uniqueTransectAndMethods = availableProtocols.map((method) => {
        return {
          method,
          protocol: getRecordProtocolLabel(method),
        }
      })

      const recordGroupedBySite = sampleEventUnitRecords.reduce((accumulator, record) => {
        accumulator[record.site_id] = accumulator[record.site_id] || {}
        accumulator[record.site_id] = {
          site_name: record.site_name,
          site_names: accumulator[record.site_id].site_names
            ? accumulator[record.site_id].site_names.concat(`${record.site_name} ${record.method}`)
            : [`${record.site_name} ${record.method}`],
          transects: accumulator[record.site_id].transects
            ? accumulator[record.site_id].transects.concat(record.transect_protocol)
            : [record.transect_protocol],
          methods: accumulator[record.site_id].methods
            ? accumulator[record.site_id].methods.concat(record.method)
            : [record.method],
        }

        return accumulator
      }, {})

      for (const siteId in recordGroupedBySite) {
        if (Object.prototype.hasOwnProperty.call(recordGroupedBySite, siteId)) {
          const siteName = this.#removeDateFromName(recordGroupedBySite[siteId].site_name)
          /* eslint max-depth: ["error", 4]*/

          for (const missingTransect of uniqueTransectAndMethods) {
            const missingTransectName = `${siteName} ${missingTransect.protocol}`

            if (!recordGroupedBySite[siteId].site_names.includes(missingTransectName)) {
              sampleEventUnitRecords.push({
                site_id: siteId,
                site_name: siteName,
                method: missingTransect.protocol,
                transect_protocol: missingTransect.method,
                sample_unit_numbers: [],
              })
            }
          }
        }
      }

      return sampleEventUnitRecords
    }

    #addCollectingRecords = function addCollectingRecords(
      sampleEventUnitRecords,
      siteCollectingSummary,
      protocols,
    ) {
      const newSampleEvents = sampleEventUnitRecords
      const allSites = newSampleEvents.map(({ site_id }) => site_id)
      const collectingSites = Object.keys(siteCollectingSummary)
      const collectingSitesWithoutSubmittedRecords = collectingSites.filter(
        (site) => !allSites.includes(site),
      )

      for (let idx = 0; idx < newSampleEvents.length; idx++) {
        const sampleEventSiteId = newSampleEvents[idx].site_id

        newSampleEvents[idx].profile_summary = {}
        const isSiteExist = Object.prototype.hasOwnProperty.call(
          siteCollectingSummary,
          sampleEventSiteId,
        )

        if (isSiteExist) {
          const collectingSiteName = siteCollectingSummary[sampleEventSiteId].site_name
          const collectingSiteSampleUnitMethods =
            siteCollectingSummary[sampleEventSiteId].sample_unit_methods

          const sameSiteName = newSampleEvents[idx].site_name === collectingSiteName

          if (
            sameSiteName &&
            collectingSiteSampleUnitMethods[newSampleEvents[idx].transect_protocol]
          ) {
            newSampleEvents[idx].profile_summary =
              collectingSiteSampleUnitMethods[
                newSampleEvents[idx].transect_protocol
              ].profile_summary
          }
        }
      }
      for (const siteId of collectingSitesWithoutSubmittedRecords) {
        for (const protocol of protocols) {
          newSampleEvents.push({
            site_id: siteId,
            site_name: siteCollectingSummary[siteId].site_name,
            method: getRecordProtocolLabel(protocol),
            transect_protocol: protocol,
            sample_unit_numbers: [],
            profile_summary:
              siteCollectingSummary[siteId].sample_unit_methods[protocol]?.profile_summary || {},
          })
        }
      }

      return newSampleEvents
    }

    getSampleUnitSummary = async function getSampleUnitSummary(projectId) {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isOnlineAuthenticatedAndReady
        ? axios
            .get(
              `${this._apiBaseUrl}/projects/${projectId}/summary`,
              await getAuthorizationHeaders(this._getAccessToken),
            )
            .then((apiResults) => apiResults.data)
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getRecordsForUsersAndTransectsTable = function getRecordsForUsersAndTransectsTable(projectId) {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isAuthenticatedAndReady
        ? this.getSampleUnitSummary(projectId).then((sampleUnitRecords) => {
            const sampleEventUnitRecords = []

            const { site_submitted_summary, site_collecting_summary, protocols } = sampleUnitRecords
            const noBleachingProtocols = protocols.filter((protocol) => protocol !== 'bleachingqc')

            for (const siteId in site_submitted_summary) {
              if (Object.prototype.hasOwnProperty.call(site_submitted_summary, siteId)) {
                const siteRecordGroup = Object.values(site_submitted_summary[siteId])

                this.#updateAndAddRecords(sampleEventUnitRecords, siteRecordGroup, siteId)
              }
            }
            this.#populateAdditionalRecords(sampleEventUnitRecords, noBleachingProtocols)

            const submittedAndCollectRecords = this.#addCollectingRecords(
              sampleEventUnitRecords,
              site_collecting_summary,
              noBleachingProtocols,
            )

            return submittedAndCollectRecords
          })
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default ProjectHealthMixin
