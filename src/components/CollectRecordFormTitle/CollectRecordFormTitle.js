import React from 'react'
import PropTypes from 'prop-types'
import { H2 } from '../generic/text'
import { getObjectById, getProtocolName } from '../../library/utilities'
import {
  fishBeltTransectPropType,
  benthicTransectPropType,
  sitePropType,
} from '../../App/mermaidData/mermaidDataProptypes'

const CollectRecordFormTitle = ({ collectRecordData, sites }) => {
  const collectRecordTitle = []

  const siteId = collectRecordData?.sample_event.site
  const transectType =
    collectRecordData?.protocol === 'fishbelt'
      ? 'fishbelt_transect'
      : 'benthic_transect'

  const defaultTitle = getProtocolName(collectRecordData?.protocol)
  const siteName =
    siteId && sites.length > 0 ? getObjectById(sites, siteId).name : ''
  const transectNumber =
    collectRecordData[transectType]?.number.toString() || ''
  const label = collectRecordData[transectType]?.label || ''

  if (siteName !== '') collectRecordTitle.push(siteName)
  if (transectNumber !== '') collectRecordTitle.push(transectNumber)
  if (label !== '') collectRecordTitle.push(label)

  const collectRecordTitleText =
    collectRecordTitle.length === 0
      ? defaultTitle
      : collectRecordTitle.join(' - ')

  return (
    <H2 id="collect-form-title" aria-label="Collect Form Title">
      {collectRecordTitleText}
    </H2>
  )
}

CollectRecordFormTitle.propTypes = {
  collectRecordData: PropTypes.oneOfType([
    fishBeltTransectPropType,
    benthicTransectPropType,
  ]),
  sites: PropTypes.arrayOf(sitePropType).isRequired,
}

CollectRecordFormTitle.defaultProps = {
  collectRecordData: {},
}

export default CollectRecordFormTitle
