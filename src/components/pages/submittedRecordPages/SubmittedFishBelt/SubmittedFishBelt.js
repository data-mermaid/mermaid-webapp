import { toast } from 'react-toastify'
import { useParams, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'

import { ButtonSecondary } from '../../../generic/buttons'
import { ContentPageLayout } from '../../../Layout'
import { ensureTrailingSlash } from '../../../../library/strings/ensureTrailingSlash'
import {
  getFishNameConstants,
  getFishNameOptions,
} from '../../../../App/mermaidData/fishNameHelpers'
import { IconPen } from '../../../icons'
import { RowSpaceBetween } from '../../../generic/positioning'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useOnlineStatus } from '../../../../library/onlineStatusContext'
import IdsNotFound from '../../IdsNotFound/IdsNotFound'
import language from '../../../../language'
import { getToastArguments } from '../../../../library/getToastArguments'
import PageUnavailable from '../../PageUnavailable'
import RecordFormTitle from '../../../RecordFormTitle'
import SubmittedFishBeltInfoTable from './SubmittedFishBeltInfoTable'
import SubmittedFishBeltObservationTable from './SubmittedFishBeltObservationTable'
import useCurrentProjectPath from '../../../../library/useCurrentProjectPath'
import useIsMounted from '../../../../library/useIsMounted'
import { getRecordSubNavNodeInfo } from '../../../../library/getRecordSubNavNodeInfo'
import { useCurrentUser } from '../../../../App/CurrentUserContext'
import { FormSubTitle } from '../SubmittedFormPage.styles'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import { getIsUserAdminForProject } from '../../../../App/currentUserProfileHelpers'

const SubmittedFishBelt = () => {
  const [choices, setChoices] = useState({})
  const [fishNameConstants, setFishNameConstants] = useState([])
  const [fishNameOptions, setFishNameOptions] = useState([])
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMoveToButtonDisabled, setIsMoveToButtonDisabled] = useState(false)
  const [managementRegimes, setManagementRegimes] = useState([])
  const [sites, setSites] = useState([])
  const [submittedRecord, setSubmittedRecord] = useState()
  const [subNavNode, setSubNavNode] = useState(null)
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { isAppOnline } = useOnlineStatus()
  const { submittedRecordId, projectId } = useParams()
  const currentProjectPath = useCurrentProjectPath()
  const navigate = useNavigate()
  const isMounted = useIsMounted()
  const observers = submittedRecord?.observers ?? []
  const { currentUser } = useCurrentUser()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const isAdminUser = getIsUserAdminForProject(currentUser, projectId)

  const _getSupportingData = useEffect(() => {
    if (isAppOnline && databaseSwitchboardInstance && projectId && !isSyncInProgress) {
      const promises = [
        databaseSwitchboardInstance.getSitesWithoutOfflineDeleted(projectId),
        databaseSwitchboardInstance.getManagementRegimesWithoutOfflineDeleted(projectId),
        databaseSwitchboardInstance.getChoices(),
        databaseSwitchboardInstance.getFishSpecies(),
        databaseSwitchboardInstance.getFishGenera(),
        databaseSwitchboardInstance.getFishFamilies(),
        databaseSwitchboardInstance.getSubmittedSampleUnitRecord(
          projectId,
          submittedRecordId,
          'beltfishtransectmethods',
        ),
      ]

      Promise.all(promises)
        .then(
          ([
            sitesResponse,
            managementRegimesResponse,
            choicesResponse,
            species,
            genera,
            families,
            submittedRecordResponse,
          ]) => {
            if (isMounted.current) {
              const updateFishNameOptions = getFishNameOptions({
                species,
                genera,
                families,
              })

              const updateFishNameConstants = getFishNameConstants({
                species,
                genera,
                families,
              })

              const recordNameForSubNode = getRecordSubNavNodeInfo(
                submittedRecordResponse,
                sitesResponse,
                'fishbelt',
              )

              setSites(sitesResponse)
              setManagementRegimes(managementRegimesResponse)
              setChoices(choicesResponse)
              setSubmittedRecord(submittedRecordResponse)
              setFishNameOptions(updateFishNameOptions)
              setFishNameConstants(updateFishNameConstants)
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
    currentUser,
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
      .moveToCollect({ projectId, submittedRecordId, sampleUnitMethod: 'beltfishtransectmethods' })
      .then(({ id }) => {
        toast.success(...getToastArguments(language.success.submittedRecordMoveToCollect))
        navigate(`${ensureTrailingSlash(currentProjectPath)}collecting/fishbelt/${id}`)
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
            <SubmittedFishBeltInfoTable
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

            <SubmittedFishBeltObservationTable
              choices={choices}
              fishNameOptions={fishNameOptions}
              fishNameConstants={fishNameConstants}
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
              protocol="fishbelt"
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
                  disabled={isAdminUser ? isMoveToButtonDisabled : `false`}
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

export default SubmittedFishBelt
