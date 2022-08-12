import axios from 'axios'
import moment from 'moment'
import language from '../../../language'
import { getRecordSampleUnitMethod } from '../recordProtocolHelpers'
import { getAuthorizationHeaders } from '../../../library/getAuthorizationHeaders'

const ProjectHealthMixin = (Base) =>
  class extends Base {
    #getSiteName = function getSiteName(siteName) {
      return siteName === '__null__'
        ? language.pages.usersAndTransectsTable.missingSiteName
        : siteName
    }

    #hasDuplicates = function hasDuplicates(array) {
      return new Set(array).size !== array.length
    }

    #removeDateFromName = function removeDateFromName(name) {
      const names = name.split(' ')
      const isDateInNames = moment(names[names.length - 1], 'YYYY-MM-DD', true).isValid()

      if (names.length > 1) {
        if (isDateInNames) {
          // Remove the ending Date element from array
          names.splice(-1, 1)
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
          site_id: record.site_id,
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

    #addRecordsToSites = function addRecordsToSites(sampleEventUnitRecords, siteSubmittedSummary) {
      for (const site of Object.entries(siteSubmittedSummary)) {
        const siteId = site[0]
        const siteRecordGroup = Object.values(site[1])

        this.#addRecordsBySite(sampleEventUnitRecords, siteRecordGroup, siteId)
      }
    }

    #addRecordsBySite = function addRecordsBySite(sampleEventUnitRecords, siteRecordGroup, siteId) {
      const siteName = siteRecordGroup[0]
      const { bleachingqc, ...otherProtocols } = siteRecordGroup[1] // eslint-disable-line no-unused-vars

      for (const transect of Object.entries(otherProtocols)) {
        const transectMethod = transect[0]
        const transectNumbers = transect[1]

        const sampleEventRecord = {
          site_id: siteId,
          site_name: siteName,
          method: getRecordSampleUnitMethod(transectMethod),
          sample_unit_numbers: transectNumbers,
          transect_protocol: transectMethod,
        }

        const sampleUnitNumberLabels = transectNumbers.map(({ label }) => label)
        const sampleDates = transectNumbers.map(({ sample_date }) => sample_date)

        const hasDuplicateTransectNumbersInSampleUnit = this.#hasDuplicates(sampleUnitNumberLabels)
        const hasMoreThanOneSampleDatesInSampleUnit = new Set(sampleDates).size > 1

        if (hasDuplicateTransectNumbersInSampleUnit && hasMoreThanOneSampleDatesInSampleUnit) {
          const sampleUnitNumbersGroup = Object.entries(
            this.#groupSampleUnitNumbersBySampleDate(transectNumbers),
          )

          for (const sampleUnit of sampleUnitNumbersGroup) {
            const sampleDate = sampleUnit[0]
            const sampleUnitNumbers = sampleUnit[1]

            sampleEventUnitRecords.push({
              ...sampleEventRecord,
              site_name: `${siteName} ${sampleDate}`,
              sample_unit_numbers: sampleUnitNumbers,
            })
          }
        } else {
          sampleEventUnitRecords.push(sampleEventRecord)
        }
      }
    }

    #populateAdditionalRecords = function populateAdditionalRecords(
      sampleEventUnitRecords,
      availableProtocols,
      siteCollectingSummary,
    ) {
      /* Rule: If at least one submitted sample unit has a method, show that method in each site row.
      Example: there is only ONE sample unit submitted with the Habitat Complexity property, but it is given its own row in every site row */
      const recordGroupedBySite = Object.entries(
        this.#groupSampleEventUnitBySite(sampleEventUnitRecords),
      )

      const collectingSummaryWithNameIsNotNull = Object.entries(siteCollectingSummary).filter(
        (summary) => summary[0] !== '__null__',
      )

      const collectingSummaryMethods = collectingSummaryWithNameIsNotNull.reduce(
        (accumulator, sampleUnit) => {
          const sampleUnitMethods = Object.keys(sampleUnit[1].sample_unit_methods).map((method) =>
            getRecordSampleUnitMethod(method),
          )

          accumulator[sampleUnit[0]] = accumulator[sampleUnit[0]] || []
          accumulator[sampleUnit[0]] = sampleUnitMethods

          return accumulator
        },
        {},
      )

      for (const site of recordGroupedBySite) {
        const siteId = site[0]
        const siteInfo = site[1]

        const siteName = this.#removeDateFromName(siteInfo.site_name)
        const siteCollectingMethods = collectingSummaryMethods[siteId]

        for (const protocol of availableProtocols) {
          const protocolLabel = getRecordSampleUnitMethod(protocol)
          const siteAndMethodName = `${siteName} ${protocolLabel}`
          const hasCollectingMethod =
            siteCollectingMethods && siteCollectingMethods.includes(protocolLabel)

          if (
            (!siteInfo.site_names.includes(siteAndMethodName) && hasCollectingMethod) ||
            !siteInfo.methods.includes(protocolLabel)
          ) {
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
            method: getRecordSampleUnitMethod(protocol),
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
            const {
              site_submitted_summary: siteSubmittedSummary,
              site_collecting_summary: siteCollectingSummary,
              protocols,
            } = sampleUnitRecords
            const noBleachingProtocols = protocols.filter((protocol) => protocol !== 'bleachingqc')

            this.#addRecordsToSites(sampleEventUnitRecords, siteSubmittedSummary)

            this.#populateAdditionalRecords(
              sampleEventUnitRecords,
              noBleachingProtocols,
              siteCollectingSummary,
            )

            const sampleEventUnitWithSubmittedAndCollectingRecords = this.#addCollectingRecords(
              sampleEventUnitRecords,
              siteCollectingSummary,
              noBleachingProtocols,
            )

            return sampleEventUnitWithSubmittedAndCollectingRecords
          })
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }
  }

export default ProjectHealthMixin
