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

    #addRecordsToUsersAndTransects = function addRecordsToUsersAndTransects(
      sampleEventUnitRecords,
      siteSubmittedSummary,
    ) {
      for (const [siteId, siteInfo] of Object.entries(siteSubmittedSummary)) {
        const siteRecordGroup = Object.values(siteInfo)

        this.#addRecordsBySite(sampleEventUnitRecords, siteRecordGroup, siteId)
      }
    }

    #addRecordsBySite = function addRecordsBySite(sampleEventUnitRecords, siteRecordGroup, siteId) {
      const siteName = siteRecordGroup[0]
      const { bleachingqc, ...otherProtocols } = siteRecordGroup[1] // eslint-disable-line no-unused-vars

      for (const [sampleUnit, sampleUnitNumbers] of Object.entries(otherProtocols)) {
        const sampleEventRecord = {
          site_id: siteId,
          site_name: siteName,
          sample_unit_method: getRecordSampleUnitMethod(sampleUnit),
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

    #populateAdditionalRecordsForUsersAndTransects =
      function populateAdditionalRecordsForUsersAndTransects(
        sampleEventUnitRecords,
        availableProtocols,
      ) {
        /* Rule: If at least one submitted sample unit has a method, show that method in each site row.
      Example: there is only ONE sample unit submitted with the Habitat Complexity property, but it is given its own row in every site row */
        const recordGroupedBySite = Object.entries(
          this.#groupSampleEventUnitBySite(sampleEventUnitRecords),
        )

        for (const [siteId, siteInfo] of recordGroupedBySite) {
          const siteName = this.#removeDateFromName(siteInfo.site_name)

          for (const protocol of availableProtocols) {
            const protocolLabel = getRecordSampleUnitMethod(protocol)
            const siteAndMethodName = `${siteName} ${protocolLabel}`

            if (!siteInfo.site_names.includes(siteAndMethodName)) {
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
          sample_unit_protocol,
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
            collectingSiteSampleUnitMethods[sample_unit_protocol]
          ) {
            sampleEventUnitRecordsCopy[idx].profile_summary =
              collectingSiteSampleUnitMethods[sample_unit_protocol].profile_summary
          }
        }
      }

      for (const siteId of collectingSiteIsWithoutSubmittedRecords) {
        for (const protocol of protocols) {
          sampleEventUnitRecordsCopy.push({
            site_id: siteId,
            site_name: this.#getSiteName(siteCollectingSummary[siteId].site_name),
            sample_unit_method: getRecordSampleUnitMethod(protocol),
            sample_unit_protocol: protocol,
            sample_unit_numbers: [],
            profile_summary:
              siteCollectingSummary[siteId].sample_unit_methods[protocol]?.profile_summary || {},
          })
        }
      }

      return sampleEventUnitRecordsCopy
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
                    sample_unit_number: item.label,
                    id: item.id,
                  })
                : [{ sample_unit_number: item.label, id: item.id }],
            }

            return accumulator
          }, {})

          const sampleEventRecord = {
            site_id: siteId,
            site_name: siteName,
            sample_unit_method: getRecordSampleUnitMethod(sampleUnit),
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
            const protocolLabel = getRecordSampleUnitMethod(protocol)
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
            const noBleachingProtocols = protocols.filter((protocol) => protocol !== 'bleachingqc')

            this.#addRecordsToUsersAndTransects(sampleEventUnitRecords, siteSubmittedSummary)

            this.#populateAdditionalRecordsForUsersAndTransects(
              sampleEventUnitRecords,
              noBleachingProtocols,
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
