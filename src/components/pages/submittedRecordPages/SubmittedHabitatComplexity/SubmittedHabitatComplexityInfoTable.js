import PropTypes from 'prop-types'
import React from 'react'
import {
  choicesPropType,
  managementRegimePropType,
  sitePropType,
  submittedHabitatComplexityPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { Table } from '../../../generic/Table/table'
import TableRowItem from '../../../generic/Table/TableRowItem/TableRowItem'

const SubmittedHabitatComplexityInfoTable = ({
  choices,
  sites,
  managementRegimes,
  submittedRecord,
}) => {
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

  const { interval_size } = submittedRecord

  const { visibilities, currents, relativedepths, reefslopes, tides } = choices

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
        <TableRowItem title="Reef Slope" options={reefslopes.data} value={reef_slope} />
        <TableRowItem title="Visibility" options={visibilities.data} value={visibility} />
        <TableRowItem title="Current" options={currents.data} value={current} />
        <TableRowItem title="Relative Depth" options={relativedepths.data} value={relative_depth} />
        <TableRowItem title="Tide" options={tides.data} value={tide} />
        <TableRowItem title="Notes" value={notes} />
      </tbody>
    </Table>
  )
}

SubmittedHabitatComplexityInfoTable.propTypes = {
  choices: choicesPropType.isRequired,
  sites: PropTypes.arrayOf(sitePropType).isRequired,
  managementRegimes: PropTypes.arrayOf(managementRegimePropType).isRequired,
  submittedRecord: submittedHabitatComplexityPropType,
}

SubmittedHabitatComplexityInfoTable.defaultProps = {
  submittedRecord: undefined,
}

export default SubmittedHabitatComplexityInfoTable
