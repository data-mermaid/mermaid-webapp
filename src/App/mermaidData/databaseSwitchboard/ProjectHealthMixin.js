import moment from 'moment'
import axios from '../../../library/axiosRetry'
import i18next from '../../../../i18n'
import language from '../../../language'
import { getAuthorizationHeaders } from '../../../library/getAuthorizationHeaders'
import { API_NULL_NAME } from '../../../library/constants/constants'

const ProjectHealthMixin = (Base) =>
  class extends Base {
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

    #groupSampleUnitNumbersBySampleDate = function groupSampleUnitNumbersBySampleDate(
      sampleUnitNumbers,
    ) {
      return sampleUnitNumbers.reduce((accumulator, sampleUnit) => {
        accumulator[sampleUnit.sample_date] = accumulator[sampleUnit.sample_date] || []
        accumulator[sampleUnit.sample_date].push(sampleUnit)

        return accumulator
      }, {})
    }

    #groupSampleEventUnitBySite = function groupSampleEventUnitBySite(sampleEventUnitRows) {
      return sampleEventUnitRows.reduce((accumulator, record) => {
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

    #addSubmittedRecordsToSampleEventUnitRow = function addSubmittedRecordsToSampleEventUnitRow(
      sampleEventUnitRows,
      siteRecordGroup,
      siteId,
    ) {
      const [siteName, siteAvailableProtocols] = siteRecordGroup

      for (const [sampleUnit, sampleUnitNumbers] of Object.entries(siteAvailableProtocols)) {
        const sampleEventUnitRow = {
          site_id: siteId,
          site_name: siteName,
          sample_date: '',
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
            sampleEventUnitRows.push({
              ...sampleEventUnitRow,
              site_name: `${siteName} ${sampleDate}`,
              sample_date: sampleDate,
              sample_unit_numbers: sampleUnitNumbersBySampleDate,
            })
          }
        } else {
          sampleEventUnitRows.push(sampleEventUnitRow)
        }
      }
    }

    #addSubmittedRecordsToUsersAndTransects = function addSubmittedRecordsToUsersAndTransects(
      sampleEventUnitRows,
      siteSubmittedSummary,
    ) {
      const sampleEventUnitRowsCopy = [...sampleEventUnitRows]

      for (const [siteId, siteInfo] of Object.entries(siteSubmittedSummary)) {
        const siteRecordGroup = Object.values(siteInfo)

        this.#addSubmittedRecordsToSampleEventUnitRow(
          sampleEventUnitRowsCopy,
          siteRecordGroup,
          siteId,
        )
      }

      return sampleEventUnitRowsCopy
    }

    #populateAdditionalProtocolRowsForUsersAndTransects =
      function populateAdditionalProtocolRowsForUsersAndTransects(
        sampleEventUnitRows,
        siteCollectingSummary,
        availableProtocols,
      ) {
        /* Rule: If at least one submitted sample unit has a method, show that method in each site row.
           Example: there is only ONE sample unit submitted with the Habitat Complexity property, but it is given its own row in every site row */
        const sampleEventUnitRowsCopy = [...sampleEventUnitRows]

        const recordsGroupedBySite = Object.entries(
          this.#groupSampleEventUnitBySite(sampleEventUnitRowsCopy),
        )

        const collectingSummaryWithNameIsNotNull = Object.entries(siteCollectingSummary).filter(
          (summary) => summary[0] !== API_NULL_NAME,
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

        for (const [siteId, siteInfo] of recordsGroupedBySite) {
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
              sampleEventUnitRowsCopy.push({
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

        return sampleEventUnitRowsCopy
      }

    #getFilteredSampleEventUnitRows = function getFilteredSampleEventUnitRows(
      sampleEventUnitRows,
      siteId,
    ) {
      return sampleEventUnitRows.filter(({ site_id }) => site_id === siteId)
    }

    #updateProfileSummary = function updateProfileSummary(
      filteredSampleEventUnitRows,
      sampleEventUnitSampleDate,
      collectingProfileSummary,
    ) {
      const sampleUnitProfileSummary = {}

      if (collectingProfileSummary) {
        for (const [profileId, profileInfo] of Object.entries(collectingProfileSummary)) {
          const collectRecordsWithSampleDatesInSampleEvent = profileInfo.collect_records.filter(
            (collectRecord) =>
              sampleEventUnitSampleDate !== '' &&
              collectRecord.sample_date === sampleEventUnitSampleDate,
          )

          const restOfCollectRecords = profileInfo.collect_records.filter(
            (collectRecord) =>
              sampleEventUnitSampleDate === '' &&
              !filteredSampleEventUnitRows.includes(collectRecord.sample_date),
          )

          if (collectRecordsWithSampleDatesInSampleEvent.length) {
            sampleUnitProfileSummary[profileId] = {
              profile_name: profileInfo.profile_name,
              collect_records: collectRecordsWithSampleDatesInSampleEvent,
            }
          }

          if (restOfCollectRecords.length) {
            sampleUnitProfileSummary[profileId] = {
              profile_name: profileInfo.profile_name,
              collect_records: restOfCollectRecords,
            }
          }
        }
      }

      return sampleUnitProfileSummary
    }

    #fillSampleEventUnitRowsWithCollectRecords = function fillSampleEventUnitRowsWithCollectRecords(
      sampleEventUnitRows,
      siteCollectingSummary,
    ) {
      const sampleEventUnitRowsCopy = [...sampleEventUnitRows]

      for (const sampleEventUnit of sampleEventUnitRowsCopy) {
        const { site_id, sample_unit_protocol, sample_date } = sampleEventUnit

        const filteredSampleEventUnitRowsBySiteId = this.#getFilteredSampleEventUnitRows(
          sampleEventUnitRowsCopy,
          site_id,
        )
          .filter((filteredRecords) => filteredRecords.sample_date !== '')
          .map((record) => record.sample_date)

        const collectingProfileSummary =
          siteCollectingSummary[site_id]?.sample_unit_methods?.[sample_unit_protocol]
            ?.profile_summary

        const updatedSampleEventUnitProfileSummary = this.#updateProfileSummary(
          filteredSampleEventUnitRowsBySiteId,
          sample_date,
          collectingProfileSummary,
        )

        sampleEventUnit.profile_summary = updatedSampleEventUnitProfileSummary
      }

      return sampleEventUnitRowsCopy
    }

    #createAdditionalSampleEventUnitRows = function createAdditionalSampleEventUnitRows(
      sampleEventUnitRows,
      siteCollectingSummary,
    ) {
      /* Rules for extra rows:
        1) Sample event unit rows with only collecting records (including _null_ site name)
        2) Existing sample event unit rows with submitted records, which includes collecting records with empty or different sample dates from a shown date in date column.
      */
      const sampleEventUnitRowsCopy = [...sampleEventUnitRows]

      for (const [siteId, siteProfile] of Object.entries(siteCollectingSummary)) {
        const { sample_unit_methods, site_name } = siteProfile

        const filteredSampleEventUnitRowsBySiteId = this.#getFilteredSampleEventUnitRows(
          sampleEventUnitRowsCopy,
          siteId,
        )

        for (const [protocol, protocolInfo] of Object.entries(sample_unit_methods)) {
          const profileSummaryLabels = []
          const protocolProfileSummary = protocolInfo.profile_summary

          const filteredProtocolProfileSampleDates = filteredSampleEventUnitRowsBySiteId
            .filter(({ sample_unit_protocol }) => sample_unit_protocol === protocol)
            .map(({ sample_date }) => sample_date)

          for (const profile of Object.values(protocolProfileSummary)) {
            profileSummaryLabels.push(...profile.collect_records)
          }

          const profileSummaryLabelSampleDates = profileSummaryLabels.map(
            ({ sample_date }) => sample_date,
          )

          const sampleDatesNotInAnySampleEventUnitRows = profileSummaryLabelSampleDates.filter(
            (date) => !filteredProtocolProfileSampleDates.includes(date),
          )

          const emptyOrDifferentSampleDatesInCollectRecords =
            !filteredProtocolProfileSampleDates.includes('') &&
            sampleDatesNotInAnySampleEventUnitRows.length > 0

          if (emptyOrDifferentSampleDatesInCollectRecords) {
            sampleEventUnitRowsCopy.push({
              site_id: siteId,
              site_name:
                site_name === API_NULL_NAME ? i18next.t('sites.missing_site_name') : site_name,
              sample_date: '',
              sample_unit_numbers: [],
              sample_unit_protocol: protocol,
              sample_unit_method: i18next.t(`protocol_titles.${protocol}`),
              profile_summary: {},
            })
          }
        }
      }

      return sampleEventUnitRowsCopy
    }

    #addCollectingRecordsToUsersAndTransects = function addCollectingRecordsToUsersAndTransects(
      sampleEventUnitRows,
      siteCollectingSummary,
    ) {
      const sampleEventUnitRowsCopy = [...sampleEventUnitRows]

      const extraSampleEventUnitRows = this.#createAdditionalSampleEventUnitRows(
        sampleEventUnitRowsCopy,
        siteCollectingSummary,
      )

      const sampleEventUnitRowsWithCollectRecords = this.#fillSampleEventUnitRowsWithCollectRecords(
        extraSampleEventUnitRows,
        siteCollectingSummary,
      )

      return sampleEventUnitRowsWithCollectRecords
    }

    #addSubmittedRecordsToManagementRegimesOverview =
      function addSubmittedRecordsToManagementRegimesOverview(
        sampleEventUnitRows,
        siteSubmittedSummary,
      ) {
        const sampleEventUnitRowsCopy = [...sampleEventUnitRows]

        for (const [siteId, siteInfo] of Object.entries(siteSubmittedSummary)) {
          const siteName = siteInfo.site_name
          const { bleachingqc, ...otherProtocols } = siteInfo.sample_unit_methods // eslint-disable-line @typescript-eslint/no-unused-vars

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

            const sampleEventUnitRow = {
              site_id: siteId,
              site_name: siteName,
              sample_unit_method: language.protocolTitles[sampleUnit],
              sample_unit_protocol: sampleUnit,
              management_regimes: Object.values(managements),
            }

            sampleEventUnitRow.management_regimes.forEach((regime) => {
              const labelsSortedNumerically = regime.labels.sort((a, b) => a.label - b.label)

              return labelsSortedNumerically
            })

            sampleEventUnitRowsCopy.push(sampleEventUnitRow)
          }
        }

        return sampleEventUnitRowsCopy
      }

    #populateAdditionalProtocolRowsForManagementRegimesOverview =
      function populateAdditionalProtocolRowsForManagementRegimesOverview(sampleEventUnitRows) {
        const sampleEventUnitRowsCopy = [...sampleEventUnitRows]
        const availableProtocols = [
          ...new Set(
            sampleEventUnitRowsCopy.map(({ sample_unit_protocol }) => sample_unit_protocol),
          ),
        ]

        const recordsGroupedBySite = Object.entries(
          this.#groupSampleEventUnitBySite(sampleEventUnitRowsCopy),
        )

        for (const [siteId, siteInfo] of recordsGroupedBySite) {
          const siteName = siteInfo.site_name

          for (const protocol of availableProtocols) {
            const protocolLabel = language.protocolTitles[protocol]
            const siteAndMethodName = `${siteName} ${protocolLabel}`

            if (!siteInfo.site_names.includes(siteAndMethodName)) {
              sampleEventUnitRowsCopy.push({
                site_id: siteId,
                site_name: siteName,
                sample_unit_method: protocolLabel,
                sample_unit_protocol: protocol,
                management_regimes: [],
              })
            }
          }
        }

        return sampleEventUnitRowsCopy
      }

    getSampleUnitSummary = async function getSampleUnitSummary(projectId) {
      if (!projectId) {
        Promise.reject(this._operationMissingParameterError)
      }

      return this._isOnlineAuthenticatedAndReady
        ? axios
            .get(
              `${this._apiBaseUrl}/projects/${projectId}/summary/`,
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
            const sampleEventUnitRows = []
            const {
              site_submitted_summary: siteSubmittedSummary,
              site_collecting_summary: siteCollectingSummary,
              protocols,
            } = sampleUnitRecords

            const sampleEventUnitRowsFilledWithSubmittedRecords =
              this.#addSubmittedRecordsToUsersAndTransects(
                sampleEventUnitRows,
                siteSubmittedSummary,
              )

            const sampleEventUnitRowsAndAdditionalProtocolRows =
              this.#populateAdditionalProtocolRowsForUsersAndTransects(
                sampleEventUnitRowsFilledWithSubmittedRecords,
                siteCollectingSummary,
                protocols,
              )

            const sampleEventUnitRowsFilledWithCollectingRecords =
              this.#addCollectingRecordsToUsersAndTransects(
                sampleEventUnitRowsAndAdditionalProtocolRows,
                siteCollectingSummary,
                protocols,
              )

            return sampleEventUnitRowsFilledWithCollectingRecords
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
              const sampleEventUnitRows = []
              const { site_submitted_summary: siteSubmittedSummary } = sampleUnitRecords

              const sampleEventUnitRowsFilledWithSubmittedRecords =
                this.#addSubmittedRecordsToManagementRegimesOverview(
                  sampleEventUnitRows,
                  siteSubmittedSummary,
                )

              const sampleEventUnitRowsAndAdditionalProtocolRows =
                this.#populateAdditionalProtocolRowsForManagementRegimesOverview(
                  sampleEventUnitRowsFilledWithSubmittedRecords,
                )

              return sampleEventUnitRowsAndAdditionalProtocolRows
            })
          : Promise.reject(this._operationMissingParameterError)
      }
  }

export default ProjectHealthMixin
