import React from 'react'
import PropTypes from 'prop-types'
import { mermaidRecordPropType } from '../../../../App/mermaidData/mermaidDataProptypes'

const ValidationSummaryBadges = ({ collectRecord, areValidationsShowing }) => {
  const recordLevelWarnings =
    collectRecord?.validations?.results?.$record?.filter(
      (recordValidation) => recordValidation.status === 'warning',
    ).length || 0

  // this is weird because while we show all errors, we only show the first error for an input. If there is an error we show no warnings
  const managementWarnings =
    collectRecord?.validations?.results?.data?.sample_event?.management?.filter(
      (recordValidation) => recordValidation.status === 'warning',
    ).length || 0
  const totalWarnings = recordLevelWarnings + managementWarnings

  return areValidationsShowing ? <>warnings: {totalWarnings}</> : null
}

ValidationSummaryBadges.propTypes = {
  collectRecord: mermaidRecordPropType,
  areValidationsShowing: PropTypes.bool.isRequired,
}
ValidationSummaryBadges.defaultProps = { collectRecord: undefined }

export default ValidationSummaryBadges
