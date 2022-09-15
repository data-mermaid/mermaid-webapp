import PropTypes from 'prop-types'
import React, { useState, useEffect, useMemo, useReducer, useCallback, useRef } from 'react'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { useHistory, useParams } from 'react-router-dom'

import BenthicAttributeTransectInputs from './BenthicAttributeTransectInputs'
import BenthicPhotoQuadratObservationTable from './BenthicPhotoQuadratObservationTable'
import benthicpqtObservationReducer from './benthicpqtObservationReducer'
import { buttonGroupStates } from '../../../../library/buttonGroupStates'
import { ContentPageLayout } from '../../../Layout'
import { ContentPageToolbarWrapper } from '../../../Layout/subLayouts/ContentPageLayout/ContentPageLayout'
import EnhancedPrompt from '../../../generic/EnhancedPrompt'
import { ensureTrailingSlash } from '../../../../library/strings/ensureTrailingSlash'
import {
  getCollectRecordDataInitialValues,
  getSampleInfoInitialValues,
  getTransectInitialValues,
  getBenthicPhotoQuadratAdditionalValues,
} from '../collectRecordFormInitialValues'
import { getBenthicOptions } from '../../../../library/getOptions'
import { getRecordName } from '../../../../library/getRecordName'
import { getToastArguments } from '../../../../library/getToastArguments'
import { H2 } from '../../../generic/text'
import IdsNotFound from '../../IdsNotFound/IdsNotFound'
import language from '../../../../language'
import LoadingModal from '../../../LoadingModal/LoadingModal'
import NewBenthicAttributeModal from '../../../NewBenthicAttributeModal'
import ObserversInput from '../ObserversInput'
import RecordFormTitle from '../../../RecordFormTitle'
import RecordLevelInputValidationInfo from '../RecordLevelValidationInfo/RecordLevelValidationInfo'
import SampleEventInputs from '../SampleEventInputs'
import SaveValidateSubmitButtonGroup from '../SaveValidateSubmitButtonGroup'
import { sortArrayByObjectKey } from '../../../../library/arrays/sortArrayByObjectKey'
import useCurrentProjectPath from '../../../../library/useCurrentProjectPath'
import { useCurrentUser } from '../../../../App/CurrentUserContext'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useIsMounted from '../../../../library/useIsMounted'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useUnsavedDirtyFormDataUtilities } from '../../../../library/useUnsavedDirtyFormDataUtilities'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import CollectRecordFormPage from '../CollectRecordFormPage'

const BenthicPhotoQuadratForm = ({ isNewRecord }) => {
  const { recordId, projectId } = useParams()
  const { isSyncInProgress } = useSyncStatus()
  const isMounted = useIsMounted()

  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const observationsReducer = useReducer(benthicpqtObservationReducer, [])
  const [observationsState, observationsDispatch] = observationsReducer

  const [collectRecordBeingEdited, setCollectRecordBeingEdited] = useState()
  const [benthicAttributeOptions, setBenthicAttributeOptions] = useState([])
  const [observerProfiles, setObserverProfiles] = useState([])
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [subNavNode, setSubNavNode] = useState(null)
  const [sites, setSites] = useState([])
  const [managementRegimes, setManagementRegimes] = useState([])
  const [choices, setChoices] = useState({})
  const [projectName, setProjectName] = useState('')
  const [saveButtonState, setSaveButtonState] = useState(buttonGroupStates.saved)
  const [submitButtonState, setSubmitButtonState] = useState(buttonGroupStates.submittable)
  const [validateButtonState, setValidateButtonState] = useState(buttonGroupStates.validatable)

  const getValidationButtonStatus = (collectRecord) => {
    return collectRecord?.validations?.status === 'ok'
      ? buttonGroupStates.validated
      : buttonGroupStates.validatable
  }

  const handleSaveButtonStateChange = (updatedButtonState) => setSaveButtonState(updatedButtonState)
  const handleValidateButtonStateChange = (updatedButtonState) =>
    setValidateButtonState(updatedButtonState)
  const handleSubmitButtonStateChange = (updatedButtonState) =>
    setSubmitButtonState(updatedButtonState)

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance && projectId && !isSyncInProgress) {
      const promises = [
        databaseSwitchboardInstance.getSitesWithoutOfflineDeleted(projectId),
        databaseSwitchboardInstance.getManagementRegimesWithoutOfflineDeleted(projectId),
        databaseSwitchboardInstance.getChoices(),
        databaseSwitchboardInstance.getProjectProfiles(projectId),
        databaseSwitchboardInstance.getBenthicAttributes(),
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
            projectProfilesResponse,
            benthicAttributes,
            projectResponse,

            // collectRecord needs to be last in array because its pushed to the promise array conditionally
            collectRecordResponse,
          ]) => {
            if (isMounted.current) {
              if (!isNewRecord && !collectRecordResponse && recordId) {
                setIdsNotAssociatedWithData((previousState) => [...previousState, recordId])
              }
              if (!isNewRecord && !projectResponse && projectId) {
                setIdsNotAssociatedWithData((previousState) => [...previousState, projectId])
              }

              const recordNameForSubNode =
                !isNewRecord && collectRecordResponse
                  ? getRecordName(collectRecordResponse.data, sitesResponse, 'quadrat_transect')
                  : { name: 'Benthic Photo Quadrat' }

              const updateBenthicAttributeOptions = getBenthicOptions(benthicAttributes)

              setSites(sortArrayByObjectKey(sitesResponse, 'name'))
              setManagementRegimes(sortArrayByObjectKey(managementRegimesResponse, 'name'))
              setChoices(choicesResponse)
              setObserverProfiles(sortArrayByObjectKey(projectProfilesResponse, 'profile_name'))
              setBenthicAttributeOptions(updateBenthicAttributeOptions)
              setProjectName(projectResponse.name)
              setCollectRecordBeingEdited(collectRecordResponse)
              setSubNavNode(recordNameForSubNode)
              setIsLoading(false)
              setValidateButtonState(getValidationButtonStatus(collectRecordResponse))
            }
          },
        )
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              const errorMessage = isNewRecord
                ? language.error.collectRecordChoicesUnavailable
                : language.error.collectRecordUnavailable

              toast.error(...getToastArguments(errorMessage))
            },
          })
        })
    }
  }, [
    databaseSwitchboardInstance,
    isMounted,
    isNewRecord,
    recordId,
    projectId,
    isSyncInProgress,
    handleHttpResponseError,
  ])

  const handleCollectRecordChange = (updatedCollectRecord) =>
    setCollectRecordBeingEdited(updatedCollectRecord)

  return (
    <CollectRecordFormPage
      isNewRecord={isNewRecord}
      collectRecordBeingEdited={collectRecordBeingEdited}
      handleCollectRecordChange={handleCollectRecordChange}
      observationsState={observationsState}
      sites={sites}
      managementRegimes={managementRegimes}
      choices={choices}
      idsNotAssociatedWithData={idsNotAssociatedWithData}
      isLoading={isLoading}
      subNavNode={subNavNode}
      observerProfiles={observerProfiles}
      saveButtonState={saveButtonState}
      validateButtonState={validateButtonState}
      submitButtonState={submitButtonState}
      handleSaveButtonStateChange={handleSaveButtonStateChange}
      handleValidateButtonStateChange={handleValidateButtonStateChange}
      handleSubmitButtonStateChange={handleSubmitButtonStateChange}
    />
  )
}

export default BenthicPhotoQuadratForm
