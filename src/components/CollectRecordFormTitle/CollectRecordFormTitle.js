import React from 'react'
import PropTypes from 'prop-types'
import { H2 } from '../generic/text'

const CollectRecordFormTitle = ({
  defaultTitle,
  siteName,
  transectName,
  labelName,
}) => {
  const collectRecordTitle = []

  if (siteName !== '') collectRecordTitle.push(siteName)
  if (transectName !== '') collectRecordTitle.push(transectName)
  if (labelName !== '') collectRecordTitle.push(labelName)

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
  defaultTitle: PropTypes.string.isRequired,
  siteName: PropTypes.string,
  transectName: PropTypes.string,
  labelName: PropTypes.string,
}

CollectRecordFormTitle.defaultProps = {
  siteName: '',
  transectName: '',
  labelName: '',
}

export default CollectRecordFormTitle
