import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { useParams, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useMemo, useCallback } from 'react'

import { buttonGroupStates } from '../../../library/buttonGroupStates'
import { ContentPageLayout } from '../../Layout'
import { ContentPageToolbarWrapper } from '../../Layout/subLayouts/ContentPageLayout/ContentPageLayout'
import { ensureTrailingSlash } from '../../../library/strings/ensureTrailingSlash'
import { formikPropType } from '../../../library/formikPropType'
import {
  getIsUserReadOnlyForProject,
  getIsUserAdminForProject,
} from '../../../App/currentUserProfileHelpers'
import { getOptions } from '../../../library/getOptions'
import { getIndicatorSetFormInitialValues } from './indicatorSetFormInitialValues'
import { getToastArguments } from '../../../library/getToastArguments'
import { H2, ItalicizedInfo } from '../../generic/text'
import { inputOptionsPropTypes } from '../../../library/miscPropTypes'
import { InputRow, InputWrapper, RequiredIndicator } from '../../generic/form'
import { showSyncToastError } from '../../../library/showSyncToastError'
import { sitePropType } from '../../../App/mermaidData/mermaidDataProptypes'
import { Table } from '../../generic/Table/table'
import { useCurrentUser } from '../../../App/CurrentUserContext'
import { useDatabaseSwitchboardInstance } from '../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useHttpResponseErrorHandler } from '../../../App/HttpResponseErrorHandlerContext'
import { useOnlineStatus } from '../../../library/onlineStatusContext'
import { useSyncStatus } from '../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useUnsavedDirtyFormDataUtilities } from '../../../library/useUnsavedDirtyFormDataUtilities'
import DeleteRecordButton from '../../DeleteRecordButton'
import EnhancedPrompt from '../../generic/EnhancedPrompt'
import IdsNotFound from '../IdsNotFound/IdsNotFound'
import InputAutocomplete from '../../generic/InputAutocomplete'
import InputValidationInfo from '../../mermaidInputs/InputValidationInfo/InputValidationInfo'
import InputWithLabelAndValidation from '../../mermaidInputs/InputWithLabelAndValidation'
import language from '../../../language'
import LoadingModal from '../../LoadingModal/LoadingModal'
import PageUnavailable from '../PageUnavailable'
import SaveButton from '../../generic/SaveButton'
import SingleSiteMap from '../../mermaidMap/SingleSiteMap'
import TableRowItem from '../../generic/Table/TableRowItem'
import TextareaWithLabelAndValidation from '../../mermaidInputs/TextareaWithLabelAndValidation'
import useCurrentProjectPath from '../../../library/useCurrentProjectPath'
import useDocumentTitle from '../../../library/useDocumentTitle'
import useIsMounted from '../../../library/useIsMounted'
import InputSelectWithLabelAndValidation from '../../mermaidInputs/InputSelectWithLabelAndValidation'
import { DeleteRecordButtonCautionWrapper } from '../collectRecordFormPages/CollectingFormPage.Styles'
import { IconSwap } from '../../icons'
import { InputButton } from '../../generic/buttons'
import { useCurrentProject } from '../../../App/CurrentProjectContext'
import styled from 'styled-components'

const ReadOnlySiteContent = ({
  site,
  countryOptions,
  exposureOptions,
  reefTypeOptions,
  reefZoneOptions,
  isReadOnlyUser,
  isAppOnline,
}) => {
  const { country, latitude, longitude, exposure, reef_type, reef_zone, notes } = site

  return (
    <>
      <Table>
        <tbody>
          <TableRowItem title="Country" options={countryOptions} value={country} />
          <TableRowItem title="Latitude" value={latitude} />
          <TableRowItem title="Longitude" value={longitude} />
          <TableRowItem title="Exposure" options={exposureOptions} value={exposure} />
          <TableRowItem title="Reef Type" options={reefTypeOptions} value={reef_type} />
          <TableRowItem title="Reef Zone" options={reefZoneOptions} value={reef_zone} />
          <TableRowItem title="Notes" value={notes} isAllowNewlines={true} />
        </tbody>
      </Table>
      {isAppOnline && (
        <SingleSiteMap
          formLatitudeValue={latitude}
          formLongitudeValue={longitude}
          isReadOnlyUser={isReadOnlyUser}
        />
      )}
    </>
  )
}

