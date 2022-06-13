import { toast } from 'react-toastify'
import { useParams, useHistory } from 'react-router-dom'
import React, { useState, useEffect } from 'react'

import { ButtonSecondary } from '../../generic/buttons'
import { ContentPageLayout } from '../../Layout'
import { ensureTrailingSlash } from '../../../library/strings/ensureTrailingSlash'
import { getFishNameConstants } from '../../../App/mermaidData/getFishNameConstants'
import { getFishNameOptions } from '../../../App/mermaidData/getFishNameOptions'
import { H2 } from '../../generic/text'
import { IconPen } from '../../icons'
import { RowSpaceBetween } from '../../generic/positioning'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useSyncStatus } from '../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import IdsNotFound from '../IdsNotFound/IdsNotFound'
import language from '../../../language'
import { getToastArguments } from '../../../library/getToastArguments'
import PageUnavailableOffline from '../PageUnavailableOffline'
import RecordFormTitle from '../../RecordFormTitle'
import SubmittedFishBeltInfoTable from '../../SubmittedFishBeltInfoTable'
import SubmittedFishBeltObservationTable from '../../SubmittedFishBeltObservationTable'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import useIsMounted from '../../../library/useIsMounted'
import { getRecordName } from '../../../library/getRecordName'
import { useCurrentUser } from '../../../App/CurrentUserContext'

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
  const history = useHistory()
  const isMounted = useIsMounted()
  const observers = submittedRecord?.observers ?? []
  const { currentUser } = useCurrentUser()
  const [currentUserProfile, setCurrentUserProfile] = useState({})

  const _getSupportingData = useEffect(() => {
    if (isAppOnline && databaseSwitchboardInstance && projectId && !isSyncInProgress) {
      const promises = [
        databaseSwitchboardInstance.getSitesWithoutOfflineDeleted(projectId),
        databaseSwitchboardInstance.getManagementRegimesWithoutOfflineDeleted(projectId),
        databaseSwitchboardInstance.getChoices(),
        databaseSwitchboardInstance.getFishSpecies(),
        databaseSwitchboardInstance.getFishGenera(),
        databaseSwitchboardInstance.getFishFamilies(),
        databaseSwitchboardInstance.getSubmittedFishBeltTransectRecord(
          projectId,
          submittedRecordId,
        ),
        databaseSwitchboardInstance.getProjectProfiles(projectId),
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
            projectProfilesResponse,
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

              const recordNameForSubNode = getRecordName(
                submittedRecordResponse,
                sitesResponse,
                'fishbelt_transect',
              )

              const filteredUserProfile = projectProfilesResponse.filter(
                ({ profile }) => currentUser.id === profile,
              )[0]

              setSites(sitesResponse)
              setManagementRegimes(managementRegimesResponse)
              setChoices(choicesResponse)
              setSubmittedRecord(submittedRecordResponse)
              setFishNameOptions(updateFishNameOptions)
              setFishNameConstants(updateFishNameConstants)
              setCurrentUserProfile(filteredUserProfile)
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
    currentUser,
  ])

  const handleMoveToCollect = () => {
    setIsMoveToButtonDisabled(true)
    databaseSwitchboardInstance
      .moveToCollect({ projectId, submittedRecordId })
      .then(() => {
        toast.success(...getToastArguments(language.success.submittedRecordMoveToCollect))
        history.push(
          `${ensureTrailingSlash(currentProjectPath)}collecting/fishbelt/${submittedRecordId}`,
        )
      })
      .catch(() => {
        toast.error(...getToastArguments(language.error.submittedRecordMoveToCollect))
        setIsMoveToButtonDisabled(false)
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
            <H2>Observers</H2>
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
          <PageUnavailableOffline />
        )
      }
      toolbar={
        isAppOnline && (
          <>
            <RecordFormTitle
              submittedRecordOrCollectRecordDataProperty={submittedRecord}
              sites={sites}
              primaryTitle={`${language.pages.submittedTable.title} - ${language.pages.submittedFishBeltForm.title}`}
              transectType="fishbelt_transect"
            />
            <RowSpaceBetween>
              <div>{language.pages.submittedFishBeltForm.toolbarLabel}</div>
              {currentUserProfile.is_admin && (
                <ButtonSecondary onClick={handleMoveToCollect} disabled={isMoveToButtonDisabled}>
                  <IconPen />
                  Edit Sample Unit - move to collect
                </ButtonSecondary>
              )}
            </RowSpaceBetween>
          </>
        )
      }
    />
  )
}

export default SubmittedFishBelt
