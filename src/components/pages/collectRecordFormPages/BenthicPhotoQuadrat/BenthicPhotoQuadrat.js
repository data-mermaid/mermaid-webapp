import PropTypes from 'prop-types'
import React, { useState, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { useHistory, useParams } from 'react-router-dom'

import { buttonGroupStates } from '../../../../library/buttonGroupStates'
import { ContentPageLayout } from '../../../Layout'
import { ContentPageToolbarWrapper } from '../../../Layout/subLayouts/ContentPageLayout/ContentPageLayout'
import { ensureTrailingSlash } from '../../../../library/strings/ensureTrailingSlash'
import {
  getCollectRecordDataInitialValues,
  getSampleInfoInitialValues,
  getTransectInitialValues,
  getBenthicPhotoQuadratAdditionalValues,
} from '../collectRecordFormInitialValues'
import { getRecordName } from '../../../../library/getRecordName'
import { getToastArguments } from '../../../../library/getToastArguments'
import { H2 } from '../../../generic/text'
import IdsNotFound from '../../IdsNotFound/IdsNotFound'
import language from '../../../../language'
import ObserversInput from '../ObserversInput'
import { reformatFormValuesIntoBenthicPQTRecord } from './reformatFormValuesIntoBenthicPQTRecord'
import RecordFormTitle from '../../../RecordFormTitle'
import SampleEventInputs from '../SampleEventInputs'
import SaveValidateSubmitButtonGroup from '../SaveValidateSubmitButtonGroup'
import { sortArrayByObjectKey } from '../../../../library/arrays/sortArrayByObjectKey'
import TransectInputs from '../TransectInputs'
import { useCurrentUser } from '../../../../App/CurrentUserContext'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import useIsMounted from '../../../../library/useIsMounted'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useUnsavedDirtyFormDataUtilities } from '../useUnsavedDirtyFormUtilities'

const BenthicPhotoQuadrat = ({ isNewRecord }) => {
  const { currentUser } = useCurrentUser()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const history = useHistory()
  const isMounted = useIsMounted()
  const { isSyncInProgress } = useSyncStatus()
  const { recordId, projectId } = useParams()

  const [collectRecordBeingEdited, setCollectRecordBeingEdited] = useState()
  const [choices, setChoices] = useState({})
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isFormDirty, setIsFormDirty] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [managementRegimes, setManagementRegimes] = useState([])
  const [observerProfiles, setObserverProfiles] = useState([])
  const [saveButtonState, setSaveButtonState] = useState(buttonGroupStates.saved)
  const [sites, setSites] = useState([])
  const [submitButtonState] = useState(buttonGroupStates.submittable)
  const [subNavNode, setSubNavNode] = useState(null)
  const [validateButtonState, setValidateButtonState] = useState(buttonGroupStates.validatable)

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance && projectId && !isSyncInProgress) {
      const promises = [
        databaseSwitchboardInstance.getSitesWithoutOfflineDeleted(projectId),
        databaseSwitchboardInstance.getManagementRegimesWithoutOfflineDeleted(projectId),
        databaseSwitchboardInstance.getChoices(),
        databaseSwitchboardInstance.getProjectProfiles(projectId),
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
                  : { name: 'Fish Belt' }

              setSites(sortArrayByObjectKey(sitesResponse, 'name'))
              setManagementRegimes(sortArrayByObjectKey(managementRegimesResponse, 'name'))
              setChoices(choicesResponse)
              setObserverProfiles(sortArrayByObjectKey(projectProfilesResponse, 'profile_name'))
              setCollectRecordBeingEdited(collectRecordResponse)
              setSubNavNode(recordNameForSubNode)
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

  const {
    clearPersistedUnsavedFormData: clearPersistedUnsavedFormikData,
    getPersistedUnsavedFormData: getPersistedUnsavedFormikData,
  } = useUnsavedDirtyFormDataUtilities('unsavedSampleInfoInputs')

  const initialFormikFormValues = useMemo(() => {
    return (
      getPersistedUnsavedFormikData() ?? {
        ...getCollectRecordDataInitialValues(collectRecordBeingEdited),
        ...getSampleInfoInitialValues(collectRecordBeingEdited),
        ...getTransectInitialValues(collectRecordBeingEdited, 'quadrat_transect'),
        ...getBenthicPhotoQuadratAdditionalValues(collectRecordBeingEdited),
      }
    )
  }, [collectRecordBeingEdited, getPersistedUnsavedFormikData])

  const formik = useFormik({
    initialValues: initialFormikFormValues,
    enableReinitialize: true,
  })

  const handleSave = () => {
    const recordToSubmit = reformatFormValuesIntoBenthicPQTRecord(
      formik.values,
      collectRecordBeingEdited,
    )

    setSaveButtonState(buttonGroupStates.saving)

    databaseSwitchboardInstance
      .saveCollectRecord({
        record: recordToSubmit,
        profileId: currentUser.id,
        projectId,
        protocol: 'benthicpqt',
      })
      .then((response) => {
        toast.success(...getToastArguments(language.success.collectRecordSave))
        clearPersistedUnsavedFormikData()
        setSaveButtonState(buttonGroupStates.saved)
        setValidateButtonState(buttonGroupStates.validatable)
        setIsFormDirty(false)
        formik.resetForm({ values: formik.values }) // this resets formik's dirty state

        if (isNewRecord) {
          history.push(`${ensureTrailingSlash(history.location.pathname)}${response.id}`)
        }
      })
      .catch(() => {
        setSaveButtonState(buttonGroupStates.unsaved)
        toast.error(...getToastArguments(language.error.collectRecordSave))
      })
  }

  const _setIsFormDirty = useEffect(() => {
    setIsFormDirty(!!formik.dirty || !!getPersistedUnsavedFormikData())
  }, [formik.dirty, getPersistedUnsavedFormikData])

  const _setCollectButtonsUnsaved = useEffect(() => {
    if (isFormDirty) {
      setSaveButtonState(buttonGroupStates.unsaved)
    }
  }, [isFormDirty])

  const handleObserversChange = ({ selectedObservers }) => {
    formik.setFieldValue('observers', selectedObservers)
  }

  return idsNotAssociatedWithData.length ? (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      content={<IdsNotFound ids={idsNotAssociatedWithData} />}
    />
  ) : (
    <>
      <ContentPageLayout
        isPageContentLoading={isLoading}
        isToolbarSticky={true}
        subNavNode={subNavNode}
        content={
          <>
            <form id="benthicpqt-form" aria-labelledby="benthicpqt-form-title">
              <SampleEventInputs
                formik={formik}
                managementRegimes={managementRegimes}
                sites={sites}
              />
              <TransectInputs choices={choices} formik={formik} />
              <ObserversInput
                data-testid="observers"
                formik={formik}
                observers={observerProfiles}
                onObserversChange={handleObserversChange}
              />
            </form>
          </>
        }
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

            <SaveValidateSubmitButtonGroup
              isNewRecord={isNewRecord}
              saveButtonState={saveButtonState}
              validateButtonState={validateButtonState}
              submitButtonState={submitButtonState}
              onValidate={() => {
                // This is temporary, at the same time it just provides UX feedback.
                toast.error('Validate Benthic PQT record is temporarily unavailable')
              }}
              onSave={handleSave}
              onSubmit={() => {}}
            />
          </ContentPageToolbarWrapper>
        }
      />
    </>
  )
}

BenthicPhotoQuadrat.propTypes = {
  isNewRecord: PropTypes.bool,
}

BenthicPhotoQuadrat.defaultProps = {
  isNewRecord: true,
}
export default BenthicPhotoQuadrat