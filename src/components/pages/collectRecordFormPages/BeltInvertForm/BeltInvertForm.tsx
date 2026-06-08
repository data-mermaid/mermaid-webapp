import { toast } from 'react-toastify'
import { useParams } from 'react-router'
import React, { useState, useEffect, useCallback, useReducer, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import {
  getCollectRecordDataInitialValues,
  getSampleInfoInitialValues,
  getTransectInitialValues,
} from '../collectRecordFormInitialValues'
import { getDataForSubNavNode } from '../../../../library/getDataForSubNavNode'
import { getOptions } from '../../../../library/getOptions'
import { getToastArguments } from '../../../../library/getToastArguments'
import { reformatFormValuesIntoBeltInvertRecord } from '../reformatFormValuesIntoRecord'
import { sortArrayByObjectKey } from '../../../../library/arrays/sortArrayByObjectKey'
import { useCurrentUser } from '../../../../App/CurrentUserContext'
import { useDatabaseSwitchboardInstance } from '../../../../App/mermaidData/databaseSwitchboard/DatabaseSwitchboardContext'
import { useHttpResponseErrorHandler } from '../../../../App/HttpResponseErrorHandlerContext'
import { useSyncStatus } from '../../../../App/mermaidData/syncApiDataIntoOfflineStorage/SyncStatusContext'
import { useUnsavedDirtyFormDataUtilities } from '../../../../library/useUnsavedDirtyFormDataUtilities'
import CollectRecordFormPage from '../CollectRecordFormPage'
import ErrorBoundary from '../../../ErrorBoundary'
import beltInvertObservationReducer from './beltInvertObservationReducer'
import BeltInvertObservationTable from './BeltInvertObservationTable'
import BeltInvertTransectInputs from './BeltInvertTransectInputs'
import NewAttributeModal from '../../../NewAttributeModal'
import useIsMounted from '../../../../library/useIsMounted'

interface BeltInvertFormProps {
  isNewRecord?: boolean
}

type NewAttributeModalSubmissionValues =
  | {
      genusId: string
      genusName: string | undefined
      speciesName: string
    }
  | {
      benthicAttributeParentId: string
      benthicAttributeParentName: string | undefined
      newBenthicAttributeName: string
    }

const BeltInvertForm = ({ isNewRecord = true }: BeltInvertFormProps) => {
  const { t } = useTranslation()
  const { recordId, projectId } = useParams()
  const { isSyncInProgress } = useSyncStatus()
  const isMounted = useIsMounted()

  const { databaseSwitchboardInstance } = useDatabaseSwitchboardInstance()
  const handleHttpResponseError = useHttpResponseErrorHandler()
  const observationsReducer = useReducer(beltInvertObservationReducer, [])
  const [areObservationsInputsDirty, setAreObservationsInputsDirty] = useState(false)
  const [collectRecordBeingEdited, setCollectRecordBeingEdited] = useState()
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isNewAttributeModalOpen, setIsNewAttributeModalOpen] = useState(false)
  const [observationIdToAddNewInvertAttributeTo, setObservationIdToAddNewInvertAttributeTo] =
    useState()
  const [observationsState, observationsDispatch] = observationsReducer
  const [sites, setSites] = useState([])
  const [subNavNode, setSubNavNode] = useState(null)
  const [invertAttributes, setInvertAttributes] = useState([])
  const [invertAttributesLoadError, setInvertAttributesLoadError] = useState(false)
  const { currentUser } = useCurrentUser()

  const errorMessage = isNewRecord
    ? t('sample_units.errors.supporting_data_unavailable')
    : t('sample_units.errors.data_unavailable')

  const _getSupportingData = useEffect(() => {
    if (databaseSwitchboardInstance && projectId && !isSyncInProgress) {
      const promises = [
        databaseSwitchboardInstance.getSitesWithoutOfflineDeleted(projectId),
        databaseSwitchboardInstance.getInvertAttributes(),
        databaseSwitchboardInstance.getProject(projectId),
      ]

      if (recordId && !isNewRecord) {
        promises.push(databaseSwitchboardInstance.getCollectRecord(recordId))
      }

      Promise.all(promises)
        .then(
          ([sitesResponse, invertAttributesResponse, projectResponse, collectRecordResponse]) => {
            if (isMounted.current) {
              if (!isNewRecord && !collectRecordResponse && recordId) {
                setIdsNotAssociatedWithData((previousState) => [...previousState, recordId])
              }
              if (!projectResponse && projectId) {
                setIdsNotAssociatedWithData((previousState) =>
                  Array.from(new Set([...previousState, projectId])),
                )
              }

              // Treat only a missing/invalid response as load failure.
              if (!Array.isArray(invertAttributesResponse)) {
                setInvertAttributesLoadError(true)
                toast.error(
                  ...getToastArguments(
                    t('macroinvertebrate_observations.species_taxonomy_unavailable'),
                  ),
                )
              } else {
                setInvertAttributesLoadError(false)
                setInvertAttributes(invertAttributesResponse)
              }

              setSubNavNode(
                getDataForSubNavNode({
                  isNewRecord,
                  collectRecord: collectRecordResponse,
                  sites: sitesResponse,
                  protocol: collectRecordResponse?.data.protocol,
                }),
              )

              setSites(sortArrayByObjectKey(sitesResponse, 'name'))
              setCollectRecordBeingEdited(collectRecordResponse)
              setIsLoading(false)
            }
          },
        )
        .catch((error) => {
          if (isMounted.current) {
            setInvertAttributesLoadError(true)
            handleHttpResponseError({
              error,
              callback: () => {
                toast.error(...getToastArguments(errorMessage))
              },
            })
          }
        })
    }
  }, [
    databaseSwitchboardInstance,
    isMounted,
    isNewRecord,
    recordId,
    projectId,
    handleHttpResponseError,
    isSyncInProgress,
    errorMessage,
    t,
  ])

  const { getPersistedUnsavedFormData: getPersistedUnsavedFormikData } =
    useUnsavedDirtyFormDataUtilities(`${currentUser.id}-unsavedSampleInfoInputs`)

  const initialFormikFormValues = useMemo(() => {
    const collectRecordInitialValues = getPersistedUnsavedFormikData() ?? {
      ...getCollectRecordDataInitialValues(collectRecordBeingEdited),
      ...getSampleInfoInitialValues(collectRecordBeingEdited),
    }

    return (
      getPersistedUnsavedFormikData() ?? {
        ...collectRecordInitialValues,
        ...getTransectInitialValues(collectRecordBeingEdited, 'beltinvert_transect'),
      }
    )
  }, [collectRecordBeingEdited, getPersistedUnsavedFormikData])

  const handleCollectRecordChange = (collectRecordResponse) => {
    setCollectRecordBeingEdited(collectRecordResponse)
    setSubNavNode(
      getDataForSubNavNode({
        isNewRecord,
        collectRecord: collectRecordResponse,
        sites,
        protocol: collectRecordResponse.data.protocol,
      }),
    )
  }

  const closeNewAttributeModal = () => {
    setIsNewAttributeModalOpen(false)
  }

  const updateInvertAttributesStateWithOfflineStorageData = useCallback(() => {
    if (databaseSwitchboardInstance) {
      databaseSwitchboardInstance.getInvertAttributes().then((invertAttributesResponse) => {
        setInvertAttributes(invertAttributesResponse)
      })
    }
  }, [databaseSwitchboardInstance])

  const invertAttributeParentOptions = useMemo(() => {
    // Filter to only genus-level attributes for species creation
    const genusList = invertAttributes.filter((attr) => attr.taxonomic_rank === 'genus')
    return getOptions(genusList)
  }, [invertAttributes])

  const onSubmitNewInvertAttribute = (
    submissionValues: NewAttributeModalSubmissionValues,
  ): Promise<void> => {
    if (!('genusId' in submissionValues)) {
      return Promise.reject(new Error('Unexpected submission payload for macroinvertebrate'))
    }

    const { genusId, genusName, speciesName } = submissionValues

    return databaseSwitchboardInstance
      .addInvertSpecies({
        genusId,
        genusName,
        speciesName,
      })
      .then((newInvertSpecies) => {
        observationsDispatch({
          type: 'updateInvertName',
          payload: {
            observationId: observationIdToAddNewInvertAttributeTo,
            newInvertAttribute: newInvertSpecies.id,
          },
        })
        updateInvertAttributesStateWithOfflineStorageData()
        toast.success(
          ...getToastArguments(
            t('macroinvertebrate_observations.proposed_species_saved', {
              attributeName: `${genusName} ${speciesName}`,
            }),
          ),
        )
        setIsNewAttributeModalOpen(false)
      })
      .catch((error) => {
        const errorMessage = error.message || t('sample_units.errors.please_try_again')
        if (error.message === 'Invert species already exists') {
          const existingSpeciesName = error.existingSpecies?.name
          toast.error(
            ...getToastArguments(
              t('macroinvertebrate_observations.proposed_species_already_exists', {
                attributeName: existingSpeciesName,
              }),
            ),
          )
        } else {
          toast.error(...getToastArguments(errorMessage))
        }
        throw error
      })
  }

  const PartiallyAppliedBeltInvertObservationTable = useCallback(
    (props) => {
      return (
        <BeltInvertObservationTable
          invertAttributes={invertAttributes}
          invertAttributesLoadError={invertAttributesLoadError}
          setIsNewInvertAttributeModalOpen={setIsNewAttributeModalOpen}
          setObservationIdToAddNewInvertAttributeTo={setObservationIdToAddNewInvertAttributeTo}
          {...props}
        />
      )
    },
    [
      invertAttributes,
      invertAttributesLoadError,
      setIsNewAttributeModalOpen,
      setObservationIdToAddNewInvertAttributeTo,
    ],
  )

  const PartiallyAppliedBeltInvertTransectInputs = useCallback(
    (props) => {
      return (
        <BeltInvertTransectInputs
          observationsState={observationsState}
          observationsDispatch={observationsDispatch}
          {...props}
        />
      )
    },
    [observationsDispatch, observationsState],
  )

  return (
    <ErrorBoundary>
      <CollectRecordFormPage
        areObservationsInputsDirty={areObservationsInputsDirty}
        collectRecordBeingEdited={collectRecordBeingEdited}
        handleCollectRecordChange={handleCollectRecordChange}
        idsNotAssociatedWithData={idsNotAssociatedWithData}
        initialFormikFormValues={initialFormikFormValues}
        isNewRecord={isNewRecord}
        isParentDataLoading={isLoading}
        observationsTable1Reducer={observationsReducer}
        ObservationTable1={PartiallyAppliedBeltInvertObservationTable}
        sampleUnitFormatSaveFunction={reformatFormValuesIntoBeltInvertRecord}
        sampleUnitName="macroinvertebrate"
        SampleUnitTransectInputs={PartiallyAppliedBeltInvertTransectInputs}
        setAreObservationsInputsDirty={setAreObservationsInputsDirty}
        setIdsNotAssociatedWithData={setIdsNotAssociatedWithData}
        setIsNewBenthicAttributeModalOpen={setIsNewAttributeModalOpen as () => void}
        setObservationIdToAddNewBenthicAttributeTo={
          setObservationIdToAddNewInvertAttributeTo as () => void
        }
        subNavNode={subNavNode}
      />
      {!!projectId && !!currentUser && (
        <NewAttributeModal
          sampleUnit="macroinvertebrate"
          isOpen={isNewAttributeModalOpen}
          onDismiss={closeNewAttributeModal}
          onSubmit={onSubmitNewInvertAttribute}
          modalAttributeOptions={invertAttributeParentOptions}
        />
      )}
    </ErrorBoundary>
  )
}

export default BeltInvertForm
