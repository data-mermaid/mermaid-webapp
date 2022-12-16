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

    #addSubmittedRecordsToSampleEventUnitRecord =
      function addSubmittedRecordsToSampleEventUnitRecord(
        sampleEventUnitRecords,
        siteRecordGroup,
        siteId,
      ) {
        const [siteName, siteAvailableProtocols] = siteRecordGroup

        for (const [sampleUnit, sampleUnitNumbers] of Object.entries(siteAvailableProtocols)) {
          const sampleEventUnitRecord = {
            site_id: siteId,
            site_name: siteName,
            sample_date: '',
            sample_unit_method: language.protocolTitles[sampleUnit],
            sample_unit_numbers: sampleUnitNumbers,
            sample_unit_protocol: sampleUnit,
          }

          const sampleUnitNumberLabels = sampleUnitNumbers.map(({ label }) => label)
          const sampleDates = sampleUnitNumbers.map(({ sample_date }) => sample_date)

          const hasDuplicateTransectNumbersInSampleUnit =
            this.#hasDuplicates(sampleUnitNumberLabels)
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
                ...sampleEventUnitRecord,
                sample_date: sampleDate,
                sample_unit_numbers: sampleUnitNumbersBySampleDate,
              })
            }
          } else {
            sampleEventUnitRecords.push(sampleEventUnitRecord)
          }
        }
      }

    #addSubmittedRecordsToUsersAndTransects = function addSubmittedRecordsToUsersAndTransects(
      sampleEventUnitRecords,
      siteSubmittedSummary,
    ) {
      const sampleEventUnitRecordsCopy = [...sampleEventUnitRecords]

      for (const [siteId, siteInfo] of Object.entries(siteSubmittedSummary)) {
        const siteRecordGroup = Object.values(siteInfo)

        this.#addSubmittedRecordsToSampleEventUnitRecord(
          sampleEventUnitRecordsCopy,
          siteRecordGroup,
          siteId,
        )
      }

      return sampleEventUnitRecordsCopy
    }

    #populateAdditionalRecordsForUsersAndTransects =
      function populateAdditionalRecordsForUsersAndTransects(
        sampleEventUnitRecords,
        siteCollectingSummary,
        availableProtocols,
      ) {
        /* Rule: If at least one submitted sample unit has a method, show that method in each site row.
      Example: there is only ONE sample unit submitted with the Habitat Complexity property, but it is given its own row in every site row */
        const sampleEventUnitRecordsCopy = [...sampleEventUnitRecords]

        const recordGroupedBySite = Object.entries(
          this.#groupSampleEventUnitBySite(sampleEventUnitRecordsCopy),
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
          const siteName = siteInfo.site_name
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
              sampleEventUnitRecordsCopy.push({
                site_id: siteId,
                site_name: siteName,
                sample_date: '',
                sample_unit_method: protocolLabel,
                sample_unit_protocol: protocol,
                sample_unit_numbers: [],
              })
            }
          }
        }

        return sampleEventUnitRecordsCopy
      }

    #getFilteredSampleEventUnitRecords = function getFilteredSampleEventUnitRecords(
      sampleEventUnitRecords,
      siteId,
    ) {
      return sampleEventUnitRecords.filter(({ site_id }) => site_id === siteId)
    }

    #updateProfileSummary = function updateProfileSummary(
      filteredSampleEventUnitRecords,
      sampleEventUnitSampleDate,
      collectingProfileSummary,
    ) {
      const sampleUnitProfileSummary = {}

      if (collectingProfileSummary) {
        for (const [profileId, profileInfo] of Object.entries(collectingProfileSummary)) {
          const labelsWithSampleDatesInSampleEvent = profileInfo.labels.filter(
            (label) =>
              sampleEventUnitSampleDate !== '' && label.sample_date === sampleEventUnitSampleDate,
          )

          const specialLabels = profileInfo.labels.filter(
            (label) =>
              sampleEventUnitSampleDate === '' &&
              !filteredSampleEventUnitRecords.includes(label.sample_date),
          )

          if (labelsWithSampleDatesInSampleEvent.length) {
            sampleUnitProfileSummary[profileId] = {
              profile_name: profileInfo.profile_name,
              labels: labelsWithSampleDatesInSampleEvent,
            }
          }

          if (specialLabels.length) {
            sampleUnitProfileSummary[profileId] = {
              profile_name: profileInfo.profile_name,
              labels: specialLabels,
            }
          }
        }
      }

      return sampleUnitProfileSummary
    }

    #fillCollectRecordsWithSampleDates = function fillCollectRecordsWithSampleDates(
      sampleEventUnitRecords,
      siteCollectingSummary,
    ) {
      const sampleEventUnitRecordsCopy = [...sampleEventUnitRecords]

      for (const sampleEventUnit of sampleEventUnitRecordsCopy) {
        const { site_id, sample_unit_protocol, sample_date } = sampleEventUnit

        const filteredSampleEventUnitRecordsBySiteId = this.#getFilteredSampleEventUnitRecords(
          sampleEventUnitRecordsCopy,
          site_id,
        )
          .filter((filteredRecords) => filteredRecords.sample_date !== '')
          .map((record) => record.sample_date)

        const collectingProfileSummary =
          siteCollectingSummary[site_id]?.sample_unit_methods?.[sample_unit_protocol]
            ?.profile_summary

        const updatedSampleEventUnitProfileSummary = this.#updateProfileSummary(
          filteredSampleEventUnitRecordsBySiteId,
          sample_date,
          collectingProfileSummary,
        )

        sampleEventUnit.profile_summary = updatedSampleEventUnitProfileSummary
      }

      return sampleEventUnitRecordsCopy
    }

    #createAdditionalSampleEventUnitRecords = function createAdditionalSampleEventUnitRecords(
      sampleEventUnitRecords,
      siteCollectingSummary,
    ) {
      /* Rule: check collecting summary profile records.
        If records with empty sample date or different sample date from shown sample dates in any sample event unit records,
        create new sample event unit record to contain the collecting records
      */
      const sampleEventUnitRecordsCopy = [...sampleEventUnitRecords]

      for (const [siteId, siteProfile] of Object.entries(siteCollectingSummary)) {
        const { sample_unit_methods, site_name } = siteProfile

        const filteredSampleEventUnitRecordsBySiteId = this.#getFilteredSampleEventUnitRecords(
          sampleEventUnitRecordsCopy,
          siteId,
        )

        for (const [protocol, protocolInfo] of Object.entries(sample_unit_methods)) {
          const profileSummaryLabels = []
          const protocolProfileSummary = protocolInfo.profile_summary

          const filteredProtocolProfileSampleDates = filteredSampleEventUnitRecordsBySiteId
            .filter(({ sample_unit_protocol }) => sample_unit_protocol === protocol)
            .map(({ sample_date }) => sample_date)

          for (const profile of Object.values(protocolProfileSummary)) {
            profileSummaryLabels.push(...profile.labels)
          }

          const profileSummaryLabelSampleDates = profileSummaryLabels.map(
            ({ sample_date }) => sample_date,
          )

          const sampleDatesNotInAnySampleEventUnitRecords = profileSummaryLabelSampleDates.filter(
            (date) => !filteredProtocolProfileSampleDates.includes(date),
          )

          if (
            !filteredProtocolProfileSampleDates.includes('') &&
            sampleDatesNotInAnySampleEventUnitRecords.length > 0 &&
            site_name !== MISSING_SITE_NAME
          ) {
            sampleEventUnitRecordsCopy.push({
              site_id: siteId,
              site_name,
              sample_date: '',
              sample_unit_numbers: [],
              sample_unit_protocol: protocol,
              sample_unit_method: language.protocolTitles[protocol],
              profile_summary: {},
            })
          }
        }
      }

      return sampleEventUnitRecordsCopy
    }

    #addCollectingRecordsToUsersAndTransects = function addCollectingRecordsToUsersAndTransects(
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

      const sampleEventUnitRecordsExtra = this.#createAdditionalSampleEventUnitRecords(
        sampleEventUnitRecordsCopy,
        siteCollectingSummary,
      )

      const sampleEventUnitRecordsWithCollectRecordFilled = this.#fillCollectRecordsWithSampleDates(
        sampleEventUnitRecordsExtra,
        siteCollectingSummary,
      )

      for (const siteId of collectingSiteIdsWithoutSubmittedRecords) {
        const { site_name, sample_unit_methods } = siteCollectingSummary[siteId]
        const sampleEventUnitRecord = {
          site_id: siteId,
          site_name: this.#getSiteName(site_name),
          sample_date: '',
          sample_unit_numbers: [],
        }

        if (site_name === MISSING_SITE_NAME) {
          // Don't create empty method rows when site name is missing
          for (const [missingSiteNameProtocol, missingSiteNameProtocolInfo] of Object.entries(
            sample_unit_methods,
          )) {
            sampleEventUnitRecordsWithCollectRecordFilled.push({
              ...sampleEventUnitRecord,
              sample_unit_protocol: missingSiteNameProtocol,
              sample_unit_method: language.protocolTitles[missingSiteNameProtocol],
              profile_summary: missingSiteNameProtocolInfo.profile_summary,
            })
          }
        } else {
          for (const protocol of protocols) {
            sampleEventUnitRecordsWithCollectRecordFilled.push({
              ...sampleEventUnitRecord,
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
          const siteName = siteInfo.site_name

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

            const initialSampleEventUnitRecords = this.#addSubmittedRecordsToUsersAndTransects(
              sampleEventUnitRecords,
              siteSubmittedSummary,
            )

            const sampleEventUnitRecordsWithAdditionalProtocolRecords =
              this.#populateAdditionalRecordsForUsersAndTransects(
                initialSampleEventUnitRecords,
                siteCollectingSummary,
                protocols,
              )

            const sampleEventUnitWithSubmittedAndCollectingRecords =
              this.#addCollectingRecordsToUsersAndTransects(
                sampleEventUnitRecordsWithAdditionalProtocolRecords,
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
