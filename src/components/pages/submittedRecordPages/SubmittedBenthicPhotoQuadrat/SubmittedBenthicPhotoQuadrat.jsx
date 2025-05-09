import { toast } from 'react-toastify'
import { useParams, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'

import { ButtonSecondary } from '../../../generic/buttons'
import { ContentPageLayout } from '../../../Layout'
import { ensureTrailingSlash } from '../../../../library/strings/ensureTrailingSlash'
import { IconPen } from '../../../icons'
import IdsNotFound from '../../IdsNotFound/IdsNotFound'
import { getBenthicOptions } from '../../../../library/getOptions'
import { getIsUserAdminForProject } from '../../../../App/currentUserProfileHelpers'
import { getRecordSubNavNodeInfo } from '../../../../library/getRecordSubNavNodeInfo'
import { getToastArguments } from '../../../../library/getToastArguments'
import language from '../../../../language'
import PageUnavailable from '../../PageUnavailable'
import SubmittedBenthicPhotoQuadratInfoTable from './SubmittedBenthicPhotoQuadratInfoTable'
import SubmittedBenthicPhotoQuadratObservationTable from './SubmittedBenthicPhotoQuadratObservationTable'
import useCurrentProjectPath from '../../../../library/useCurrentProjectPath'
import { useCurrentUser } from '../../../../App/CurrentUserContext'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useIsMounted from '../../../../library/useIsMounted'
import { useOnlineStatus } from '../../../../library/onlineStatusContext'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import RecordFormTitle from '../../../RecordFormTitle'
import { RowSpaceBetween } from '../../../generic/positioning'
import { FormSubTitle } from '../SubmittedFormPage.styles'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'

const SubmittedBenthicPhotoQuadrat = () => {
  const currentProjectPath = useCurrentProjectPath()
  const { currentUser } = useCurrentUser()

  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const navigate = useNavigate()
  const { isAppOnline } = useOnlineStatus()
  const isMounted = useIsMounted()
  const { isSyncInProgress } = useSyncStatus()
  const { submittedRecordId, projectId } = useParams()

  const [benthicAttributeOptions, setBenthicAttributeOptions] = useState([])
  const [choices, setChoices] = useState({})
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMoveToButtonDisabled, setIsMoveToButtonDisabled] = useState(false)
  const [managementRegimes, setManagementRegimes] = useState([])
  const [sites, setSites] = useState([])
  const [submittedRecord, setSubmittedRecord] = useState()
  const [subNavNode, setSubNavNode] = useState(null)
  const handleHttpResponseError = useHttpResponseErrorHandler()

  const isAdminUser = getIsUserAdminForProject(currentUser, projectId)
  const observers = submittedRecord?.observers ?? []

  const _getSupportingData = useEffect(() => {
    if (isAppOnline && databaseSwitchboardInstance && projectId && !isSyncInProgress) {
      const promises = [
        databaseSwitchboardInstance.getSitesWithoutOfflineDeleted(projectId),
        databaseSwitchboardInstance.getManagementRegimesWithoutOfflineDeleted(projectId),
        databaseSwitchboardInstance.getChoices(),
        databaseSwitchboardInstance.getBenthicAttributes(),
        databaseSwitchboardInstance.getSubmittedSampleUnitRecord(
          projectId,
          submittedRecordId,
          'benthicphotoquadrattransectmethods',
        ),
      ]

      Promise.all(promises)
        .then(
          ([
            sitesResponse,
            managementRegimesResponse,
            choicesResponse,
            benthicAttributes,
            submittedRecordResponse,
          ]) => {
            if (isMounted.current) {
              const recordNameForSubNode = getRecordSubNavNodeInfo(
                submittedRecordResponse,
                sitesResponse,
                'benthicpqt',
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
              toast.error(...getToastArguments(language.error.submittedRecordUnavailable))
            },
          })
        })
    }
  }, [
    databaseSwitchboardInstance,
    handleHttpResponseError,
    isAppOnline,
    isMounted,
    isSyncInProgress,
    projectId,
    submittedRecordId,
  ])

  const handleMoveToCollect = () => {
    setIsMoveToButtonDisabled(true)
    databaseSwitchboardInstance
      .moveToCollect({
        projectId,
        submittedRecordId,
        sampleUnitMethod: 'benthicphotoquadrattransectmethods',
      })
      .then(({ id }) => {
        toast.success(...getToastArguments(language.success.submittedRecordMoveToCollect))
        navigate(`${ensureTrailingSlash(currentProjectPath)}collecting/benthicpqt/${id}`)
      })
      .catch((error) => {
        handleHttpResponseError({
          error,
          callback: () => {
            toast.error(...getToastArguments(language.error.submittedRecordMoveToCollect))
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
            <SubmittedBenthicPhotoQuadratInfoTable
              choices={choices}
              sites={sites}
              managementRegimes={managementRegimes}
              submittedRecord={submittedRecord}
            />
            <FormSubTitle>Observers</FormSubTitle>
            <ul>
              {observers.map((observer) => (
                <li key={observer.id}>{observer.profile_name}</li>
              ))}
            </ul>

            <SubmittedBenthicPhotoQuadratObservationTable
              choices={choices}
              benthicAttributeOptions={benthicAttributeOptions}
              submittedRecord={submittedRecord}
            />
          </>
        ) : (
          <PageUnavailable mainText={language.error.pageUnavailableOffline} />
        )
      }
      toolbar={
        isAppOnline && (
          <>
            <RecordFormTitle
              submittedRecordOrCollectRecordDataProperty={submittedRecord}
              sites={sites}
              protocol="benthicpqt"
            />
            <RowSpaceBetween>
              <>
                <p>
                  {isAdminUser
                    ? language.pages.submittedForm.sampleUnitsAreReadOnly
                    : language.pages.submittedForm.adminEditOnly}
                </p>
                <ButtonSecondary
                  onClick={handleMoveToCollect}
                  disabled={!isAdminUser || isMoveToButtonDisabled}
                >
                  <IconPen />
                  {language.pages.submittedForm.moveSampleUnitButton}
                </ButtonSecondary>
              </>
            </RowSpaceBetween>
          </>
        )
      }
    />
  )
}

export default SubmittedBenthicPhotoQuadrat
