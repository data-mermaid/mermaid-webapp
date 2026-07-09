import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  managementRegimePropType,
  sitePropType,
  choicesPropType,
  submittedBeltInvertPropType,
} from '../../../../App/mermaidData/mermaidDataProptypes'
import { Table } from '../../../generic/Table/table'
import TableRowItem from '../../../generic/Table/TableRowItem/TableRowItem'

const SubmittedBeltInvertInfoTable = ({
  sites,
  managementRegimes,
  choices,
  submittedRecord = undefined,
}) => {
  const { t } = useTranslation()

  if (!submittedRecord) {
    return null
  }

  const { site, management, sample_date } = submittedRecord.sample_event
  const { sample_time, depth, number, label, len_surveyed, width, size_bin, reef_slope, notes } =
    submittedRecord.beltinvert_transect
  const { belttransectwidths, invertbelttransectwidths, invertsizebins, reefslopes } = choices

  return (
    <Table>
      <tbody>
        <TableRowItem title={t('sites.site')} options={sites} value={site} isLink={true} />
        <TableRowItem
          title={t('management_regimes.management')}
          options={managementRegimes}
          value={management}
          isLink={true}
        />
        <TableRowItem
          title={t('sample_units.sample_date_time')}
          value={`${sample_date} ${sample_time || ''}`}
        />
        <TableRowItem
          title={`${t('sample_units.depth')} (${t('measurements.meter_short')})`}
          value={depth}
        />
        <TableRowItem title={t('sample_units.transect_number')} value={number} />
        <TableRowItem title={t('label')} value={label} />
        <TableRowItem
          title={`${t('sample_units.transect_length_surveyed')} (${t('measurements.meter_short')})`}
          value={len_surveyed}
        />
        <TableRowItem
          title={t('width')}
          options={invertbelttransectwidths?.data ?? belttransectwidths?.data ?? []}
          value={width}
        />
        <TableRowItem
          title={t('macroinvertebrate_observations.size_bin')}
          options={invertsizebins?.data ?? []}
          value={size_bin}
        />
        <TableRowItem title={t('reef_slope')} options={reefslopes?.data ?? []} value={reef_slope} />
        <TableRowItem title={t('notes')} value={notes} isAllowNewlines={true} />
      </tbody>
    </Table>
  )
}

SubmittedBeltInvertInfoTable.propTypes = {
  sites: PropTypes.arrayOf(sitePropType).isRequired,
  managementRegimes: PropTypes.arrayOf(managementRegimePropType).isRequired,
  choices: choicesPropType.isRequired,
  submittedRecord: submittedBeltInvertPropType,
}

export default SubmittedBeltInvertInfoTable
