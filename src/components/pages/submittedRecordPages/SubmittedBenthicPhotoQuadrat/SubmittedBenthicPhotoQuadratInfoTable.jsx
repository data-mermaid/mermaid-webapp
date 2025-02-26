import PropTypes from 'prop-types'
import React from 'react'
import {
  managementRegimePropType,
  sitePropType,
  choicesPropType,
  submittedBenthicPhotoQuadratPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { Table } from '../../../generic/Table/table'
import TableRowItem from '../../../generic/Table/TableRowItem/TableRowItem'

const SubmittedBenthicPhotoQuadratInfoTable = ({
  sites,
  managementRegimes,
  choices,
  submittedRecord = undefined,
}) => {
  const { site, management, sample_date } = submittedRecord.sample_event

  const {
    sample_time,
    depth,
    number,
    label,
    len_surveyed,
    quadrat_number_start,
    quadrat_size,
    num_quadrats,
    num_points_per_quadrat,
    visibility,
    current,
    relative_depth,
    tide,
    notes,
  } = submittedRecord.quadrat_transect

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
        <TableRowItem title="Transect Number" value={number} />
        <TableRowItem title="Label" value={label} />
        <TableRowItem title="Transect Length Surveyed (m)" value={len_surveyed} />
        <TableRowItem title="Quadrat Number Start" value={quadrat_number_start} />
        <TableRowItem title="Quadrat Size (m²)" value={quadrat_size} />
        <TableRowItem title="Number of Quadrats" value={num_quadrats} />
        <TableRowItem title="Number of Points per Quadrat" value={num_points_per_quadrat} />
        <TableRowItem title="Visibility" options={visibilities.data} value={visibility} />
        <TableRowItem title="Current" options={currents.data} value={current} />
        <TableRowItem title="Relative Depth" options={relativedepths.data} value={relative_depth} />
        <TableRowItem title="Tide" options={tides.data} value={tide} />
        <TableRowItem title="Notes" value={notes} isAllowNewlines={true} />
      </tbody>
    </Table>
  )
}

SubmittedBenthicPhotoQuadratInfoTable.propTypes = {
  sites: PropTypes.arrayOf(sitePropType).isRequired,
  managementRegimes: PropTypes.arrayOf(managementRegimePropType).isRequired,
  choices: choicesPropType.isRequired,
  submittedRecord: submittedBenthicPhotoQuadratPropType,
}

export default SubmittedBenthicPhotoQuadratInfoTable
