import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { useParams, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useMemo, useCallback } from 'react'

import { buttonGroupStates } from '../../../../library/buttonGroupStates'
import { ContentPageLayout } from '../../../Layout'
import { ContentPageToolbarWrapper } from '../../../Layout/subLayouts/ContentPageLayout/ContentPageLayout'
import { ensureTrailingSlash } from '../../../../library/strings/ensureTrailingSlash'
import { getIsUserAdminForProject } from '../../../../App/currentUserProfileHelpers'
import { getIndicatorSetFormInitialValues } from './indicatorSetFormInitialValues'
import { getToastArguments } from '../../../../library/getToastArguments'
import { useCurrentUser } from '../../../../App/CurrentUserContext'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import { useOnlineStatus } from '../../../../library/onlineStatusContext'
import EnhancedPrompt from '../../../generic/EnhancedPrompt'
import language from '../../../../language'
import LoadingModal from '../../../LoadingModal/LoadingModal'
import SaveButton from '../../../generic/SaveButton'
import useCurrentProjectPath from '../../../../library/useCurrentProjectPath'
import useIsMounted from '../../../../library/useIsMounted'
import { useCurrentProject } from '../../../../App/CurrentProjectContext'
import GfcrIndicatorSetNav from '../GfcrIndicatorSetNav'
import GfcrIndicatorSetForm from '../GfcrIndicatorSetForm/GfcrIndicatorSetForm'
import IndicatorSetTitle from './IndicatorSetTitle'
import { GfcrPageUnavailablePadding } from '../Gfcr/Gfcr.styles'
import PageUnavailable from '../../PageUnavailable'
import IdsNotFound from '../../IdsNotFound/IdsNotFound'

// const ReadOnlySiteContent = ({
//   site,
//   countryOptions,
//   exposureOptions,
//   reefTypeOptions,
//   reefZoneOptions,
//   isReadOnlyUser,
//   isAppOnline,
// }) => {
//   const { country, latitude, longitude, exposure, reef_type, reef_zone, notes } = site