const SwapButton = ({ isDisabled, handleSwapClick, swapLabel }) => {
  return (
    <InputButton type="button" disabled={isDisabled} onClick={handleSwapClick}>
      <IconSwap />
      <span>{swapLabel}</span>
    </InputButton>
  )
}

const enforceNumberInput = (event) => {
  // Allow only numbers, special key presses, and copy paste shortcuts.
  const specialActionAndCharacterKeys = [
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'Backspace',
    'Delete',
    '-',
    '.',
    'Tab',
  ]

  const isModifiersKeyPressed = event.metaKey || event.ctrlKey || event.shiftKey
  const isMovingAndSpecialCharactersKeyPressed = specialActionAndCharacterKeys.includes(event.key)
  const isNumbersKeyPressed =
    (event.keyCode >= 48 && event.keyCode <= 58) || (event.keyCode >= 96 && event.keyCode <= 105)

  return !(isModifiersKeyPressed || isMovingAndSpecialCharactersKeyPressed || isNumbersKeyPressed)
}

const StyledYearInputWithLabelAndValidation = styled(InputWithLabelAndValidation)`
  width: 10rem;
`

const handleInputBlur = (formik, event, fieldName) => {
  const { value } = event.target

  if (value.trim() === '') {
    setInputToDefaultValue(formik, fieldName)
  }
}

const setInputToDefaultValue = (formik, fieldName) => {
  formik.setFieldValue(fieldName, formik.initialValues[fieldName])
}

const IndicatorSetForm = ({ formik, isAppOnline }) => {
  return (
    <form id="indicator-set-form" onSubmit={formik.handleSubmit}>
      <InputWrapper>
        <InputWithLabelAndValidation
          required
          label="Title"
          id="gfcr-title"
          type="text"
          {...formik.getFieldProps('title')}
          validationType={formik.errors.title && formik.touched.title ? 'error' : null}
          validationMessages={formik.errors.title}
          /* helperText={language.helperText.siteName} */
        />
        <InputWithLabelAndValidation
          label="Reporting Date"
          id="gfcr-report_date"
          type="date"
          {...formik.getFieldProps('report_date')}
          validationType={formik.errors.report_date && formik.touched.report_date ? 'error' : null}
          validationMessages={formik.errors.report_date}
          onBlur={(event) => handleInputBlur(formik, event, 'report_date')}
          value={formik.values.report_date}
          helperText={language.helperText.sampleDate}
        />
        <StyledYearInputWithLabelAndValidation
          required
          label="Reporting Year"
          id="gfcr-report-year"
          type="number"
          {...formik.getFieldProps('report_year')}
          validationType={formik.errors.report_year && formik.touched.report_year ? 'error' : null}
          validationMessages={formik.errors.report_year}
          onBlur={(event) => {
            const { value } = event.target
            const trimmedValue = value.trim()

            if (
              trimmedValue === '' ||
              parseInt(trimmedValue) < 1900 ||
              parseInt(trimmedValue) > 2099
            ) {
              setInputToDefaultValue(formik, 'report_year')
            }
          }}
        />
      </InputWrapper>
    </form>
  )
}

