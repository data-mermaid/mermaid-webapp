import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

import { ContentPageLayout } from '../../../Layout'
import IdsNotFound from '../../IdsNotFound/IdsNotFound'
import PageUnavailable from '../../PageUnavailable'
import { useOnlineStatus } from '../../../../library/onlineStatusContext'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import useIsMounted from '../../../../library/useIsMounted'
import { getRecordSubNavNodeInfo } from '../../../../library/getRecordSubNavNodeInfo'
import { getToastArguments } from '../../../../library/getToastArguments'
import { FormSubTitle } from '../SubmittedFormPage.styles'
import RecordFormTitle from '../../../RecordFormTitle'
import { RowSpaceBetween } from '../../../generic/positioning'
import { IconPen } from '../../../icons'
import { ButtonSecondary } from '../../../generic/buttons'
import { getIsUserAdminForProject } from '../../../../App/currentUserProfileHelpers'
import { useCurrentUser } from '../../../../App/CurrentUserContext'
import useCurrentProjectPath from '../../../../library/useCurrentProjectPath'
import { ensureTrailingSlash } from '../../../../library/strings/ensureTrailingSlash'
import SubmittedHabitatComplexityInfoTable from './SubmittedHabitatComplexityInfoTable'
import SubmittedHabitatComplexityObservationTable from './SubmittedHabitatComplexityObservationTable'
import { getBenthicOptions } from '../../../../library/getOptions'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'

const SubmittedHabitatComplexity = () => {
  const { t } = useTranslation()

  const submittedRecordsUnavailableText = t('sample_units.errors.submitted_data_unavailable')
  const currentProjectPath = useCurrentProjectPath()
  const { currentUser } = useCurrentUser()

  const { isAppOnline } = useOnlineStatus()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const navigate = useNavigate()
  const { submittedRecordId, projectId } = useParams()
  const { isSyncInProgress } = useSyncStatus()
  const isMounted = useIsMounted()
  const handleHttpResponseError = useHttpResponseErrorHandler()

  const [sites, setSites] = useState([])
  const [managementRegimes, setManagementRegimes] = useState([])
  const [choices, setChoices] = useState({})
  const [submittedRecord, setSubmittedRecord] = useState()
  const [subNavNode, setSubNavNode] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isMoveToButtonDisabled, setIsMoveToButtonDisabled] = useState(false)
  const [benthicAttributeOptions, setBenthicAttributeOptions] = useState([])

  const isAdminUser = getIsUserAdminForProject(currentUser, projectId)
  const observers = submittedRecord?.observers ?? []

  const _getSupportingData = useEffect(() => {
    if (isAppOnline && databaseSwitchboardInstance && projectId && !isSyncInProgress) {
      const promises = [
        databaseSwitchboardInstance.getSitesWithoutOfflineDeleted(projectId),
        databaseSwitchboardInstance.getBenthicAttributes(),
        databaseSwitchboardInstance.getManagementRegimesWithoutOfflineDeleted(projectId),
        databaseSwitchboardInstance.getChoices(),
        databaseSwitchboardInstance.getSubmittedSampleUnitRecord(
          projectId,
          submittedRecordId,
          'habitatcomplexitytransectmethods',
        ),
      ]

      Promise.all(promises)
        .then(
          ([
            sitesResponse,
            benthicAttributes,
            managementRegimesResponse,
            choicesResponse,
            submittedRecordResponse,
          ]) => {
            if (isMounted.current) {
              const recordNameForSubNode = getRecordSubNavNodeInfo(
                submittedRecordResponse,
                sitesResponse,
                'habitatcomplexity',
              )

              const updateBenthicAttributeOptions = getBenthicOptions(benthicAttributes)

              setSites(sitesResponse)
              setManagementRegimes(managementRegimesResponse)
              setChoices(choicesResponse)
              setBenthicAttributeOptions(updateBenthicAttributeOptions)
              setSubmittedRecord(submittedRecordResponse)
              setSubNavNode(recordNameForSubNode)
              setIsLoading(false)
            }
          },
        )
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              const errorStatus = error.response?.status

              if ((errorStatus === 404 || errorStatus === 400) && isMounted.current) {
                setIdsNotAssociatedWithData([projectId, submittedRecordId])
                setIsLoading(false)
              }
              toast.error(...getToastArguments(submittedRecordsUnavailableText))
            },
          })
        })
    }
  }, [
    databaseSwitchboardInstance,
    isMounted,
    submittedRecordId,
    projectId,
    isAppOnline,
    isSyncInProgress,
    handleHttpResponseError,
    submittedRecordsUnavailableText,
  ])

  const handleMoveToCollect = () => {
    setIsMoveToButtonDisabled(true)
    databaseSwitchboardInstance
      .moveToCollect({
        projectId,
        submittedRecordId,
        sampleUnitMethod: 'habitatcomplexitytransectmethods',
      })
      .then(({ id }) => {
        toast.success(...getToastArguments(t('sample_units.errors.submitted_moved_to_collecting')))
        navigate(`${ensureTrailingSlash(currentProjectPath)}collecting/habitatcomplexity/${id}`)
      })
      .catch((error) => {
        handleHttpResponseError({
          error,
          callback: () => {
            toast.error(...getToastArguments(t('sample_units.errors.submitted_not_editable')))
            setIsMoveToButtonDisabled(false)
          },
        })
      })
  }

  return idsNotAssociatedWithData.length ? (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      content={<IdsNotFound ids={idsNotAssociatedWithData} />}
    />
  ) : (
    <ContentPageLayout
      isPageContentLoading={isAppOnline ? isLoading : false}
      isToolbarSticky={true}
      subNavNode={subNavNode}
      content={
        isAppOnline ? (
          <>
            <SubmittedHabitatComplexityInfoTable
              sites={sites}
              choices={choices}
              managementRegimes={managementRegimes}
              submittedRecord={submittedRecord}
            />
            <FormSubTitle>{t('observers')}</FormSubTitle>
            <ul>
              {observers.map((observer) => (
                <li key={observer.id}>{observer.profile_name}</li>
              ))}
            </ul>

            <SubmittedHabitatComplexityObservationTable
              benthicAttributeOptions={benthicAttributeOptions}
              choices={choices}
              submittedRecord={submittedRecord}
            />
          </>
        ) : (
          <PageUnavailable mainText={t('offline.page_unavailable_offline')} />
        )
      }
      toolbar={
        isAppOnline && (
          <>
            <RecordFormTitle
              submittedRecordOrCollectRecordDataProperty={submittedRecord}
              sites={sites}
              protocol="habitatcomplexity"
            />
            <RowSpaceBetween>
              <>
                <p>
                  {isAdminUser
                    ? t('sample_units.submitted_readonly')
                    : t('sample_units.submitted_readonly_and_movable_by_admin')}
                </p>
                <ButtonSecondary
                  onClick={handleMoveToCollect}
                  disabled={!isAdminUser || isMoveToButtonDisabled}
                >
                  <IconPen />
                  {t('buttons.move_to_collecting')}
                </ButtonSecondary>
              </>
            </RowSpaceBetween>
          </>
        )
      }
    />
  )
}

export default SubmittedHabitatComplexity
