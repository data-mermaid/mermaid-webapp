import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
        <TableRowItem title={`${t('sample_units.depth')} (${t('measurements.meter')})`} value={depth} />
        <TableRowItem title={t('transect_number')} value={number} />
        <TableRowItem title={t('label')} value={label} />
        <TableRowItem
          title={`${t('sample_units.transect_length_surveyed')} (${t('measurements.meter')})`}
          value={len_surveyed}
        />
        <TableRowItem
          title={`${t('observations.interval_size')} (${t('measurements.meter')})`}
          value={interval_size}
        />
        <TableRowItem
          title={`${t('observations.interval_start')} (${t('measurements.meter')})`}
          value={interval_start}
        />
        <TableRowItem title={t('reef_slope')} options={reefslopes.data} value={reef_slope} />
        <TableRowItem title={t('visibility')} options={visibilities.data} value={visibility} />
        <TableRowItem title={t('current')} options={currents.data} value={current} />
        <TableRowItem
          title={t('relative_depth')}
          options={relativedepths.data}
          value={relative_depth}
        />
        <TableRowItem title={t('tide')} options={tides.data} value={tide} />
        <TableRowItem title={t('notes')} value={notes} isAllowNewlines={true} />
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
