import PropTypes from 'prop-types'
import React from 'react'
import {
  choicesPropType,
  managementRegimePropType,
  sitePropType,
  bleachingRecordPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { Table } from '../../../generic/Table/table'
import TableRowItem from '../../../generic/Table/TableRowItem/TableRowItem'

const SubmittedBleachingInfoTable = ({
  choices,
  sites,
  managementRegimes,
  submittedRecord = undefined,
}) => {
  const { site, management, sample_date } = submittedRecord.sample_event

  const {
    sample_time,
    depth,
    label,
    visibility,
    current,
    quadrat_size,
    relative_depth,
    tide,
    notes,
  } = submittedRecord.quadrat_collection

  const { visibilities, currents, relativedepths, tides } = choices

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
        <TableRowItem title="Label" value={label} />
        <TableRowItem title="Quadrat Size (m²)" value={quadrat_size} />
        <TableRowItem title="Visibility" options={visibilities.data} value={visibility} />
        <TableRowItem title="Current" options={currents.data} value={current} />
        <TableRowItem title="Relative Depth" options={relativedepths.data} value={relative_depth} />
        <TableRowItem title="Tide" options={tides.data} value={tide} />
        <TableRowItem title="Notes" value={notes} isAllowNewlines={true} />
      </tbody>
    </Table>
  )
}

SubmittedBleachingInfoTable.propTypes = {
  choices: choicesPropType.isRequired,
  sites: PropTypes.arrayOf(sitePropType).isRequired,
  managementRegimes: PropTypes.arrayOf(managementRegimePropType).isRequired,
  submittedRecord: bleachingRecordPropType,
}

export default SubmittedBleachingInfoTable
