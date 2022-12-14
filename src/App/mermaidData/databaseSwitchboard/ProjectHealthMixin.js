import moment from 'moment'
import axios from '../../../library/axiosRetry'
import language from '../../../language'
import { getAuthorizationHeaders } from '../../../library/getAuthorizationHeaders'

const MISSING_SITE_NAME = '__null__'

const ProjectHealthMixin = (Base) =>
  class extends Base {
    #getSiteName = function getSiteName(siteName) {
      return siteName === MISSING_SITE_NAME
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
            ? accumulator[record.site_id].site_names.concat(
                `${record.site_name} ${record.sample_unit_method}`,
              )
            : [`${record.site_name} ${record.sample_unit_method}`],
          sample_unit_protocols: accumulator[record.site_id].sample_unit_protocols
            ? accumulator[record.site_id].sample_unit_protocols.concat(record.sample_unit_protocol)
            : [record.sample_unit_protocol],
          sample_unit_methods: accumulator[record.site_id].sample_unit_methods
            ? accumulator[record.site_id].sample_unit_methods.concat(record.sample_unit_method)
            : [record.sample_unit_method],
        }

        return accumulator
      }, {})
    }

    #addRecordsBySite = function addRecordsBySite(sampleEventUnitRecords, siteRecordGroup, siteId) {
      const [siteName, siteAvailableProtocols] = siteRecordGroup

      for (const [sampleUnit, sampleUnitNumbers] of Object.entries(siteAvailableProtocols)) {
        const sampleEventRecord = {
          site_id: siteId,
          site_name: siteName,
          sample_unit_method: language.protocolTitles[sampleUnit],
          sample_unit_numbers: sampleUnitNumbers,
          sample_unit_protocol: sampleUnit,
        }

        const sampleUnitNumberLabels = sampleUnitNumbers.map(({ label }) => label)
        const sampleDates = sampleUnitNumbers.map(({ sample_date }) => sample_date)

        const hasDuplicateTransectNumbersInSampleUnit = this.#hasDuplicates(sampleUnitNumberLabels)
        const hasMoreThanOneSampleDatesInSampleUnit = new Set(sampleDates).size > 1

        if (hasDuplicateTransectNumbersInSampleUnit && hasMoreThanOneSampleDatesInSampleUnit) {
          const sampleUnitNumbersGroupBySampleDate = Object.entries(
            this.#groupSampleUnitNumbersBySampleDate(sampleUnitNumbers),
          )

          for (const [
            sampleDate,
            sampleUnitNumbersBySampleDate,
          ] of sampleUnitNumbersGroupBySampleDate) {
            sampleEventUnitRecords.push({
              ...sampleEventRecord,
              site_name: `${siteName} ${sampleDate}`,
              sample_unit_numbers: sampleUnitNumbersBySampleDate,
            })
          }
        } else {
          sampleEventUnitRecords.push(sampleEventRecord)
        }
      }
    }

    #addRecordsToUsersAndTransects = function addRecordsToUsersAndTransects(
      sampleEventUnitRecords,
      siteSubmittedSummary,
    ) {
      for (const [siteId, siteInfo] of Object.entries(siteSubmittedSummary)) {
        const siteRecordGroup = Object.values(siteInfo)

        this.#addRecordsBySite(sampleEventUnitRecords, siteRecordGroup, siteId)
      }
    }

    #populateAdditionalRecordsForUsersAndTransects =
      function populateAdditionalRecordsForUsersAndTransects(
        sampleEventUnitRecords,
        siteCollectingSummary,
        availableProtocols,
      ) {
        /* Rule: If at least one submitted sample unit has a method, show that method in each site row.
      Example: there is only ONE sample unit submitted with the Habitat Complexity property, but it is given its own row in every site row */
        const recordGroupedBySite = Object.entries(
          this.#groupSampleEventUnitBySite(sampleEventUnitRecords),
        )

        const collectingSummaryWithNameIsNotNull = Object.entries(siteCollectingSummary).filter(
          (summary) => summary[0] !== MISSING_SITE_NAME,
        )

        const collectingSummaryMethods = collectingSummaryWithNameIsNotNull.reduce(
          (accumulator, sampleUnit) => {
            const sampleUnitMethods = Object.keys(sampleUnit[1].sample_unit_methods).map(
              (method) => language.protocolTitles[method],
            )

            accumulator[sampleUnit[0]] = accumulator[sampleUnit[0]] || []
            accumulator[sampleUnit[0]] = sampleUnitMethods

            return accumulator
          },
          {},
        )

        for (const [siteId, siteInfo] of recordGroupedBySite) {
          const siteName = this.#removeDateFromName(siteInfo.site_name)
          const siteCollectingMethods = collectingSummaryMethods[siteId]

          for (const protocol of availableProtocols) {
            const protocolLabel = language.protocolTitles[protocol]
            const siteAndMethodName = `${siteName} ${protocolLabel}`
            const hasCollectingMethod =
              siteCollectingMethods && siteCollectingMethods.includes(protocolLabel)

            if (
              (!siteInfo.site_names.includes(siteAndMethodName) && hasCollectingMethod) ||
              !siteInfo.sample_unit_methods.includes(protocolLabel)
            ) {
              sampleEventUnitRecords.push({
                site_id: siteId,
                site_name: siteName,
                sample_unit_method: protocolLabel,
                sample_unit_protocol: protocol,
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
      const { site_id, sample_unit_protocol, site_name } = sampleEventUnit
      const sampleDateExtractFromName = this.#getDateFromName(site_name)
      const collectingProfileSummary =
        siteCollectingSummary[site_id]?.sample_unit_methods?.[sample_unit_protocol]?.profile_summary
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
        const { site_name, sample_unit_methods } = siteCollectingSummary[siteId]
        const newSampleEventUnitRecords = {
          site_id: siteId,
          site_name: this.#getSiteName(site_name),
          sample_unit_numbers: [],
        }

        if (site_name === MISSING_SITE_NAME) {
          // Don't create empty method rows when site name is missing
          for (const [missingSiteNameProtocol, missingSiteNameProtocolInfo] of Object.entries(
            sample_unit_methods,
          )) {
            sampleEventUnitRecordsWithCollectRecordFilled.push({
              ...newSampleEventUnitRecords,
              sample_unit_protocol: missingSiteNameProtocol,
              sample_unit_method: language.protocolTitles[missingSiteNameProtocol],
              profile_summary: missingSiteNameProtocolInfo.profile_summary,
            })
          }
        } else {
          for (const protocol of protocols) {
            sampleEventUnitRecordsWithCollectRecordFilled.push({
              ...newSampleEventUnitRecords,
              sample_unit_protocol: protocol,
              sample_unit_method: language.protocolTitles[protocol],
              profile_summary: sample_unit_methods[protocol]?.profile_summary || {},
            })
          }
        }
      }

      return sampleEventUnitRecordsWithCollectRecordFilled
    }

    #addRecordsToManagementRegimesOverview = function addRecordsToManagementRegimesOverview(
      sampleEventUnitRecords,
      siteSubmittedSummary,
    ) {
      for (const [siteId, siteInfo] of Object.entries(siteSubmittedSummary)) {
        const siteName = siteInfo.site_name
        const { bleachingqc, ...otherProtocols } = siteInfo.sample_unit_methods // eslint-disable-line no-unused-vars

        for (const [sampleUnit, sampleUnitNumbers] of Object.entries(otherProtocols)) {
          const managements = sampleUnitNumbers.reduce((accumulator, item) => {
            accumulator[item.management.id] = accumulator[item.management.id] || {}
            accumulator[item.management.id] = {
              mr_name: item.management.name,
              mr_id: item.management.id,
              labels: accumulator[item.management.id].labels
                ? accumulator[item.management.id].labels.concat({
                    label: item.label,
                    id: item.id,
                  })
                : [{ label: item.label, id: item.id }],
            }

            return accumulator
          }, {})

          const sampleEventRecord = {
            site_id: siteId,
            site_name: siteName,
            sample_unit_method: language.protocolTitles[sampleUnit],
            sample_unit_protocol: sampleUnit,
            management_regimes: Object.values(managements),
          }

          sampleEventUnitRecords.push(sampleEventRecord)
        }
      }
    }

    #populateAdditionalRecordsForManagementRegimesOverview =
      function populateAdditionalRecordsForManagementRegimesOverview(
        sampleEventUnitRecords,
        availableProtocols,
      ) {
        const recordGroupedBySite = Object.entries(
          this.#groupSampleEventUnitBySite(sampleEventUnitRecords),
        )

        for (const [siteId, siteInfo] of recordGroupedBySite) {
          const siteName = this.#removeDateFromName(siteInfo.site_name)

          for (const protocol of availableProtocols) {
            const protocolLabel = language.protocolTitles[protocol]
            const siteAndMethodName = `${siteName} ${protocolLabel}`

            if (!siteInfo.site_names.includes(siteAndMethodName)) {
              sampleEventUnitRecords.push({
                site_id: siteId,
                site_name: siteName,
                sample_unit_method: protocolLabel,
                sample_unit_protocol: protocol,
                management_regimes: [],
              })
            }
          }
        }
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

            this.#addRecordsToUsersAndTransects(sampleEventUnitRecords, siteSubmittedSummary)

            this.#populateAdditionalRecordsForUsersAndTransects(
              sampleEventUnitRecords,
              siteCollectingSummary,
              protocols,
            )

            const sampleEventUnitWithSubmittedAndCollectingRecords = this.#addCollectingRecords(
              sampleEventUnitRecords,
              siteCollectingSummary,
              protocols,
            )

            return sampleEventUnitWithSubmittedAndCollectingRecords
          })
        : Promise.reject(this._notAuthenticatedAndReadyError)
    }

    getRecordsForManagementRegimesOverviewTable =
      function getRecordsForManagementRegimesOverviewTable(projectId) {
        if (!projectId) {
          Promise.reject(this._operationMissingParameterError)
        }

        return this._isAuthenticatedAndReady
          ? this.getSampleUnitSummary(projectId).then((sampleUnitRecords) => {
              const sampleEventUnitRecords = []
              const { site_submitted_summary: siteSubmittedSummary } = sampleUnitRecords

              this.#addRecordsToManagementRegimesOverview(
                sampleEventUnitRecords,
                siteSubmittedSummary,
              )

              const sampleEventUnitRecordsCopy = [...sampleEventUnitRecords]

              const availableProtocols = [
                ...new Set(
                  sampleEventUnitRecordsCopy.map(
                    ({ sample_unit_protocol }) => sample_unit_protocol,
                  ),
                ),
              ]

              this.#populateAdditionalRecordsForManagementRegimesOverview(
                sampleEventUnitRecords,
                availableProtocols,
              )

              return sampleEventUnitRecords
            })
          : Promise.reject(this._operationMissingParameterError)
      }
  }

export default ProjectHealthMixin
