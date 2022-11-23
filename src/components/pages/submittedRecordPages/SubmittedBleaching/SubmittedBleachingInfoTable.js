import PropTypes from 'prop-types'
import React from 'react'
import {
  choicesPropType,
  managementRegimePropType,
  sitePropType,
  submittedBleachingPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { Table } from '../../../generic/Table/table'
import TableRowItem from '../../../generic/Table/TableRowItem/TableRowItem'

const SubmittedBleachingInfoTable = ({ choices, sites, managementRegimes, submittedRecord }) => {
  const { site, management, sample_date } = submittedRecord.sample_event

  const {
    sample_time,
    depth,
    number,
    label,
    // len_surveyed,
    // reef_slope,
    visibility,
    current,
    quadrat_size,
    relative_depth,
    tide,
    notes,
  } = submittedRecord.quadrat_collection

  // const { interval_size, interval_start } = submittedRecord

  const { visibilities, currents, relativedepths, tides } = choices

  return (
    <Table>
      <tbody>
        <TableRowItem title="Site" options={sites} value={site} />
        <TableRowItem title="Management" options={managementRegimes} value={management} />
        <TableRowItem title="Sample Date Time" value={`${sample_date} ${sample_time || ''}`} />
        <TableRowItem title="Depth" value={depth} />
        <TableRowItem title="Label" value={label} />
        <TableRowItem title="Quadrat Size" value={quadrat_size} />
        {/* <TableRowItem title="Interval Size" value={interval_size} />
        <TableRowItem title="Interval Start" value={interval_start} /> */}
        {/* <TableRowItem title="Reef Slope" options={reefslopes.data} value={reef_slope} /> */}
        <TableRowItem title="Visibility" options={visibilities.data} value={visibility} />
        <TableRowItem title="Current" options={currents.data} value={current} />
        <TableRowItem title="Relative Depth" options={relativedepths.data} value={relative_depth} />
        <TableRowItem title="Tide" options={tides.data} value={tide} />
        <TableRowItem title="Notes" value={notes} />
      </tbody>
    </Table>
  )
}

SubmittedBleachingInfoTable.propTypes = {
  choices: choicesPropType.isRequired,
  sites: PropTypes.arrayOf(sitePropType).isRequired,
  managementRegimes: PropTypes.arrayOf(managementRegimePropType).isRequired,
  submittedRecord: submittedBleachingPropType,
}

SubmittedBleachingInfoTable.defaultProps = {
  submittedRecord: undefined,
}

export default SubmittedBleachingInfoTable
