import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import language from '../../../../language'
import { H2 } from '../../../generic/text'
import { ContentPageLayout } from '../../../Layout'
import { ContentPageToolbarWrapper } from '../../../Layout/subLayouts/ContentPageLayout/ContentPageLayout'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import useCurrentProjectPath from '../../../../library/useCurrentProjectPath'
import { getToastArguments } from '../../../../library/getToastArguments'
import { useCurrentUser } from '../../../../App/CurrentUserContext'
import useIsMounted from '../../../../library/useIsMounted'
import RecordFormTitle from '../../../RecordFormTitle'
import { sortArrayByObjectKey } from '../../../../library/arrays/sortArrayByObjectKey'

const BenthicPhotoQuadrat = ({ isNewRecord }) => {
  const [choices, setChoices] = useState({})
  const [collectRecordBeingEdited, setCollectRecordBeingEdited] = useState()
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isFormDirty, setIsFormDirty] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sites, setSites] = useState([])
  const [managementRegimes, setManagementRegimes] = useState([])
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isSyncInProgress } = useSyncStatus()
  const { recordId, projectId } = useParams()
  const currentProjectPath = useCurrentProjectPath()
  const { currentUser } = useCurrentUser()
  const history = useHistory()
  const isMounted = useIsMounted()

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance && projectId && !isSyncInProgress) {
      const promises = [
        databaseSwitchboardInstance.getSitesWithoutOfflineDeleted(projectId),
        databaseSwitchboardInstance.getManagementRegimesWithoutOfflineDeleted(projectId),
        databaseSwitchboardInstance.getChoices(),
        databaseSwitchboardInstance.getProject(projectId),
      ]

      if (recordId && !isNewRecord) {
        promises.push(databaseSwitchboardInstance.getCollectRecord(recordId))
      }
      Promise.all(promises)
        .then(
          ([
            sitesResponse,
            managementRegimesResponse,
            choicesResponse,
            projectResponse,

            // collectRecord needs to be last in array because its pushed to the promise array conditionally
            collectRecordResponse,
          ]) => {
            if (isMounted.current) {
              console.log('collectRecordResponse ', collectRecordResponse)
              if (!isNewRecord && !collectRecordResponse && recordId) {
                setIdsNotAssociatedWithData((previousState) => [...previousState, recordId])
              }
              if (!isNewRecord && !projectResponse && projectId) {
                setIdsNotAssociatedWithData((previousState) => [...previousState, projectId])
              }
              setSites(sortArrayByObjectKey(sitesResponse, 'name'))
              setManagementRegimes(sortArrayByObjectKey(managementRegimesResponse, 'name'))
              setChoices(choicesResponse)
              setCollectRecordBeingEdited(collectRecordResponse)
              setIsLoading(false)
            }
          },
        )
        .catch(() => {
          const error = isNewRecord
            ? language.error.collectRecordChoicesUnavailable
            : language.error.collectRecordUnavailable

          toast.error(...getToastArguments(error))
        })
    }
  }, [databaseSwitchboardInstance, isMounted, isNewRecord, recordId, projectId, isSyncInProgress])

  return (
    <ContentPageLayout
      content=""
      toolbar={
        <ContentPageToolbarWrapper>
          {isNewRecord && <H2>{language.pages.benthicPhotoQuadratForm.title}</H2>}
          {collectRecordBeingEdited && !isNewRecord && (
            <RecordFormTitle
              submittedRecordOrCollectRecordDataProperty={collectRecordBeingEdited.data}
              sites={sites}
              primaryTitle={`${language.pages.collectRecord.title} - ${language.pages.benthicPhotoQuadratForm.title}`}
              transectType="quadrat_transect"
            />
          )}
        </ContentPageToolbarWrapper>
      }
    />
  )
}

BenthicPhotoQuadrat.propTypes = {
  isNewRecord: PropTypes.bool,
}

BenthicPhotoQuadrat.defaultProps = {
  isNewRecord: true,
}
export default BenthicPhotoQuadrat