const GfcrIndicatorSet = ({ newIndicatorSetType }) => {
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { isAppOnline } = useOnlineStatus()
  // const { isSyncInProgress } = useSyncStatus()
  const { indicatorSetId, projectId } = useParams()
  const navigate = useNavigate()
  const isMounted = useIsMounted()
  const currentProjectPath = useCurrentProjectPath()
  const { currentUser } = useCurrentUser()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const { gfcrIndicatorSets, setGfcrIndicatorSets } = useCurrentProject()

  // const [countryOptions, setCountryOptions] = useState([])
  // const [exposureOptions, setExposureOptions] = useState([])
  // const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormDirty, setIsFormDirty] = useState(false)
  // const [reefTypeOptions, setReefTypeOptions] = useState([])
  // const [reefZoneOptions, setReefZoneOptions] = useState([])
  const [saveButtonState, setSaveButtonState] = useState(buttonGroupStates.saved)
  const [indicatorSetBeingEdited, setIndicatorSetBeingEdited] = useState()
  // const [siteDeleteErrorData, setSiteDeleteErrorData] = useState([])
  // const [isDeletingSite, setIsDeletingSite] = useState(false)
  // const [isDeleteRecordModalOpen, setIsDeleteRecordModalOpen] = useState(false)
  // const [currentDeleteRecordModalPage, setCurrentDeleteRecordModalPage] = useState(1)

  const shouldPromptTrigger = isFormDirty && saveButtonState !== buttonGroupStates.saving // we need to prevent the user from seeing the dirty form prompt when a new indicator set is saved (and that triggers a navigation to its new page)
  const indicatorSetType = indicatorSetBeingEdited?.indicator_set_type || newIndicatorSetType

  // const goToPageOneOfDeleteRecordModal = () => {
  //   setCurrentDeleteRecordModalPage(1)
  // }
  // const goToPageTwoOfDeleteRecordModal = () => {
  //   setCurrentDeleteRecordModalPage(2)
  // }
  // const openDeleteRecordModal = () => {
  //   setIsDeleteRecordModalOpen(true)
  // }
  // const closeDeleteRecordModal = () => {
  //   goToPageOneOfDeleteRecordModal()
  //   setIsDeleteRecordModalOpen(false)
  // }

  // const isReadOnlyUser = getIsUserReadOnlyForProject(currentUser, projectId)
  const isAdminUser = getIsUserAdminForProject(currentUser, projectId)

  // const {
  //   persistUnsavedFormData: persistUnsavedFormikData,
  //   clearPersistedUnsavedFormData: clearPersistedUnsavedFormikData,
  //   getPersistedUnsavedFormData: getPersistedUnsavedFormikData,
  // } = useUnsavedDirtyFormDataUtilities(`${currentUser.id}-unsavedIndicatorSetInputs`)

  const _getIndicatorSets = useEffect(() => {
    if (!newIndicatorSetType && databaseSwitchboardInstance && isAppOnline) {
      Promise.all([databaseSwitchboardInstance.getIndicatorSets(projectId)])
        .then(([indicatorSetsResponse]) => {
          if (isMounted.current) {
            setGfcrIndicatorSets(indicatorSetsResponse.results)
            setIsLoading(false)
          }
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.gfcrIndicatorSetsUnavailable))
            },
          })
        })
    }

    if (newIndicatorSetType) {
      setIsLoading(false)
    }
  }, [
    databaseSwitchboardInstance,
    isMounted,
    handleHttpResponseError,
    projectId,
    setGfcrIndicatorSets,
    isAppOnline,
    newIndicatorSetType,
  ])

  const _setIndicatorSet = useEffect(() => {
    if (gfcrIndicatorSets) {
      const indicatorSet = gfcrIndicatorSets.find(
        (indicatorSet) => indicatorSet.id === indicatorSetId,
      )
      setIndicatorSetBeingEdited(indicatorSet)
    }
  }, [gfcrIndicatorSets, indicatorSetId])

  const initialFormValues = useMemo(() => {
    // return getPersistedUnsavedFormikData() ?? getIndicatorSetFormInitialValues(indicatorSetBeingEdited)
    return getIndicatorSetFormInitialValues(indicatorSetBeingEdited)
  }, [indicatorSetBeingEdited])

  const handleFormSubmit = useCallback(
    (formikValues, formikActions) => {
      const { title, report_date, report_year } = formikValues

      const formattedIndicatorSetForApi = {
        ...indicatorSetBeingEdited,
        title,
        report_date,
        report_year,
        indicator_set_type: indicatorSetType,
      }

      setSaveButtonState(buttonGroupStates.saving)
      databaseSwitchboardInstance
        // POST the indicator set if there is no indicator set ID, else PUT it
        .saveIndicatorSet(projectId, formattedIndicatorSetForApi)
        .then((response) => {
          toast.success(...getToastArguments(language.success.gfcrIndicatorSetSave))
          setSaveButtonState(buttonGroupStates.saved)
          setIsFormDirty(false)
          formikActions.resetForm({ values: formikValues }) // this resets formik's dirty state
          // clearPersistedUnsavedFormikData()

          if (indicatorSetType) {
            navigate(`${ensureTrailingSlash(currentProjectPath)}gfcr/${response.id}`)
          }
        })
        .catch((error) => {
          setSaveButtonState(buttonGroupStates.unsaved)

          if (error && isAppOnline) {
            toast.error(...getToastArguments(language.error.gfcrIndicatorSetSave))

            handleHttpResponseError({
              error,
            })
          }
        })
    },
    [
      currentProjectPath,
      databaseSwitchboardInstance,
      handleHttpResponseError,
      indicatorSetBeingEdited,
      isAppOnline,
      indicatorSetType,
      navigate,
      projectId,
    ],
  )

  const formik = useFormik({
    initialValues: initialFormValues,
    enableReinitialize: true,
    onSubmit: handleFormSubmit,
    validate: (values) => {
      // persistUnsavedFormikData(values)
      const errors = {}

      if (!values.title) {
        errors.name = [{ code: language.error.formValidation.required, id: 'Required' }]
      }

      if (!values.report_date) {
        errors.name = [{ code: language.error.formValidation.required, id: 'Required' }]
      }

      // if (!values.country) {
      //   errors.country = [{ code: language.error.formValidation.required, id: 'Required' }]
      // }

      // if (!values.latitude && values.latitude !== 0) {
      //   errors.latitude = [{ code: language.error.formValidation.required, id: 'Required' }]
      // }

      // if (values.latitude > 90 || values.latitude < -90) {
      //   errors.latitude = [{ code: language.error.formValidation.latitude, id: 'Invalid Latitude' }]
      // }

      // if (!values.longitude && values.longitude !== 0) {
      //   errors.longitude = [{ code: language.error.formValidation.required, id: 'Required' }]
      // }

      // if (values.longitude > 180 || values.longitude < -180) {
      //   errors.longitude = [
      //     { code: language.error.formValidation.longitude, id: 'Invalid Longitude' },
      //   ]
      // }

      // if (!values.exposure) {
      //   errors.exposure = [{ code: language.error.formValidation.required, id: 'Required' }]
      // }

      // if (!values.reef_type) {
      //   errors.reef_type = [{ code: language.error.formValidation.required, id: 'Required' }]
      // }

      // if (!values.reef_zone) {
      //   errors.reef_zone = [{ code: language.error.formValidation.required, id: 'Required' }]
      // }

      return errors
    },
  })

  // useDocumentTitle(
  //   `${language.pages.siteForm.title} - ${formik.values.name} - ${language.title.mermaid}`,
  // )

  // const { setFieldValue: formikSetFieldValue } = formik

  const _setSaveButtonUnsaved = useEffect(() => {
    if (isFormDirty) {
      setSaveButtonState(buttonGroupStates.unsaved)
    }
  }, [isFormDirty])

  // const handleLatitudeChange = useCallback(
  //   (value) => {
  //     formikSetFieldValue('latitude', value)
  //   },
  //   [formikSetFieldValue],
  // )

  // const handleLongitudeChange = useCallback(
  //   (value) => {
  //     formikSetFieldValue('longitude', value)
  //   },
  //   [formikSetFieldValue],
  // )

  const _setIsFormDirty = useEffect(
    // () => setIsFormDirty(!!formik.dirty || !!getPersistedUnsavedFormikData()),
    () => setIsFormDirty(!!formik.dirty),
    [formik.dirty],
  )

  // const deleteRecord = () => {
  //   // only available online
  //   setIsDeletingSite(true)

  //   databaseSwitchboardInstance
  //     .deleteSite(siteBeingEdited, projectId)
  //     .then(() => {
  //       clearPersistedUnsavedFormikData()
  //       closeDeleteRecordModal()
  //       setIsDeletingSite(false)
  //       toast.success(...getToastArguments(language.success.getMermaidDataDeleteSuccess('site')))
  //       navigate(`${ensureTrailingSlash(currentProjectPath)}sites/`)
  //     })
  //     .catch((error) => {
  //       const { isSyncError, isDeleteRejectedError } = error

  //       if (isSyncError && !isDeleteRejectedError) {
  //         const toastTitle = language.error.getDeleteOnlineSyncErrorTitle('site')

  //         showSyncToastError({ toastTitle, error, testId: 'site-toast-error' })
  //         setIsDeletingSite(false)
  //         closeDeleteRecordModal()
  //       }

  //       if (isSyncError && isDeleteRejectedError) {
  //         // show modal which lists the associated sumbitted sample units that are associated with the site
  //         setSiteDeleteErrorData(error.associatedSampleUnits)
  //         setIsDeletingSite(false)
  //         goToPageTwoOfDeleteRecordModal()
  //       }
  //       if (!isSyncError) {
  //         handleHttpResponseError({
  //           error,
  //         })
  //       }
  //     })
  // }

  // const displayIdNotFoundErrorPage = idsNotAssociatedWithData.length && !isNewIndicatorSet

  // const contentViewByReadOnlyRole = isNewIndicatorSet ? (
  //   <PageUnavailable mainText={language.error.pageReadOnly} />
  // ) : (
  //   <ReadOnlySiteContent
  //     site={formik.values}
  //     countryOptions={countryOptions}
  //     exposureOptions={exposureOptions}
  //     reefTypeOptions={reefTypeOptions}
  //     reefZoneOptions={reefZoneOptions}
  //     isReadOnlyUser={isReadOnlyUser}
  //     isAppOnline={isAppOnline}
  //   />
  // )

  const contentViewByRole = (
    <>
      <IndicatorSetForm formik={formik} isAppOnline={isAppOnline} />
      {/* {isAdminUser && isAppOnline && (
        <DeleteRecordButton
          currentPage={currentDeleteRecordModalPage}
          errorData={siteDeleteErrorData}
          isLoading={isDeletingSite}
          isNewRecord={isNewIndicatorSet}
          isOpen={isDeleteRecordModalOpen}
          modalText={language.deleteRecord('Site')}
          deleteRecord={deleteRecord}
          onDismiss={closeDeleteRecordModal}
          openModal={openDeleteRecordModal}
        />
      )} */}
      {!isAdminUser && isAppOnline ? (
        <DeleteRecordButtonCautionWrapper>
          <ItalicizedInfo>{language.pages.siteForm.nonAdminDelete}</ItalicizedInfo>
        </DeleteRecordButtonCautionWrapper>
      ) : null}
      {saveButtonState === buttonGroupStates.saving && <LoadingModal />}
      <EnhancedPrompt shouldPromptTrigger={shouldPromptTrigger} />
    </>
  )

  // return displayIdNotFoundErrorPage ? (
  //   <ContentPageLayout
  //     isPageContentLoading={isLoading}
  //     content={<IdsNotFound ids={idsNotAssociatedWithData} />}
  //   />
  // ) : (
  const indicatorSetTypeName = indicatorSetType === 'annual_report' ? 'Annual Report' : 'Target'

  return (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      isToolbarSticky={true}
      subNavNode={{
        name: newIndicatorSetType
          ? language.pages.gfcrIndicatorSetForm.title
          : `${formik.values.title} ${formik.values.report_year}`,
      }}
      content={contentViewByRole}
      toolbar={
        <ContentPageToolbarWrapper>
          {newIndicatorSetType ? (
            <H2>{language.pages.gfcrIndicatorSetForm.title}</H2>
          ) : (
            <H2>{`${formik.values.title} | ${indicatorSetTypeName} | ${formik.values.report_year}`}</H2>
          )}
          <SaveButton
            formId="indicator-set-form"
            saveButtonState={saveButtonState}
            formHasErrors={!!Object.keys(formik.errors).length}
            formDirty={isFormDirty}
          />
        </ContentPageToolbarWrapper>
      }
    />
  )
  // )
}

// ReadOnlySiteContent.propTypes = {
//   site: sitePropType.isRequired,
//   countryOptions: inputOptionsPropTypes.isRequired,
//   exposureOptions: inputOptionsPropTypes.isRequired,
//   reefTypeOptions: inputOptionsPropTypes.isRequired,
//   reefZoneOptions: inputOptionsPropTypes.isRequired,
//   isReadOnlyUser: PropTypes.bool.isRequired,
//   isAppOnline: PropTypes.bool.isRequired,
// }

IndicatorSetForm.propTypes = {
  formik: formikPropType.isRequired,
  isAppOnline: PropTypes.bool.isRequired,
}

// SwapButton.propTypes = {
//   isDisabled: PropTypes.bool.isRequired,
//   handleSwapClick: PropTypes.func.isRequired,
//   swapLabel: PropTypes.string.isRequired,
// }

GfcrIndicatorSet.propTypes = {
  newIndicatorSetType: PropTypes.string,
}

export default GfcrIndicatorSet
