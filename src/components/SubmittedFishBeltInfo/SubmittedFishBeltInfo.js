import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components/macro'
import { Table, Tr, TableOverflowWrapper } from '../generic/Table/table'
import { InputWrapper } from '../generic/form'
import {
  managementRegimePropType,
  sitePropType,
  choicesPropType,
} from '../../App/mermaidData/mermaidDataProptypes'
import { formikPropType } from '../../library/formikPropType'
import { getObjectById } from '../../library/getObjectById'

const Tcell = styled.td`
  padding: 10px;
  text-align: left;
  ${(props) =>
    props.cellWithText &&
    css`
      font-weight: bold;
      width: 250px;
      background: #f1f1f4;
    `};
`

const TableRowItem = ({ title, options, value }) => (
  <Tr>
    <Tcell cellWithText>{title}</Tcell>
    {options ? (
      <Tcell>{getObjectById(options, value).name}</Tcell>
    ) : (
      <Tcell>{value}</Tcell>
    )}
  </Tr>
)

const SubmittedFishBeltInfo = ({
  formik,
  sites,
  managementRegimes,
  choices,
}) => {
  const {
    values: {
      site,
      management,
      sample_date,
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
      notes,
    },
  } = formik

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
    <InputWrapper>
      <TableOverflowWrapper>
        <Table>
          <tbody>
            <TableRowItem title="Site" options={sites} value={site} />
            <TableRowItem
              title="Management"
              options={managementRegimes}
              value={management}
            />
            <TableRowItem
              title="Sample Date Time"
              value={`${sample_date} ${sample_time}`}
            />
            <TableRowItem title="Depth" value={depth} />
            <TableRowItem title="Transect Number" value={number} />
            <TableRowItem title="Label" value={label} />
            <TableRowItem
              title="Transect Length Surveyed<"
              value={len_surveyed}
            />
            <TableRowItem
              title="Width"
              options={belttransectwidths.data}
              value={width}
            />
            <TableRowItem
              title="Fish Size Bin"
              options={fishsizebins.data}
              value={size_bin}
            />
            <TableRowItem
              title="Reef Slope"
              options={reefslopes.data}
              value={reef_slope}
            />
            <TableRowItem
              title="Visibility"
              options={visibilities.data}
              value={visibility}
            />
            <TableRowItem
              title="Current"
              options={currents.data}
              value={current}
            />
            <TableRowItem
              title="Relative Depth"
              options={relativedepths.data}
              value={relative_depth}
            />
            <TableRowItem title="Tide" options={tides.data} value={tide} />
            <TableRowItem title="Notes" value={notes} />
          </tbody>
        </Table>
      </TableOverflowWrapper>
    </InputWrapper>
  )
}

TableRowItem.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
    }),
  ),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

TableRowItem.defaultProps = {
  options: undefined,
}

SubmittedFishBeltInfo.propTypes = {
  formik: formikPropType.isRequired,
  sites: PropTypes.arrayOf(sitePropType).isRequired,
  managementRegimes: PropTypes.arrayOf(managementRegimePropType).isRequired,
  choices: choicesPropType.isRequired,
}

export default SubmittedFishBeltInfo
