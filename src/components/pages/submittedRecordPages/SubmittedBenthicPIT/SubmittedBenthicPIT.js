/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'

import { ContentPageLayout } from '../../../Layout'
import IdsNotFound from '../../IdsNotFound/IdsNotFound'
import PageUnavailable from '../../PageUnavailable'
import { useOnlineStatus } from '../../../../library/onlineStatusContext'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import useIsMounted from '../../../../library/useIsMounted'
import { getRecordSubNavNodeInfo } from '../../../../library/getRecordSubNavNodeInfo'
import { getToastArguments } from '../../../../library/getToastArguments'
import language from '../../../../language'
import { FormSubTitle } from '../SubmittedFormPage.styles'
import RecordFormTitle from '../../../RecordFormTitle'
import { RowSpaceBetween } from '../../../generic/positioning'
import { IconPen } from '../../../icons'
import { ButtonSecondary } from '../../../generic/buttons'
import { getIsAdminUserRole } from '../../../../App/currentUserProfileHelpers'
import { useCurrentUser } from '../../../../App/CurrentUserContext'
import useCurrentProjectPath from '../../../../library/useCurrentProjectPath'
import { ensureTrailingSlash } from '../../../../library/strings/ensureTrailingSlash'

const SubmittedBenthicPit = () => {
  const currentProjectPath = useCurrentProjectPath()
  const { currentUser } = useCurrentUser()

  const { isAppOnline } = useOnlineStatus()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const history = useHistory()
  const { submittedRecordId, projectId } = useParams()
  const { isSyncInProgress } = useSyncStatus()
  const isMounted = useIsMounted()

  const [sites, setSites] = useState([])
  const [managementRegimes, setManagementRegimes] = useState([])
  const [choices, setChoices] = useState({})
  const [submittedRecord, setSubmittedRecord] = useState()
  const [subNavNode, setSubNavNode] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isMoveToButtonDisabled, setIsMoveToButtonDisabled] = useState(false)

  const isAdminUser = getIsAdminUserRole(currentUser, projectId)
  const observers = submittedRecord?.observers ?? []

  const _getSupportingData = useEffect(() => {
    if (isAppOnline && databaseSwitchboardInstance && projectId && !isSyncInProgress) {
      const promises = [
        databaseSwitchboardInstance.getSitesWithoutOfflineDeleted(projectId),
        databaseSwitchboardInstance.getManagementRegimesWithoutOfflineDeleted(projectId),
        databaseSwitchboardInstance.getChoices(),
        databaseSwitchboardInstance.getSubmittedSampleUnitRecord(
          projectId,
          submittedRecordId,
          'benthicpittransectmethods',
        ),
      ]

      Promise.all(promises)
        .then(
          ([
            sitesResponse,
            managementRegimesResponse,
            choicesResponse,
            // benthicAttributes,
            submittedRecordResponse,
          ]) => {
            if (isMounted.current) {
              const recordNameForSubNode = getRecordSubNavNodeInfo(
                submittedRecordResponse,
                sitesResponse,
                'benthic_transect',
              )

              //   const updateBenthicAttributeOptions = getBenthicOptions(benthicAttributes)

              setSites(sitesResponse)
              setManagementRegimes(managementRegimesResponse)
              setChoices(choicesResponse)
              //   setBenthicAttributeOptions(updateBenthicAttributeOptions)
              setSubmittedRecord(submittedRecordResponse)
              setSubNavNode(recordNameForSubNode)
              setIsLoading(false)
            }
          },
        )
        .catch((error) => {
          const errorStatus = error.response?.status

          if ((errorStatus === 404 || errorStatus === 400) && isMounted.current) {
            setIdsNotAssociatedWithData([projectId, submittedRecordId])
            setIsLoading(false)
          }
          toast.error(...getToastArguments(language.error.submittedRecordUnavailable))
        })
    }
  }, [
    databaseSwitchboardInstance,
    isMounted,
    submittedRecordId,
    projectId,
    isAppOnline,
    isSyncInProgress,
  ])

  const handleMoveToCollect = () => {
    setIsMoveToButtonDisabled(true)
    databaseSwitchboardInstance
      .moveToCollect({
        projectId,
        submittedRecordId,
        sampleUnitMethod: 'benthicpittransectmethods',
      })
      .then(() => {
        toast.success(...getToastArguments(language.success.submittedRecordMoveToCollect))
        history.push(
          `${ensureTrailingSlash(currentProjectPath)}collecting/benthicpit/${submittedRecordId}`,
        )
      })
      .catch(() => {
        toast.error(...getToastArguments(language.error.submittedRecordMoveToCollect))
        setIsMoveToButtonDisabled(false)
      })
  }

  console.log({ submittedRecord })

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
            {/* <SubmittedBenthicPhotoQuadratInfoTable
              choices={choices}
              sites={sites}
              managementRegimes={managementRegimes}
              submittedRecord={submittedRecord}
            /> */}
            <FormSubTitle>Observers</FormSubTitle>
            <ul>
              {observers.map((observer) => (
                <li key={observer.id}>{observer.profile_name}</li>
              ))}
            </ul>

            {/* <SubmittedBenthicPhotoQuadratObservationTable
              choices={choices}
              benthicAttributeOptions={benthicAttributeOptions}
              submittedRecord={submittedRecord}
            /> */}
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
              sampleUnitName="benthicpit"
            />
            <RowSpaceBetween>
              <>
                <p>
                  {isAdminUser
                    ? language.pages.submittedFishBeltForm.sampleUnitsAreReadOnly
                    : language.pages.submittedFishBeltForm.adminEditOnly}
                </p>
                <ButtonSecondary
                  onClick={handleMoveToCollect}
                  disabled={isAdminUser ? isMoveToButtonDisabled : 'false'}
                >
                  <IconPen />
                  {language.pages.submittedFishBeltForm.moveSampleUnitButon}
                </ButtonSecondary>
              </>
            </RowSpaceBetween>
          </>
        )
      }
    />
  )
}

export default SubmittedBenthicPit