//   return (
//     <>
//       <Table>
//         <tbody>
//           <TableRowItem title="Country" options={countryOptions} value={country} />
//           <TableRowItem title="Latitude" value={latitude} />
//           <TableRowItem title="Longitude" value={longitude} />
//           <TableRowItem title="Exposure" options={exposureOptions} value={exposure} />
//           <TableRowItem title="Reef Type" options={reefTypeOptions} value={reef_type} />
//           <TableRowItem title="Reef Zone" options={reefZoneOptions} value={reef_zone} />
//           <TableRowItem title="Notes" value={notes} isAllowNewlines={true} />
//         </tbody>
//       </Table>
//       {isAppOnline && (
//         <SingleSiteMap
//           formLatitudeValue={latitude}
//           formLongitudeValue={longitude}
//           isReadOnlyUser={isReadOnlyUser}
//         />
//       )}
//     </>
//   )
// }

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
  const [selectedNavItem, setSelectedNavItem] = useState('indicator-set')

  const shouldPromptTrigger = isFormDirty && saveButtonState !== buttonGroupStates.saving // we need to prevent the user from seeing the dirty form prompt when a new indicator set is saved (and that triggers a navigation to its new page)
  const indicatorSetType = indicatorSetBeingEdited?.indicator_set_type || newIndicatorSetType
  const indicatorSetTypeName = indicatorSetType === 'annual_report' ? 'Annual Report' : 'Target'

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
          }

          setIsLoading(false)
        })
        .catch((error) => {
          handleHttpResponseError({
            error,
            callback: () => {
              toast.error(...getToastArguments(language.error.gfcrIndicatorSetsUnavailable))
            },
          })

          setIsLoading(false)
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
    return getIndicatorSetFormInitialValues(indicatorSetBeingEdited)
  }, [indicatorSetBeingEdited])

  const handleFormSubmit = useCallback(
    async (formikValues, formikActions, updateFromCalcValues = false) => {
      /* prettier-ignore */
      const formattedIndicatorSetForApi = {
        ...indicatorSetBeingEdited,
        ...formikValues,
        indicator_set_type: indicatorSetType,
      }

      setSaveButtonState(buttonGroupStates.saving)
      try {
        let response = await databaseSwitchboardInstance.saveIndicatorSet(
          projectId,
          formattedIndicatorSetForApi,
        )

        if (updateFromCalcValues) {
          // Do another PUT, using the calc values as the F4 values
          response = await databaseSwitchboardInstance.saveIndicatorSet(projectId, {
            ...response,
            f4_1: response.f4_1_calc || 0,
            f4_2: response.f4_2_calc || 0,
            f4_3: response.f4_3_calc || 0,
          })
        }

        setSaveButtonState(buttonGroupStates.saved)
        setIsFormDirty(false)
        formikActions.resetForm({ values: formikValues }) // this resets formik's dirty state

        setIndicatorSetBeingEdited(response)

        if (newIndicatorSetType) {
          navigate(`${ensureTrailingSlash(currentProjectPath)}gfcr/${response.id}`)
        }
        toast.success(...getToastArguments(language.success.gfcrIndicatorSetSave))
      } catch (error) {
        setSaveButtonState(buttonGroupStates.unsaved)

        if (error && isAppOnline) {
          toast.error(...getToastArguments(language.error.gfcrIndicatorSetSave))

          handleHttpResponseError({
            error,
          })
        }
      }
    },
    [
      indicatorSetBeingEdited,
      indicatorSetType,
      databaseSwitchboardInstance,
      projectId,
      newIndicatorSetType,
      navigate,
      currentProjectPath,
      isAppOnline,
      handleHttpResponseError,
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

  const contentViewByRole = isAdminUser ? (
    <div
      style={{
        display: 'flex',
      }}
    >
      <GfcrIndicatorSetNav
        selectedNavItem={selectedNavItem}
        setSelectedNavItem={setSelectedNavItem}
      />
      <GfcrIndicatorSetForm
        formik={formik}
        indicatorSet={indicatorSetBeingEdited}
        selectedNavItem={selectedNavItem}
        indicatorSetType={indicatorSetType}
        handleFormSubmit={handleFormSubmit}
      />
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
      {/* {!isAdminUser && isAppOnline ? (
        // <DeleteRecordButtonCautionWrapper>
        //   <ItalicizedInfo>{language.pages.siteForm.nonAdminDelete}</ItalicizedInfo>
        // </DeleteRecordButtonCautionWrapper>
      ) : null} */}
      {saveButtonState === buttonGroupStates.saving && <LoadingModal />}
      <EnhancedPrompt shouldPromptTrigger={shouldPromptTrigger} />
    </div>
  ) : (
    <GfcrPageUnavailablePadding>
      <PageUnavailable mainText={language.error.pageAdminOnly} />
    </GfcrPageUnavailablePadding>
  )

  const displayIdNotFoundErrorPage = !indicatorSetBeingEdited && !newIndicatorSetType

  return displayIdNotFoundErrorPage ? (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      content={<IdsNotFound ids={indicatorSetId} />}
    />
  ) : (
    <ContentPageLayout
      isPageContentLoading={isLoading}
      isToolbarSticky={true}
      subNavNode={{
        name: newIndicatorSetType
          ? language.pages.gfcrIndicatorSet.title
          : `${formik.values.title} ${formik.values.report_year}`,
      }}
      content={contentViewByRole}
      toolbar={
        <ContentPageToolbarWrapper>
          <IndicatorSetTitle
            indicatorSetTitle={formik.values.title}
            type={indicatorSetTypeName}
            reportingYear={formik.values.report_year}
            isNew={!!newIndicatorSetType}
          />
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
}

GfcrIndicatorSet.propTypes = {
  newIndicatorSetType: PropTypes.string,
}

export default GfcrIndicatorSet
