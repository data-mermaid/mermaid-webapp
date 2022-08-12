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
      const elementsInName = name.split(' ')

      const isDateInNames = moment(
        elementsInName[elementsInName.length - 1],
        'YYYY-MM-DD',
        true,
      ).isValid()

      if (elementsInName.length > 1) {
        if (isDateInNames) {
          // Remove the ending Date element from array
          elementsInName.pop()
        }

        return elementsInName.join(' ')
      }

      return elementsInName[0]
    }

    #getDateFromName = function getDateFromName(name) {
      const lastElementInName = name.split(' ').pop()
      const isDateInNames = moment(lastElementInName, 'YYYY-MM-DD', true).isValid()

      return isDateInNames ? lastElementInName : ''
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

    #updateProfileSummaryBySampleDate = function updateProfileSummaryBySampleDate(
      nonEmptySampleDates,
      siteCollectingSummary,
      sampleEventUnit,
    ) {
      const { site_id, transect_protocol, site_name } = sampleEventUnit
      const sampleDateExtractFromName = this.#getDateFromName(site_name)
      const collectingProfileSummary =
        siteCollectingSummary[site_id]?.sample_unit_methods?.[transect_protocol]?.profile_summary
      const updateProfileSummary = {}

      if (collectingProfileSummary) {
        for (const [profileId, profileInfo] of Object.entries(collectingProfileSummary)) {
          const labelsWithSampleDatesInSampleEvent = profileInfo.labels.filter(
            (label) => label.sample_date === sampleDateExtractFromName,
          )

          const labelsWithoutSampleDatesInSampleEvent = profileInfo.labels.filter(
            (label) => !nonEmptySampleDates.includes(label.sample_date),
          )

          if (labelsWithSampleDatesInSampleEvent.length) {
            // Fill collecting labels that has sample dates matched with any sample event's site names
            updateProfileSummary[profileId] = {
              profile_name: profileInfo.profile_name,
              labels: labelsWithSampleDatesInSampleEvent,
            }
          }

          if (sampleDateExtractFromName === '' && labelsWithoutSampleDatesInSampleEvent.length) {
            // Fill rest of collecting labels to sample event's site names that doesn't attach with any sample dates
            updateProfileSummary[profileId] = {
              profile_name: profileInfo.profile_name,
              labels: labelsWithoutSampleDatesInSampleEvent,
            }
          }
        }
      }

      return updateProfileSummary
    }

    #fillCollectRecordWithSampleDate = function fillCollectRecordWithSampleDate(
      sampleEventUnitRecords,
      siteCollectingSummary,
    ) {
      const sampleEventUnitRecordsCopy = [...sampleEventUnitRecords]
      const sampleDates = sampleEventUnitRecordsCopy.map(({ site_name }) =>
        this.#getDateFromName(site_name),
      )
      const filterNonEmptySampleDates = sampleDates.filter((date) => date !== '')

      for (const sampleEventUnit of sampleEventUnitRecordsCopy) {
        sampleEventUnit.profile_summary = this.#updateProfileSummaryBySampleDate(
          filterNonEmptySampleDates,
          siteCollectingSummary,
          sampleEventUnit,
        )
      }

      return sampleEventUnitRecordsCopy
    }

    #addCollectingRecords = function addCollectingRecords(
      sampleEventUnitRecords,
      siteCollectingSummary,
      protocols,
    ) {
      const sampleEventUnitRecordsCopy = [...sampleEventUnitRecords]
      const sampleEventSiteIds = sampleEventUnitRecordsCopy.map(({ site_id }) => site_id)
      const collectingSiteIds = Object.keys(siteCollectingSummary)
      const collectingSiteIdsWithoutSubmittedRecords = collectingSiteIds.filter(
        (site) => !sampleEventSiteIds.includes(site),
      )

      const sampleEventUnitRecordsWithCollectRecordFilled = this.#fillCollectRecordWithSampleDate(
        sampleEventUnitRecordsCopy,
        siteCollectingSummary,
      )

      // Add new sample event records without submitted records, but with collecting records
      for (const siteId of collectingSiteIdsWithoutSubmittedRecords) {
        for (const protocol of protocols) {
          sampleEventUnitRecordsWithCollectRecordFilled.push({
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

      return sampleEventUnitRecordsWithCollectRecordFilled
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
