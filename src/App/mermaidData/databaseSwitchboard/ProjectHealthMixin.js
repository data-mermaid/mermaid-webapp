import axios from 'axios'
import moment from 'moment'
import language from '../../../language'
import { getRecordProtocolLabel } from '../getRecordProtocolLabel'
import { getAuthorizationHeaders } from '../../../library/getAuthorizationHeaders'

const ProjectHealthMixin = (Base) =>
  class extends Base {
    #getSiteName = function getSiteName(siteName) {
      return siteName === '__null__'
        ? language.pages.usersAndTransectsTable.missingSiteName
        : siteName
    }

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

    #groupSampleEventUnitBySite = function groupSampleEventUnitBySite(sampleEventUnitRecords) {
      return sampleEventUnitRecords.reduce((accumulator, record) => {
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
            const sampleUnitNumberLabels = protocolTransectNumbers.map(({ label }) => label)

            const sampleDates = protocolTransectNumbers.map(({ sample_date }) => sample_date)

            const sampleEventRecord = {
              site_id: siteId,
              site_name: siteName,
              method: getRecordProtocolLabel(transect),
              sample_unit_numbers: protocols[transect],
              transect_protocol: transect,
            }

            const hasDuplicateTransectNumbersInSampleUnit =
              this.#toFindDuplicates(sampleUnitNumberLabels)
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
      /* eslint max-depth: ["error", 4]*/
      /* Rule: If at least one submitted sample unit has a method, show that method in each site row.
      Example: there is only ONE sample unit submitted with the Habitat Complexity property, but it is given its own row in every site row */

      const recordGroupedBySite = this.#groupSampleEventUnitBySIte(sampleEventUnitRecords)

      for (const siteId in recordGroupedBySite) {
        if (Object.prototype.hasOwnProperty.call(recordGroupedBySite, siteId)) {
          const siteName = this.#removeDateFromName(recordGroupedBySite[siteId].site_name)

          for (const protocol of availableProtocols) {
            const protocolLabel = getRecordProtocolLabel(protocol)
            const siteAndMethodName = `${siteName} ${protocolLabel}`

            if (!recordGroupedBySite[siteId].site_names.includes(siteAndMethodName)) {
              sampleEventUnitRecords.push({
                site_id: siteId,
                site_name: siteName,
                method: protocolLabel,
                transect_protocol: protocol,
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
      const sampleEventUnitRecordsCopy = [...sampleEventUnitRecords]
      const sampleEventSiteIds = sampleEventUnitRecordsCopy.map(({ site_id }) => site_id)
      const collectingSiteIds = Object.keys(siteCollectingSummary)
      const collectingSiteIsWithoutSubmittedRecords = collectingSiteIds.filter(
        (site) => !sampleEventSiteIds.includes(site),
      )

      for (let idx = 0; idx < sampleEventUnitRecordsCopy.length; idx++) {
        const {
          site_id,
          transect_protocol,
          site_name: sampleEventSiteName,
        } = sampleEventUnitRecordsCopy[idx]
        const isSiteExist = Object.prototype.hasOwnProperty.call(siteCollectingSummary, site_id)

        sampleEventUnitRecordsCopy[idx].profile_summary = {}

        if (isSiteExist) {
          const {
            site_name: collectingSiteName,
            sample_unit_methods: collectingSiteSampleUnitMethods,
          } = siteCollectingSummary[site_id]

          if (
            sampleEventSiteName === collectingSiteName &&
            collectingSiteSampleUnitMethods[transect_protocol]
          ) {
            sampleEventUnitRecordsCopy[idx].profile_summary =
              collectingSiteSampleUnitMethods[transect_protocol].profile_summary
          }
        }
      }

      for (const siteId of collectingSiteIsWithoutSubmittedRecords) {
        for (const protocol of protocols) {
          sampleEventUnitRecordsCopy.push({
            site_id: siteId,
            site_name: this.#getSiteName(siteCollectingSummary[siteId].site_name),
            method: getRecordProtocolLabel(protocol),
            transect_protocol: protocol,
            sample_unit_numbers: [],
            profile_summary:
              siteCollectingSummary[siteId].sample_unit_methods[protocol]?.profile_summary || {},
          })
        }
      }

      return sampleEventUnitRecordsCopy
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

            const sampleEventUnitWithSubmittedAndCollectingRecords = this.#addCollectingRecords(
              sampleEventUnitRecords,
              site_collecting_summary,
              noBleachingProtocols,
            )

            return sampleEventUnitWithSubmittedAndCollectingRecords
          })
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default ProjectHealthMixin
