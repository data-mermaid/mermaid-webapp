import React from 'react'
// import PropTypes from 'prop-types'
import SubLayout2 from '../../SubLayout2'
import CollectingNav from '../../CollectingNav'
import SelectInputForm from '../../generic/SelectInputForm'
import { mermaidApiServicePropType } from '../../../ApiServices/useMermaidApi'

/**
 * Describe your component
 */

// this will be a separate component soon...
const CollectBody = ({ apiService }) => {
  const { sites, management_regimes } = apiService

  return (
    <>
      <SelectInputForm key="sites" label={'Site'} options={sites} />
      <SelectInputForm
        key="management_regimes"
        label={'Management Regime'}
        options={management_regimes}
      />
    </>
  )
}

const CollectRecord = ({ apiService }) => {
  return (
    <SubLayout2
      lowerLeft={<CollectingNav />}
      lowerRight={<CollectBody apiService={apiService} />}
      upperRight={<>Sub layout top bar</>}
    />
  )
}

CollectRecord.propTypes = {
  apiService: mermaidApiServicePropType.isRequired,
}

export default CollectRecord
