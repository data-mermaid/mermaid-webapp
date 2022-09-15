import PropTypes from 'prop-types'
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { useHistory, useParams } from 'react-router-dom'
import {
  managementRegimePropType,
  sitePropType,
  choicesPropType,
  benthicPhotoQuadratPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import {
  getCollectRecordDataInitialValues,
  getSampleInfoInitialValues,
  getTransectInitialValues,
  getBenthicPhotoQuadratAdditionalValues,
} from '../collectRecordFormInitialValues'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { buttonGroupStates } from '../../../../library/buttonGroupStates'
import { useCurrentUser } from '../../../../App/CurrentUserContext'
import { useUnsavedDirtyFormDataUtilities } from '../../../../library/useUnsavedDirtyFormDataUtilities'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import { ensureTrailingSlash } from '../../../../library/strings/ensureTrailingSlash'
import {
  reformatFormValuesIntoFishBeltRecord,
  reformatFormValuesIntoBenthicPQTRecord,
} from './reformatFormValuesIntoRecord'
import useCurrentProjectPath from '../../../../library/useCurrentProjectPath'
import { getToastArguments } from '../../../../library/getToastArguments'
import { ContentPageLayout } from '../../../Layout'
import { ContentPageToolbarWrapper } from '../../../Layout/subLayouts/ContentPageLayout/ContentPageLayout'
import EnhancedPrompt from '../../../generic/EnhancedPrompt'
import NewBenthicAttributeModal from '../../../NewBenthicAttributeModal'
import ObserversInput from '../ObserversInput'
import DeleteRecordButton from '../DeleteRecordButton'
import SampleEventInputs from '../SampleEventInputs'
import BenthicAttributeTransectInputs from '../BenthicPhotoQuadrat/BenthicAttributeTransectInputs'
import BenthicPhotoQuadratObservationTable from '../BenthicPhotoQuadrat/BenthicPhotoQuadratObservationTable'
import LoadingModal from '../../../LoadingModal/LoadingModal'
import RecordFormTitle from '../../../RecordFormTitle'
import RecordLevelInputValidationInfo from '../RecordLevelValidationInfo/RecordLevelValidationInfo'
import SaveValidateSubmitButtonGroup from '../SaveValidateSubmitButtonGroup'
import IdsNotFound from '../../IdsNotFound/IdsNotFound'

import language from '../../../../language'

const CollectRecordFormPage = ({
  isNewRecord,
  collectRecordBeingEdited,
  handleCollectRecordChange,
  observationsState,
  sites,
  managementRegimes,
  choices,
  idsNotAssociatedWithData,
  isLoading,
  subNavNode,
  observerProfiles,
  saveButtonState,
  validateButtonState,
  submitButtonState,
  handleSaveButtonStateChange,
  handleValidateButtonStateChange,
  handleSubmitButtonStateChange,
}) => {
  const observationTableRef = useRef(null)
  const currentProjectPath = useCurrentProjectPath()

  const { recordId, projectId } = useParams()
  const history = useHistory()
  const handleHttpResponseError = useHttpResponseErrorHandler()

  const { currentUser } = useCurrentUser()
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()

  const [isFormDirty, setIsFormDirty] = useState(false)
  const [areValidationsShowing, setAreValidationsShowing] = useState(false)
  const [areObservationsInputsDirty, setAreObservationsInputsDirty] = useState(false)

  const recordLevelValidations = collectRecordBeingEdited?.validations?.results?.$record ?? []
  const validationsApiData = collectRecordBeingEdited?.validations?.results?.data ?? {}
  const displayLoadingModal =
    saveButtonState === buttonGroupStates.saving ||
    validateButtonState === buttonGroupStates.validating ||
    submitButtonState === buttonGroupStates.submitting

  const handleScrollToObservation = () => {
    observationTableRef.current.scrollIntoView({
      behavior: 'smooth',
    })
  }

  const {
    persistUnsavedFormData: persistUnsavedFormikData,
    clearPersistedUnsavedFormData: clearPersistedUnsavedFormikData,
    getPersistedUnsavedFormData: getPersistedUnsavedFormikData,
  } = useUnsavedDirtyFormDataUtilities(`${currentUser.id}-unsavedSampleInfoInputs`)

  const persistUnsavedObservationsUtilities = useUnsavedDirtyFormDataUtilities(
    `${currentUser.id}-unsavedObservations`,
  )

  const {
    clearPersistedUnsavedFormData: clearPersistedUnsavedObservationsData,
    getPersistedUnsavedFormData: getPersistedUnsavedObservationsData,
  } = persistUnsavedObservationsUtilities

  const getValidationButtonStatus = (collectRecord) => {
    return collectRecord?.validations?.status === 'ok'
      ? buttonGroupStates.validated
      : buttonGroupStates.validatable
  }

  const initialFormikFormValues = useMemo(
    (protocol) => {
      const collectRecordInitialValues = getPersistedUnsavedFormikData() ?? {
        ...getCollectRecordDataInitialValues(collectRecordBeingEdited),
        ...getSampleInfoInitialValues(collectRecordBeingEdited),
      }

      return protocol === 'benthicpqt'
        ? {
            ...collectRecordInitialValues,
            ...getTransectInitialValues(collectRecordBeingEdited, 'quadrat_transect'),
            ...getBenthicPhotoQuadratAdditionalValues(collectRecordBeingEdited),
          }
        : {
            ...collectRecordInitialValues,
            ...getTransectInitialValues(collectRecordBeingEdited, 'fishbelt_transect'),
          }
    },
    [collectRecordBeingEdited, getPersistedUnsavedFormikData],
  )

  const formik = useFormik({
    initialValues: initialFormikFormValues,
    enableReinitialize: true,
    validate: persistUnsavedFormikData,
  })

  const handleSave = (protocol) => {
    const recordToSubmit =
      protocol === 'benthicpqt'
        ? reformatFormValuesIntoBenthicPQTRecord(
            formik.values,
            observationsState,
            collectRecordBeingEdited,
          )
        : reformatFormValuesIntoFishBeltRecord(
            formik.values,
            observationsState,
            collectRecordBeingEdited,
          )

    handleSaveButtonStateChange(buttonGroupStates.saving)
    setAreValidationsShowing(false)

    databaseSwitchboardInstance
      .saveSampleUnit({
        record: recordToSubmit,
        profileId: currentUser.id,
        projectId,
        protocol,
      })
      .then((response) => {
        toast.success(...getToastArguments(language.success.collectRecordSave))
        clearPersistedUnsavedFormikData()
        clearPersistedUnsavedObservationsData()
        setAreObservationsInputsDirty(false)
        handleSaveButtonStateChange(buttonGroupStates.saved)
        handleValidateButtonStateChange(buttonGroupStates.validatable)
        setIsFormDirty(false)
        formik.resetForm({ values: formik.values }) // this resets formik's dirty state

        if (isNewRecord) {
          history.push(`${ensureTrailingSlash(history.location.pathname)}${response.id}`)
        }
      })
      .catch((error) => {
        handleSaveButtonStateChange(buttonGroupStates.unsaved)
        handleHttpResponseError({
          error,
          callback: () => {
            toast.error(...getToastArguments(language.error.collectRecordSave))
          },
        })
      })
  }

  const handleValidate = () => {
    handleValidateButtonStateChange(buttonGroupStates.validating)

    databaseSwitchboardInstance
      .validateSampleUnit({ recordId, projectId })
      .then((validatedRecordResponse) => {
        setAreValidationsShowing(true)
        handleCollectRecordChange(validatedRecordResponse)
        handleValidateButtonStateChange(getValidationButtonStatus(validatedRecordResponse))
      })
      .catch((error) => {
        handleValidateButtonStateChange(buttonGroupStates.validatable)
        handleHttpResponseError({
          error,
          callback: () => {
            toast.error(...getToastArguments(language.error.collectRecordValidation))
          },
        })
      })
  }

  const handleSubmit = () => {
    handleSubmitButtonStateChange(buttonGroupStates.submitting)

    databaseSwitchboardInstance
      .submitSampleUnit({ recordId, projectId })
      .then(() => {
        toast.success(...getToastArguments(language.success.collectRecordSubmit))
        history.push(`${ensureTrailingSlash(currentProjectPath)}collecting/`)
      })
      .catch((error) => {
        handleSubmitButtonStateChange(buttonGroupStates.submittable)
        handleHttpResponseError({
          error,
          callback: () => {
            toast.error(...getToastArguments(language.error.collectRecordSubmit))
          },
        })
      })
  }

  const ignoreRecordLevelValidation = useCallback(
    ({ validationId }) => {
      databaseSwitchboardInstance
        .ignoreRecordLevelValidation({
          record: collectRecordBeingEdited,
          validationId,
        })
        .then((recordWithIgnoredValidations) => {
          handleCollectRecordChange(recordWithIgnoredValidations)
          setIsFormDirty(true)
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.collectRecordSubmit))
            },
          })
        })
    },
    [
      collectRecordBeingEdited,
      databaseSwitchboardInstance,
      handleHttpResponseError,
      handleCollectRecordChange,
    ],
  )

  const ignoreObservationValidations = useCallback(
    ({ observationId }) => {
      databaseSwitchboardInstance
        .ignoreObservationValidations({
          recordId: collectRecordBeingEdited.id,
          observationId,
        })
        .then((recordWithIgnoredValidations) => {
          handleCollectRecordChange(recordWithIgnoredValidations)
          setIsFormDirty(true)
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.collectRecordValidationIgnore))
            },
          })
        })
    },
    [
      collectRecordBeingEdited,
      databaseSwitchboardInstance,
      handleHttpResponseError,
      handleCollectRecordChange,
    ],
  )

  const ignoreNonObservationFieldValidations = useCallback(
    ({ validationPath }) => {
      databaseSwitchboardInstance
        .ignoreNonObservationFieldValidations({
          record: collectRecordBeingEdited,
          validationPath,
        })
        .then((recordWithIgnoredValidations) => {
          handleCollectRecordChange(recordWithIgnoredValidations)
          setIsFormDirty(true)
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.collectRecordValidationIgnore))
            },
          })
        })
    },
    [
      collectRecordBeingEdited,
      databaseSwitchboardInstance,
      handleHttpResponseError,
      handleCollectRecordChange,
    ],
  )

  const resetObservationValidations = useCallback(
    ({ observationId }) => {
      databaseSwitchboardInstance
        .resetObservationValidations({ recordId: collectRecordBeingEdited.id, observationId })
        .then((recordWithResetValidations) => {
          handleCollectRecordChange(recordWithResetValidations)

          setIsFormDirty(true)
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.collectRecordValidationReset))
            },
          })
        })
    },
    [
      collectRecordBeingEdited,
      databaseSwitchboardInstance,
      handleHttpResponseError,
      handleCollectRecordChange,
    ],
  )

  const resetRecordLevelValidation = useCallback(
    ({ validationId }) => {
      databaseSwitchboardInstance
        .resetRecordLevelValidation({
          record: collectRecordBeingEdited,
          validationId,
        })
        .then((recordWithResetValidations) => {
          handleCollectRecordChange(recordWithResetValidations)
          setIsFormDirty(true)
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.collectRecordValidationReset))
            },
          })
        })
    },
    [
      collectRecordBeingEdited,
      databaseSwitchboardInstance,
      handleHttpResponseError,
      handleCollectRecordChange,
    ],
  )

  const resetNonObservationFieldValidations = useCallback(
    ({ validationPath }) => {
      databaseSwitchboardInstance
        .resetNonObservationFieldValidations({
          record: collectRecordBeingEdited,
          validationPath,
        })
        .then((recordWithResetValidations) => {
          handleCollectRecordChange(recordWithResetValidations)
          setIsFormDirty(true)
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.collectRecordValidationReset))
            },
          })
        })
    },
    [
      collectRecordBeingEdited,
      databaseSwitchboardInstance,
      handleHttpResponseError,
      handleCollectRecordChange,
    ],
  )

  const _setIsFormDirty = useEffect(() => {
    setIsFormDirty(
      areObservationsInputsDirty ||
        !!formik.dirty ||
        !!getPersistedUnsavedFormikData() ||
        !!getPersistedUnsavedObservationsData(),
    )
  }, [
    areObservationsInputsDirty,
    formik.dirty,
    getPersistedUnsavedFormikData,
    getPersistedUnsavedObservationsData,
  ])

  const _setCollectButtonsUnsaved = useEffect(() => {
    if (isFormDirty) {
      handleSaveButtonStateChange(buttonGroupStates.unsaved)
    }
  }, [isFormDirty])

  const handleChangeForDirtyIgnoredInput = ({
    validationProperties,
    validationPath,
    inputName,
  }) => {
    const isInputDirty = formik.initialValues[inputName] === formik.values[inputName]
    const doesFieldHaveIgnoredValidation = validationProperties.validationType === 'ignore'

    if (doesFieldHaveIgnoredValidation && isInputDirty) {
      resetNonObservationFieldValidations({ validationPath })
    }
  }

  const validationPropertiesWithDirtyResetOnInputChange = (validationProperties, property) => {
    // for UX purpose only, validation is cleared when input is on change after page is validated
    const validationDirtyCheck =
      formik.values[property] !== formik.initialValues[property]
        ? null
        : validationProperties.validationType

    return {
      ...validationProperties,
      validationType: validationDirtyCheck,
    }
  }

  const deleteRecord = () => {
    if (!isNewRecord) {
      databaseSwitchboardInstance
        .deleteSampleUnit({
          record: collectRecordBeingEdited,
          profileId: currentUser.id,
          projectId,
        })
        .then(() => {
          clearPersistedUnsavedFormikData()
          clearPersistedUnsavedObservationsData()
          toast.success(...getToastArguments(language.success.collectRecordDelete))
          history.push(`${ensureTrailingSlash(currentProjectPath)}collecting/`)
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.collectRecordDelete))
            },
          })
        })
    }

    return Promise.resolve()
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
            <RecordLevelInputValidationInfo
              validations={recordLevelValidations}
              areValidationsShowing={areValidationsShowing}
              resetRecordLevelValidation={resetRecordLevelValidation}
              ignoreRecordLevelValidation={ignoreRecordLevelValidation}
              handleScrollToObservation={handleScrollToObservation}
            />
            <form
              id="benthicpqt-form"
              aria-labelledby="benthicpqt-form-title"
              onSubmit={formik.handleSubmit}
            >
              <SampleEventInputs
                areValidationsShowing={areValidationsShowing}
                collectRecord={collectRecordBeingEdited}
                formik={formik}
                managementRegimes={managementRegimes}
                sites={sites}
                handleChangeForDirtyIgnoredInput={handleChangeForDirtyIgnoredInput}
                ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
                resetNonObservationFieldValidations={resetNonObservationFieldValidations}
                validationPropertiesWithDirtyResetOnInputChange={
                  validationPropertiesWithDirtyResetOnInputChange
                }
              />
              <BenthicAttributeTransectInputs
                areValidationsShowing={areValidationsShowing}
                collectRecord={collectRecordBeingEdited}
                choices={choices}
                formik={formik}
                handleChangeForDirtyIgnoredInput={handleChangeForDirtyIgnoredInput}
                ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
                resetNonObservationFieldValidations={resetNonObservationFieldValidations}
                validationsApiData={validationsApiData}
                validationPropertiesWithDirtyResetOnInputChange={
                  validationPropertiesWithDirtyResetOnInputChange
                }
              />
              <ObserversInput
                data-testid="observers"
                areValidationsShowing={areValidationsShowing}
                formik={formik}
                ignoreNonObservationFieldValidations={ignoreNonObservationFieldValidations}
                observers={observerProfiles}
                handleChangeForDirtyIgnoredInput={handleChangeForDirtyIgnoredInput}
                resetNonObservationFieldValidations={resetNonObservationFieldValidations}
                validationsApiData={validationsApiData}
                validationPropertiesWithDirtyResetOnInputChange={
                  validationPropertiesWithDirtyResetOnInputChange
                }
              />
              {/* <div ref={observationTableRef}>
                <BenthicPhotoQuadratObservationTable
                  areObservationsInputsDirty={areObservationsInputsDirty}
                  areValidationsShowing={areValidationsShowing}
                  benthicAttributeOptions={benthicAttributeOptions}
                  choices={choices}
                  collectRecord={collectRecordBeingEdited}
                  observationsReducer={observationsReducer}
                  openNewBenthicAttributeModal={openNewBenthicAttributeModal}
                  persistUnsavedObservationsUtilities={persistUnsavedObservationsUtilities}
                  ignoreObservationValidations={ignoreObservationValidations}
                  resetObservationValidations={resetObservationValidations}
                  setAreObservationsInputsDirty={setAreObservationsInputsDirty}
                />
              </div> */}
            </form>
            <DeleteRecordButton isNewRecord={isNewRecord} deleteRecord={deleteRecord} />
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
                sampleUnit="quadrat_transect"
              />
            )}

            <SaveValidateSubmitButtonGroup
              isNewRecord={isNewRecord}
              saveButtonState={saveButtonState}
              validateButtonState={validateButtonState}
              submitButtonState={submitButtonState}
              onValidate={handleValidate}
              onSave={handleSave}
              onSubmit={handleSubmit}
            />
          </ContentPageToolbarWrapper>
        }
      />

      {/* {!!projectId && !!currentUser && (
        <NewBenthicAttributeModal
          isOpen={isNewBenthicAttributeModalOpen}
          onDismiss={closeNewBenthicAttributeModal}
          onSubmit={onSubmitNewBenthicAttribute}
          currentUser={currentUser}
          projectName={projectName}
          benthicAttributeOptions={benthicAttributeOptions}
        />
      )} */}
      {displayLoadingModal && <LoadingModal />}
      <EnhancedPrompt shouldPromptTrigger={formik.dirty} />
    </>
  )
}

CollectRecordFormPage.propTypes = {
  isNewRecord: PropTypes.bool.isRequired,
  handleCollectRecordChange: PropTypes.func.isRequired,
  sites: PropTypes.arrayOf(sitePropType).isRequired,
  managementRegimes: PropTypes.arrayOf(managementRegimePropType).isRequired,
  choices: choicesPropType.isRequired,
  idsNotAssociatedWithData: PropTypes.arrayOf(PropTypes.string).isRequired,
  isLoading: PropTypes.bool.isRequired,
  subNavNode: PropTypes.string.isRequired,
  saveButtonState: PropTypes.string.isRequired,
  validateButtonState: PropTypes.string.isRequired,
  submitButtonState: PropTypes.string.isRequired,
  handleSaveButtonStateChange: PropTypes.func.isRequired,
  handleValidateButtonStateChange: PropTypes.func.isRequired,
  handleSubmitButtonStateChange: PropTypes.func.isRequired,
}

export default CollectRecordFormPage
