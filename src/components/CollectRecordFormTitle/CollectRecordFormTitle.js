import React from 'react'
import PropTypes from 'prop-types'
import { H2 } from '../generic/text'
import { getObjectById, getProtocolName } from '../../library/utilities'
import {
  collectFishBeltRecordPropType,
  sitePropType,
} from '../../App/mermaidData/mermaidDataProptypes'

const CollectRecordFormTitle = ({ collectRecordData, sites }) => {
  const collectRecordTitle = []

  const siteId = collectRecordData?.sample_event.site
  const siteName =
    siteId && sites.length > 0 ? getObjectById(sites, siteId).name : ''
  const transectName =
    collectRecordData?.fishbelt_transect?.number.toString() || ''
  const labelName = collectRecordData?.fishbelt_transect?.label || ''
  const defaultName = getProtocolName(collectRecordData?.protocol)

  if (siteName !== '') collectRecordTitle.push(siteName)
  if (transectName !== '') collectRecordTitle.push(transectName)
  if (labelName !== '') collectRecordTitle.push(labelName)

  const collectRecordTitleText =
    collectRecordTitle.length === 0
      ? defaultName
      : collectRecordTitle.join(' - ')

  return <H2 id="fishbelt-form-title">{collectRecordTitleText}</H2>
}

CollectRecordFormTitle.propTypes = {
  collectRecordData: collectFishBeltRecordPropType,
  sites: PropTypes.arrayOf(sitePropType).isRequired,
}

CollectRecordFormTitle.defaultProps = {
  collectRecordData: {},
}

export default CollectRecordFormTitle
