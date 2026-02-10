import i18next from '../../i18n'
import { getRecordSubNavNodeInfo } from './getRecordSubNavNodeInfo'

export const getDataForSubNavNode = ({ isNewRecord, collectRecord, sites, protocol }) => {
  return !isNewRecord && collectRecord
    ? getRecordSubNavNodeInfo(collectRecord.data, sites, collectRecord.data.protocol)
    : { name: protocol ? i18next.t(`protocol_titles.${protocol}`) : '' }
}
