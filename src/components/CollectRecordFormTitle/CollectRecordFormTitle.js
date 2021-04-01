import React from 'react'
import PropTypes from 'prop-types'
import { H2 } from '../generic/text'

const CollectRecordFormTitle = ({
  protocol,
  siteValue,
  transectVal,
  labelVal,
}) => {
  const collectRecordTitle = []

  if (siteValue !== '') collectRecordTitle.push(siteValue)
  if (transectVal !== '') collectRecordTitle.push(transectVal)
  if (labelVal !== '') collectRecordTitle.push(labelVal)

  const collectRecordTitleText =
    collectRecordTitle.length === 0 ? protocol : collectRecordTitle.join(' - ')

  return <H2 id="fishbelt-form-title">{collectRecordTitleText}</H2>
}

CollectRecordFormTitle.propTypes = {
  protocol: PropTypes.string,
  siteValue: PropTypes.string,
  transectVal: PropTypes.string,
  labelVal: PropTypes.string,
}

CollectRecordFormTitle.defaultProps = {
  protocol: '',
  siteValue: '',
  transectVal: '',
  labelVal: '',
}

export default CollectRecordFormTitle
