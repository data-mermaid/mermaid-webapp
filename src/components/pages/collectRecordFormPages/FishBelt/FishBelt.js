import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { useHistory, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'

import styled from 'styled-components/macro'
import {
  getCollectRecordDataInitialValues,
  getSampleInfoInitialValues,
  getTransectInitialValues,
} from '../collectRecordFormInitialValues'
import { ButtonCallout, ButtonCaution } from '../../../generic/buttons'
import { ContentPageLayout } from '../../../Layout'
import { currentUserPropType } from '../../../../App/mermaidData/mermaidDataProptypes'
import { ensureTrailingSlash } from '../../../../library/strings/ensureTrailingSlash'
import { getFishBinLabel } from './fishBeltBins'
import { H2 } from '../../../generic/text'
import { IconSave, IconCheck, IconUpload } from '../../../icons'
import { reformatFormValuesIntoFishBeltRecord } from './reformatFormValuesIntoFishbeltRecord'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useUnsavedDirtyFormDataUtilities } from '../useUnsavedDirtyFormUtilities'
import DeleteRecordConfirm from '../DeleteRecordConfirm/DeleteRecordConfirm'
import RecordFormTitle from '../../../RecordFormTitle'
import fishbeltObservationReducer from './fishbeltObservationReducer'
import FishBeltObservationTable from './FishBeltObservationTable'
import FishBeltTransectInputs from './FishBeltTransectInputs'
import language from '../../../../language'
import NewFishSpeciesModal from '../../../NewFishSpeciesModal/NewFishSpeciesModal'
import ObserversInput from '../../../ObserversInput'
import OfflineHide from '../../../generic/OfflineHide'
import SampleInfoInputs from '../../../SampleInfoInputs'
import useCurrentProjectPath from '../../../../library/useCurrentProjectPath'
import useIsMounted from '../../../../library/useIsMounted'
import { getFishNameConstants } from '../../../../App/mermaidData/getFishNameConstants'
import { getFishNameOptions } from '../../../../App/mermaidData/getFishNameOptions'

/*
  Fishbelt component lets a user edit and delete a record as well as create a new record.
*/
const CollectRecordToolbarWrapper = styled('div')`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
`
const SaveValidateSubmitButtonWrapper = styled('div')`
  justify-self: end;
  button {
    white-space: nowrap;
    margin-left: 1px;
  }
`

