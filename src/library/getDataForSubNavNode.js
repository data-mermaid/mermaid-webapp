import { getRecordSubNavNodeInfo } from './getRecordSubNavNodeInfo'
import language from '../language'

export const getDataForSubNavNode = ({ isNewRecord, collectRecord, sites, protocol }) =>
  !isNewRecord && collectRecord
    ? getRecordSubNavNodeInfo(collectRecord.data, sites, collectRecord.data.protocol)
    : { name: language.protocolTitles[protocol] }
