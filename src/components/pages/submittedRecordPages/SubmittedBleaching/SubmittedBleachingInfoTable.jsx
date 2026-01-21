import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
        <TableRowItem title={t('label')} value={label} />
        <TableRowItem
          title={`${t('quadrat_size')} (${t('measurements.square_meter')})`}
          value={quadrat_size}
        />
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

SubmittedBleachingInfoTable.propTypes = {
  choices: choicesPropType.isRequired,
  sites: PropTypes.arrayOf(sitePropType).isRequired,
  managementRegimes: PropTypes.arrayOf(managementRegimePropType).isRequired,
  submittedRecord: bleachingRecordPropType,
}

export default SubmittedBleachingInfoTable