const FishBelt = ({ isNewRecord, currentUser }) => {
  const [choices, setChoices] = useState({})
  const [collectRecordBeingEdited, setCollectRecordBeingEdited] = useState()
  const [fishNameOptions, setFishNameOptions] = useState([])
  const [fishNameConstants, setFishNameConstants] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isNewFishNameModalOpen, setIsNewFishNameModalOpen] = useState(false)
  const [managementRegimes, setManagementRegimes] = useState([])
  const [observationToAddSpeciesTo, setObservationToAddSpeciesTo] = useState()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [sites, setSites] = useState([])
  const [observerProfiles, setObserverProfiles] = useState([])
  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const { recordId, projectId } = useParams()
  const currentProjectPath = useCurrentProjectPath()
  const history = useHistory()
  const isMounted = useIsMounted()

  const openNewFishNameModal = (observationId) => {
    setObservationToAddSpeciesTo(observationId)
    setIsNewFishNameModalOpen(true)
  }
  const closeNewFishNameModal = () => {
    setIsNewFishNameModalOpen(false)
  }

  const showDeleteConfirmPrompt = () => {
    setShowDeleteModal(true)
  }
  const closeDeleteConfirmPrompt = () => {
    setShowDeleteModal(false)
  }
  const observationsReducer = useReducer(fishbeltObservationReducer, [])
  const [observationsState, observationsDispatch] = observationsReducer

  const updateFishNameOptionsStateWithOfflineStorageData = useCallback(() => {
    if (databaseSwitchboardInstance) {
      Promise.all([
        databaseSwitchboardInstance.getFishSpecies(),
        databaseSwitchboardInstance.getFishGenera(),
        databaseSwitchboardInstance.getFishFamilies(),
      ]).then(([species, genera, families]) => {
        const updateFishNameOptions = getFishNameOptions({
          species,
          genera,
          families,
        })

        setFishNameOptions(updateFishNameOptions)
      })
    }
  }, [databaseSwitchboardInstance])

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance && projectId) {
      const promises = [
        databaseSwitchboardInstance.getSites(projectId),
        databaseSwitchboardInstance.getManagementRegimes(projectId),
        databaseSwitchboardInstance.getChoices(),
        databaseSwitchboardInstance.getProjectProfiles(),
        databaseSwitchboardInstance.getFishSpecies(),
        databaseSwitchboardInstance.getFishGenera(),
        databaseSwitchboardInstance.getFishFamilies(),
      ]

      if (recordId && !isNewRecord) {
        promises.push(
          databaseSwitchboardInstance.getCollectRecord({
            id: recordId,
            projectId,
          }),
        )
      }
      Promise.all(promises)
        .then(
          ([
            sitesResponse,
            managementRegimesResponse,
            choicesResponse,
            projectProfilesResponse,
            species,
            genera,
            families,

            // collectRecord needs to be last in array because its pushed to the promise array conditionally
            collectRecordResponse,
          ]) => {
            if (isMounted.current) {
              const updateFishNameConstants = getFishNameConstants({
                species,
                genera,
                families,
              })

              const updateFishNameOptions = getFishNameOptions({
                species,
                genera,
                families,
              })

              setSites(sitesResponse)
              setManagementRegimes(managementRegimesResponse)
              setChoices(choicesResponse)
              setObserverProfiles(projectProfilesResponse)
              setCollectRecordBeingEdited(collectRecordResponse)
              setFishNameConstants(updateFishNameConstants)
              setFishNameOptions(updateFishNameOptions)
              setIsLoading(false)
            }
          },
        )
        .catch(() => {
          const error = isNewRecord
            ? language.error.collectRecordChoicesUnavailable
            : language.error.collectRecordUnavailable

          toast.error(error)
        })
    }
  }, [databaseSwitchboardInstance, isMounted, isNewRecord, recordId, projectId])

  const {
    persistUnsavedFormData: persistUnsavedFormikData,
    clearPersistedUnsavedFormData: clearPersistedUnsavedFormikData,
    getPersistedUnsavedFormData: getPersistedUnsavedFormikData,
  } = useUnsavedDirtyFormDataUtilities('unsavedFishbeltFormik')

  const persistUnsavedObservationsUtilities = useUnsavedDirtyFormDataUtilities(
    'unsavedFishbeltObservations',
  )

  const {
    clearPersistedUnsavedFormData: clearPersistedUnsavedObservationsData,
  } = persistUnsavedObservationsUtilities

  const deleteRecord = () => {
    if (!isNewRecord) {
      databaseSwitchboardInstance
        .deleteFishBelt({
          record: collectRecordBeingEdited,
          profileId: currentUser.id,
          projectId,
        })
        .then(() => {
          clearPersistedUnsavedFormikData()
          clearPersistedUnsavedObservationsData()
          toast.success(language.success.collectRecordDelete)
          history.push(`${ensureTrailingSlash(currentProjectPath)}collecting`)
        })
        .catch(() => {
          toast.error(language.error.collectRecordDelete)
          closeDeleteConfirmPrompt()
        })
    }
  }
  const saveRecord = (formikValues) => {
    const recordToSubmit = reformatFormValuesIntoFishBeltRecord(
      formikValues,
      observationsState,
      collectRecordBeingEdited,
    )

    databaseSwitchboardInstance
      .saveFishBelt({
        record: recordToSubmit,
        profileId: currentUser.id,
        projectId,
      })
      .then((response) => {
        toast.success(language.success.collectRecordSave)
        clearPersistedUnsavedFormikData()
        clearPersistedUnsavedObservationsData()
        if (isNewRecord) {
          history.push(
            `${ensureTrailingSlash(history.location.pathname)}${response.id}`,
          )
        }
      })
      .catch(() => {
        toast.error(language.error.collectRecordSave)
      })
  }

  const handleNewFishSpeciesOnSubmit = ({
    genusId,
    genusName,
    speciesName,
  }) => {
    databaseSwitchboardInstance
      .addFishSpecies({
        genusId,
        genusName,
        speciesName,
      })
      .then((newFishSpecies) => {
        observationsDispatch({
          type: 'updateFishName',
          payload: {
            observationId: observationToAddSpeciesTo,
            newFishName: newFishSpecies.id,
          },
        })
        updateFishNameOptionsStateWithOfflineStorageData()
        toast.success(language.success.fishSpeciesSave)
      })
      .catch((error) => {
        if (error.message === 'Species already exists') {
          toast.warning(language.error.fishSpeciesAlreadyExists)

          observationsDispatch({
            type: 'updateFishName',
            payload: {
              observationId: observationToAddSpeciesTo,
              newFishName: error.existingSpecies.id,
            },
          })
        } else {
          toast.error(language.error.fishSpeciesSave)
        }
      })

    return Promise.resolve()
  }
  // note: observations doesn't use formik, maybe it could have
  const initialFormikFormValues = useMemo(
    () =>
      getPersistedUnsavedFormikData() ?? {
        ...getCollectRecordDataInitialValues(collectRecordBeingEdited),
        ...getSampleInfoInitialValues(
          collectRecordBeingEdited,
          'fishbelt_transect',
        ),
        ...getTransectInitialValues(
          collectRecordBeingEdited,
          'fishbelt_transect',
        ),
      },
    [collectRecordBeingEdited, getPersistedUnsavedFormikData],
  )

  const handleSizeBinChange = (sizeBinId) => {
    const fishBinSelectedLabel = getFishBinLabel(choices, sizeBinId)

    const isSizeBinATypeThatRequiresSizeResetting = fishBinSelectedLabel !== '1'

    if (isSizeBinATypeThatRequiresSizeResetting) {
      observationsDispatch({ type: 'resetFishSizes' })
    }
  }

  const formikOptions = {
    initialValues: initialFormikFormValues,
    enableReinitialize: true,
    validate: (values) => {
      persistUnsavedFormikData(values)
    },
    onSubmit: saveRecord,
  }

  return (
    <>
      <Formik {...formikOptions}>
        {(formik) => (
          <ContentPageLayout
            isPageContentLoading={isLoading}
            content={
              <>
                <form
                  id="fishbelt-form"
                  aria-labelledby="fishbelt-form-title"
                  onSubmit={formik.handleSubmit}
                >
                  <SampleInfoInputs
                    formik={formik}
                    sites={sites}
                    managementRegimes={managementRegimes}
                  />
                  <FishBeltTransectInputs
                    formik={formik}
                    choices={choices}
                    onSizeBinChange={handleSizeBinChange}
                  />
                  <ObserversInput
                    formik={formik}
                    observers={observerProfiles}
                  />
                  <FishBeltObservationTable
                    choices={choices}
                    collectRecord={collectRecordBeingEdited}
                    fishBinSelected={formik.values.size_bin}
                    fishNameConstants={fishNameConstants}
                    fishNameOptions={fishNameOptions}
                    observationsReducer={observationsReducer}
                    openNewFishNameModal={openNewFishNameModal}
                    transectLengthSurveyed={formik.values.len_surveyed}
                    widthId={formik.values.width}
                    persistUnsavedObservationsUtilities={
                      persistUnsavedObservationsUtilities
                    }
                  />
                </form>
                <ButtonCaution
                  onClick={showDeleteConfirmPrompt}
                  disabled={isNewRecord}
                >
                  Delete Record
                </ButtonCaution>
                <DeleteRecordConfirm
                  isOpen={showDeleteModal}
                  onDismiss={closeDeleteConfirmPrompt}
                  onConfirm={deleteRecord}
                />
              </>
            }
            toolbar={
              <CollectRecordToolbarWrapper>
                {isNewRecord && <H2>Fish Belt</H2>}
                {collectRecordBeingEdited && !isNewRecord && (
                  <RecordFormTitle
                    submittedRecordOrCollectRecordDataProperty={
                      collectRecordBeingEdited.data
                    }
                    sites={sites}
                  />
                )}

                <SaveValidateSubmitButtonWrapper data-testid="fishbelt-form-buttons">
                  <ButtonCallout type="submit" form="fishbelt-form">
                    <IconSave />
                    Save
                  </ButtonCallout>
                  {!isNewRecord && (
                    <OfflineHide>
                      <ButtonCallout>
                        <IconCheck />
                        Validate
                      </ButtonCallout>
                      <ButtonCallout>
                        <IconUpload />
                        Submit
                      </ButtonCallout>
                    </OfflineHide>
                  )}
                </SaveValidateSubmitButtonWrapper>
              </CollectRecordToolbarWrapper>
            }
          />
        )}
      </Formik>
      {!!projectId && !!currentUser && (
        <NewFishSpeciesModal
          isOpen={isNewFishNameModalOpen}
          onDismiss={closeNewFishNameModal}
          onSubmit={handleNewFishSpeciesOnSubmit}
          currentUser={currentUser}
          projectId={projectId}
        />
      )}
    </>
  )
}

FishBelt.propTypes = {
  currentUser: currentUserPropType.isRequired,
  isNewRecord: PropTypes.bool,
}

FishBelt.defaultProps = {
  isNewRecord: true,
}

export default FishBelt
