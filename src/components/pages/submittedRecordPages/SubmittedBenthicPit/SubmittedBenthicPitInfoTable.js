import PropTypes from 'prop-types'
import React from 'react'
import {
  choicesPropType,
  managementRegimePropType,
  sitePropType,
  benthicPitRecordPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { Table } from '../../../generic/Table/table'
import TableRowItem from '../../../generic/Table/TableRowItem/TableRowItem'

const SubmittedBenthicPitInfoTable = ({
  choices,
  sites,
  managementRegimes,
  submittedRecord = undefined,
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

  const { interval_size, interval_start } = submittedRecord

  const { visibilities, currents, relativedepths, reefslopes, tides } = choices

  return (
    <Table>
      <tbody>
        <TableRowItem title="Site" options={sites} value={site} isLink={true} />
        <TableRowItem
          title="Management"
          options={managementRegimes}
          value={management}
          isLink={true}
        />
        <TableRowItem title="Sample Date Time" value={`${sample_date} ${sample_time || ''}`} />
        <TableRowItem title="Depth (m)" value={depth} />
        <TableRowItem title="Transect Number" value={number} />
        <TableRowItem title="Label" value={label} />
        <TableRowItem title="Transect Length Surveyed (m)" value={len_surveyed} />
        <TableRowItem title="Interval Size (m)" value={interval_size} />
        <TableRowItem title="Interval Start (m)" value={interval_start} />
        <TableRowItem title="Reef Slope" options={reefslopes.data} value={reef_slope} />
        <TableRowItem title="Visibility" options={visibilities.data} value={visibility} />
        <TableRowItem title="Current" options={currents.data} value={current} />
        <TableRowItem title="Relative Depth" options={relativedepths.data} value={relative_depth} />
        <TableRowItem title="Tide" options={tides.data} value={tide} />
        <TableRowItem title="Notes" value={notes} isAllowNewlines={true} />
      </tbody>
    </Table>
  )
}

SubmittedBenthicPitInfoTable.propTypes = {
  choices: choicesPropType.isRequired,
  sites: PropTypes.arrayOf(sitePropType).isRequired,
  managementRegimes: PropTypes.arrayOf(managementRegimePropType).isRequired,
  submittedRecord: benthicPitRecordPropType,
}

export default SubmittedBenthicPitInfoTable
