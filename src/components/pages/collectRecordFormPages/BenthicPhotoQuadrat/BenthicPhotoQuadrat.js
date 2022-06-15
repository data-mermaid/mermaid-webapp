import { useFormik } from 'formik'
import { toast } from 'react-toastify'
import React, { useState, useEffect, useMemo } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import language from '../../../../language'
import {
  getCollectRecordDataInitialValues,
  getSampleInfoInitialValues,
  getTransectInitialValues,
  getBenthicPhotoQuadratAdditionalValues,
} from '../collectRecordFormInitialValues'
import { H2 } from '../../../generic/text'
import { buttonGroupStates } from '../../../../library/buttonGroupStates'
import { reformatFormValuesIntoBenthicPQTRecord } from './reformatFormValuesIntoBenthicPQTRecord'
import { ContentPageLayout } from '../../../Layout'
import { ContentPageToolbarWrapper } from '../../../Layout/subLayouts/ContentPageLayout/ContentPageLayout'
import { ensureTrailingSlash } from '../../../../library/strings/ensureTrailingSlash'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useUnsavedDirtyFormDataUtilities } from '../useUnsavedDirtyFormUtilities'
import { getToastArguments } from '../../../../library/getToastArguments'
import { useCurrentUser } from '../../../../App/CurrentUserContext'
import useIsMounted from '../../../../library/useIsMounted'
import RecordFormTitle from '../../../RecordFormTitle'
import { sortArrayByObjectKey } from '../../../../library/arrays/sortArrayByObjectKey'
import IdsNotFound from '../../IdsNotFound/IdsNotFound'
import SampleEventInputs from '../SampleEventInputs'
import TransectInputs from '../TransectInputs'
import SaveValidateSubmitButtonGroup from '../SaveValidateSubmitButtonGroup'
import { getRecordName } from '../../../../library/getRecordName'

const BenthicPhotoQuadrat = ({ isNewRecord }) => {
  const [choices, setChoices] = useState({})
  const [collectRecordBeingEdited, setCollectRecordBeingEdited] = useState()
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isFormDirty, setIsFormDirty] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [saveButtonState, setSaveButtonState] = useState(buttonGroupStates.saved)
  const [validateButtonState, setValidateButtonState] = useState(buttonGroupStates.validatable)
  const [submitButtonState] = useState(buttonGroupStates.submittable)
  const [sites, setSites] = useState([])
  const [managementRegimes, setManagementRegimes] = useState([])
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const [subNavNode, setSubNavNode] = useState(null)
  const { isSyncInProgress } = useSyncStatus()
  const { recordId, projectId } = useParams()
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
