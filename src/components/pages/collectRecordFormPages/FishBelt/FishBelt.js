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
import { InputWrapper } from '../../../generic/form'
import { reformatFormValuesIntoFishBeltRecord } from './reformatFormValuesIntoFishbeltRecord'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useUnsavedDirtyFormDataUtilities } from '../useUnsavedDirtyFormUtilities'
import DeleteRecordConfirm from '../DeleteRecordConfirm/DeleteRecordConfirm'
import EditCollectRecordFormTitle from '../../../EditCollectRecordFormTitle'
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

  const updateFishNameOptionsState = useCallback(
    ({ species, genera, families }) => {
      const speciesOptions = species.map(({ id, display_name }) => ({
        label: display_name,
        value: id,
      }))

      const generaAndFamiliesOptions = [...genera, ...families].map(
        ({ id, name }) => ({
          label: name,
          value: id,
        }),
      )

      if (isMounted.current) {
        setFishNameOptions([...speciesOptions, ...generaAndFamiliesOptions])
      }
    },
    [isMounted],
  )

  const updateFishNameConstantsState = useCallback(
    ({ species, genera, families }) => {
      const fishNameMungedObject = [...species, ...genera, ...families]

      const fishNameMungedConstants = fishNameMungedObject.map(
        ({
          id,
          biomass_constant_a,
          biomass_constant_b,
          biomass_constant_c,
        }) => ({
          id,
          biomass_constant_a,
          biomass_constant_b,
          biomass_constant_c,
        }),
      )

      if (isMounted.current) {
        setFishNameConstants(fishNameMungedConstants)
      }
    },
    [isMounted],
  )

  const updateFishNameOptionsStateWithOfflineStorageData = useCallback(() => {
    if (databaseSwitchboardInstance) {
      Promise.all([
        databaseSwitchboardInstance.getFishSpecies(),
        databaseSwitchboardInstance.getFishGenera(),
        databaseSwitchboardInstance.getFishFamilies(),
      ]).then(([species, genera, families]) => {
        updateFishNameOptionsState({ species, genera, families })
      })
    }
  }, [updateFishNameOptionsState, databaseSwitchboardInstance])

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance) {
      const promises = [
        databaseSwitchboardInstance.getSites(),
        databaseSwitchboardInstance.getManagementRegimes(),
        databaseSwitchboardInstance.getChoices(),
        databaseSwitchboardInstance.getProjectProfiles(),
        databaseSwitchboardInstance.getFishSpecies(),
        databaseSwitchboardInstance.getFishGenera(),
        databaseSwitchboardInstance.getFishFamilies(),
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
            species,
            genera,
            families,

            // collectRecord needs to be last in array because its pushed to the promise array conditionally
            collectRecordResponse,
          ]) => {
            if (isMounted.current) {
              setSites(sitesResponse)
              setManagementRegimes(managementRegimesResponse)
              setChoices(choicesResponse)
              setObserverProfiles(projectProfilesResponse.results)
              setCollectRecordBeingEdited(collectRecordResponse)
              updateFishNameOptionsState({
                species,
                genera,
                families,
              })
              updateFishNameConstantsState({ species, genera, families })
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
  }, [
    databaseSwitchboardInstance,
    isMounted,
    isNewRecord,
    recordId,
    updateFishNameConstantsState,
    updateFishNameOptionsState,
  ])

  const {
    persistUnsavedFormData,
    clearPersistedUnsavedFormData,
    getPersistedUnsavedFormData,
  } = useUnsavedDirtyFormDataUtilities('unsavedFishbeltForm')

  const deleteRecord = () => {
    if (!isNewRecord) {
      databaseSwitchboardInstance
        .deleteFishBelt({
          record: collectRecordBeingEdited,
          profileId: currentUser.id,
          projectId,
        })
        .then(() => {
          clearPersistedUnsavedFormData()
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
        clearPersistedUnsavedFormData()
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
    const addSpeciesSelectionToObservation = (speciesId) => {
      observationsDispatch({
        type: 'updateFishName',
        payload: {
          observationId: observationToAddSpeciesTo,
          newFishName: speciesId,
        },
      })
      updateFishNameOptionsStateWithOfflineStorageData()
    }

    databaseSwitchboardInstance
      .addFishSpecies({
        genusId,
        genusName,
        speciesName,
      })
      .then((newFishSpecies) => {
        addSpeciesSelectionToObservation(newFishSpecies.id)
        toast.success(language.success.fishSpeciesSave)
      })
      .catch((error) => {
        if (error.message === 'Species already exists') {
          toast.warning(language.error.fishSpeciesAlreadyExists)
          addSpeciesSelectionToObservation(error.existingSpecies.id)
        } else {
          toast.error(language.error.fishSpeciesSave)
        }
      })

    return Promise.resolve()
  }
  // note: observations doesnt use formik
  const initialFormikFormValues = useMemo(
    () =>
      getPersistedUnsavedFormData() ?? {
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
    [collectRecordBeingEdited, getPersistedUnsavedFormData],
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
      persistUnsavedFormData(values)
    },
    onSubmit: saveRecord,
  }

  return (
    <>
      <Formik {...formikOptions}>
        {(formik) => (
          <ContentPageLayout
            isLoading={isLoading}
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
                  <InputWrapper>
                    <H2>Observers Placeholder</H2>
                    <br />
                    <br />
                    <br />
                  </InputWrapper>
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
                  <EditCollectRecordFormTitle
                    collectRecord={collectRecordBeingEdited}
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
