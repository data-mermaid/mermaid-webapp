import React, { useState, useReducer } from 'react'
import PropTypes from 'prop-types'

import CollectRecordFormPageAlternative from '../CollectRecordFormPageAlternative'

const BenthicPitForm = ({ isNewRecord }) => {
  const [collectRecordBeingEdited, setCollectRecordBeingEdited] = useState()
  const [newObservationToAdd, setNewObservationToAdd] = useState()
  const observationsReducer = useReducer(benthicPitObservationReducer, [])
  const [idsNotAssociatedWithData, setIdsNotAssociatedWithData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const handleCollectRecordChange = (updatedCollectRecord) =>
    setCollectRecordBeingEdited(updatedCollectRecord)

  const handleNewObservationAdd = (observationAttributeId) =>
    setNewObservationToAdd(observationAttributeId)

  return (
    <CollectRecordFormPageAlternative
      // choices={choices}
      // handleSubmitNewObservation={onSubmitNewFishSpecies}
      // managementRegimes={managementRegimes}
      // sites={sites}
      // subNavNode={subNavNode}
      // observerProfiles={observerProfiles}
      collectRecordBeingEdited={collectRecordBeingEdited}
      handleCollectRecordChange={handleCollectRecordChange}
      handleNewObservationAdd={handleNewObservationAdd}
      idsNotAssociatedWithData={idsNotAssociatedWithData} // maybe handle this too
      initialFormikFormValues={{}}
      isNewRecord={isNewRecord}
      isParentDataLoading={isLoading}
      modalAttributeOptions={modalAttributeOptions}
      observationOptions={fishNameOptions}
      observationsReducer={observationsReducer}
      ObservationTable={<></>}
      sampleUnitFormatSaveFunction={() => {}}
      sampleUnitName="benthicpit"
      SampleUnitTransectInputs={<></>}
      handleSubmitNewAttribute={() => {}}
    />
  )
}

BenthicPitForm.propTypes = {}

export default BenthicPitForm
