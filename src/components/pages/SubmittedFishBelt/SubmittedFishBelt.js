import { toast } from 'react-toastify'
import { useParams, useHistory } from 'react-router-dom'
import React, { useState, useEffect } from 'react'

import { ButtonSecondary } from '../../generic/buttons'
import { ContentPageLayout } from '../../Layout'
import { getFishNameConstants } from '../../../App/mermaidData/getFishNameConstants'
import { getFishNameOptions } from '../../../App/mermaidData/getFishNameOptions'
import { IconPen } from '../../icons'
import { RowSpaceBetween } from '../../generic/positioning'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import IdsNotFound from '../IdsNotFound/IdsNotFound'
import language from '../../../language'
import PageUnavailableOffline from '../PageUnavailableOffline'
import RecordFormTitle from '../../RecordFormTitle'
import SubmittedFishBeltInfoTable from '../../SubmittedFishBeltInfoTable'
import SubmittedFishBeltObservationTable from '../../SubmittedFishBeltObservationTable'
import useIsMounted from '../../../library/useIsMounted'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import { ensureTrailingSlash } from '../../../library/strings/ensureTrailingSlash'

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
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isAppOnline } = useOnlineStatus()
  const { recordId, projectId } = useParams()
  const currentProjectPath = useCurrentProjectPath()
  const history = useHistory()
  const isMounted = useIsMounted()

  const _getSupportingData = useEffect(() => {
    if (isAppOnline && databaseSwitchboardInstance) {
      const promises = [
        databaseSwitchboardInstance.getSitesWithoutOfflineDeleted(projectId),
        databaseSwitchboardInstance.getManagementRegimesWithoutOfflineDeleted(projectId),
        databaseSwitchboardInstance.getChoices(),
        databaseSwitchboardInstance.getFishSpecies(),
        databaseSwitchboardInstance.getFishGenera(),
        databaseSwitchboardInstance.getFishFamilies(),
        databaseSwitchboardInstance.getSubmittedFishBeltTransectRecord(projectId, recordId),
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

              setSites(sitesResponse)
              setManagementRegimes(managementRegimesResponse)
              setChoices(choicesResponse)
              setSubmittedRecord(submittedRecordResponse)
              setFishNameOptions(updateFishNameOptions)
              setFishNameConstants(updateFishNameConstants)
              setIsLoading(false)
            }
          },
        )
        .catch((error) => {
          const errorStatus = error.response?.status

          if ((errorStatus === 404 || errorStatus === 400) && isMounted.current) {
            setIdsNotAssociatedWithData([projectId, recordId])
            setIsLoading(false)
          }
          toast.error(language.error.submittedRecordUnavailable)
        })
    }
  }, [databaseSwitchboardInstance, isMounted, recordId, projectId, isAppOnline])

  const handleMoveToCollect = () => {
    setIsMoveToButtonDisabled(true)
    databaseSwitchboardInstance
      .moveToCollect({ projectId, recordId })
      .then(() => {
        toast.success(language.success.submittedRecordMoveToCollect)
        history.push(`${ensureTrailingSlash(currentProjectPath)}collecting/`)
      })
      .catch(() => {
        toast.error(language.error.submittedRecordMoveToCollect)
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
      content={
        isAppOnline ? (
          <>
            <SubmittedFishBeltInfoTable
              choices={choices}
              sites={sites}
              managementRegimes={managementRegimes}
              submittedRecord={submittedRecord}
            />
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
            />
            <RowSpaceBetween>
              <div>{language.pages.submittedFishBeltForm.toolbarLabel}</div>
              <ButtonSecondary onClick={handleMoveToCollect} disabled={isMoveToButtonDisabled}>
                <IconPen />
                Edit Sample Unit - move to collect
              </ButtonSecondary>
            </RowSpaceBetween>
          </>
        )
      }
    />
  )
}

SubmittedFishBelt.propTypes = {}

export default SubmittedFishBelt
