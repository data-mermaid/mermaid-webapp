import PropTypes from 'prop-types'
import React from 'react'
import {
  managementRegimePropType,
  sitePropType,
  submittedBenthicPitPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { Table } from '../../../generic/Table/table'
import TableRowItem from '../../../generic/Table/TableRowItem/TableRowItem'

const SubmittedBenthicPitInfoTable = ({ sites, managementRegimes, submittedRecord }) => {
  const { site, management, sample_date } = submittedRecord.sample_event

  const {
    sample_time,
    depth,
    number,
    label,
    len_surveyed,
    reef_slope,
    visibility,
    current,
    relative_depth,
    tide,
    notes,
  } = submittedRecord.benthic_transect

  const { interval_size, interval_start } = submittedRecord

  return (
    <Table>
      <tbody>
        <TableRowItem title="Site" options={sites} value={site} />
        <TableRowItem title="Management" options={managementRegimes} value={management} />
        <TableRowItem title="Sample Date Time" value={`${sample_date} ${sample_time || ''}`} />
        <TableRowItem title="Depth" value={depth} />
        <TableRowItem title="Transect Number" value={number} />
        <TableRowItem title="Label" value={label} />
        <TableRowItem title="Transect Length Surveyed" value={len_surveyed} />
        <TableRowItem title="Interval Size" value={interval_size} />
        <TableRowItem title="Interval Start" value={interval_start} />
        <TableRowItem title="Reef Slope" value={reef_slope} />
        <TableRowItem title="Visibility" value={visibility} />
        <TableRowItem title="Current" value={current} />
        <TableRowItem title="Relative Depth" value={relative_depth} />
        <TableRowItem title="Tide" value={tide} />
        <TableRowItem title="Notes" value={notes} />
      </tbody>
    </Table>
  )
}

SubmittedBenthicPitInfoTable.propTypes = {
  sites: PropTypes.arrayOf(sitePropType).isRequired,
  managementRegimes: PropTypes.arrayOf(managementRegimePropType).isRequired,
  submittedRecord: submittedBenthicPitPropType,
}

SubmittedBenthicPitInfoTable.defaultProps = {
  submittedRecord: undefined,
}

export default SubmittedBenthicPitInfoTable
