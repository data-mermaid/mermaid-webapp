import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tr, Td } from '../../../generic/Table/table'
import {
  managementRegimePropType,
  sitePropType,
  choicesPropType,
  submittedFishBeltPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { getObjectById } from '../../../../library/getObjectById'
import { TdKey } from '../SubmittedFormPage.styles'

const TableRowItem = ({ title, options, value }) => (
  <Tr>
    <TdKey>{title}</TdKey>
    {options ? <Td>{getObjectById(options, value)?.name}</Td> : <Td>{value}</Td>}
  </Tr>
)

const SubmittedFishBeltInfoTable = ({ sites, managementRegimes, choices, submittedRecord }) => {
  const { site, management, sample_date, notes } = submittedRecord.sample_event

  const {
    sample_time,
    depth,
    number,
    label,
    len_surveyed,
    width,
    size_bin,
    reef_slope,
    visibility,
    current,
    relative_depth,
    tide,
  } = submittedRecord.fishbelt_transect

  const {
    belttransectwidths,
    fishsizebins,
    reefslopes,
    visibilities,
    currents,
    relativedepths,
    tides,
  } = choices

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
        <TableRowItem title="Width" options={belttransectwidths.data} value={width} />
        <TableRowItem title="Fish Size Bin" options={fishsizebins.data} value={size_bin} />
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

TableRowItem.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

TableRowItem.defaultProps = {
  options: undefined,
  value: undefined,
}

SubmittedFishBeltInfoTable.propTypes = {
  sites: PropTypes.arrayOf(sitePropType).isRequired,
  managementRegimes: PropTypes.arrayOf(managementRegimePropType).isRequired,
  choices: choicesPropType.isRequired,
  submittedRecord: submittedFishBeltPropType,
}

SubmittedFishBeltInfoTable.defaultProps = {
  submittedRecord: undefined,
}

export default SubmittedFishBeltInfoTable
