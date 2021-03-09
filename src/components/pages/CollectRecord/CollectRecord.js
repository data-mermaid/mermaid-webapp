import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import SubLayout2 from '../../SubLayout2'
import NavMenu from '../../NavMenu'
import CollectForms from '../../CollectForms'
import { ButtonCallout } from '../../generic/buttons'
import { RowRight } from '../../generic/positioning'
import { mermaidApiServicePropType } from '../../../library/mermaidData/useMermaidData'

/**
 * Describe your component
 */

const CollectRecord = ({ apiService }) => {
  const { recordId } = useParams()
  const { collectRecords, sites, managementRegimes } = apiService

  const filterRecord = (record) =>
    collectRecords.filter(({ id }) => id === record)[0]

  const [curCollectRecord, setCurCollectRecord] = useState(
    filterRecord(recordId),
  )

  const handleInputChange = (e) => {
    const { name, value } = e.target

    const newValue = name === 'depth' ? parseInt(value, 10) : value

    setCurCollectRecord({ ...curCollectRecord, [name]: newValue })
  }

  const saveRecord = () => {}

  return (
    <SubLayout2
      sidebar={<NavMenu />}
      lowerRight={
        <CollectForms
          collectRecord={curCollectRecord}
          sites={sites}
          managementRegimes={managementRegimes}
          handleInputChange={handleInputChange}
        />
      }
      upperRight={
        <RowRight>
          <ButtonCallout onClick={saveRecord}>Save</ButtonCallout>
        </RowRight>
      }
    />
  )
}

CollectRecord.propTypes = {
  apiService: mermaidApiServicePropType.isRequired,
}

export default CollectRecord
