import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import React from 'react'

import useCurrentProjectPath from '../../library/useCurrentProjectPath'
import { InlineCell } from '../generic/Table/table'

const SampleUnitLinks = ({ rowRecord, sampleUnitNumbersRow }) => {
  const currentProjectPath = useCurrentProjectPath()

  const sampleUnitLinks = sampleUnitNumbersRow.map((row, idx) => {
    return (
      <span key={row.id}>
        <Link to={`${currentProjectPath}/submitted/${rowRecord.sample_unit_protocol}/${row.id}`}>
          {row.label}
        </Link>
        {idx < sampleUnitNumbersRow.length - 1 && ', '}
      </span>
    )
  })

  return <InlineCell>{sampleUnitLinks}</InlineCell>
}

SampleUnitLinks.propTypes = {
  rowRecord: PropTypes.shape({
    sample_unit_protocol: PropTypes.string,
  }).isRequired,
  sampleUnitNumbersRow: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
    }),
  ).isRequired,
}

export default SampleUnitLinks
