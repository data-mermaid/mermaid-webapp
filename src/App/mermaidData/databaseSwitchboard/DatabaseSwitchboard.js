import PropTypes from 'prop-types'

import CollectRecordsMixin from './CollectRecordsMixin'
import DatabaseSwitchboardState from './DatabaseSwitchboardState'
import ManagementRegimesMixin from './ManagementRegimesMixin'
import UserProfileMixin from './UserProfileMixin'
import ChoicesMixin from './ChoicesMixin'
import ProjectsMixin from './ProjectsMixin'
import SitesMixin from './SitesMixin'

class DatabaseSwitchboard extends SitesMixin(
  ProjectsMixin(
    ChoicesMixin(
      ManagementRegimesMixin(
        CollectRecordsMixin(UserProfileMixin(DatabaseSwitchboardState)),
      ),
    ),
  ),
) {}

const databaseSwitchboardPropTypes = PropTypes.shape({
  getChoices: PropTypes.func,
  getCollectRecord: PropTypes.func,
  getCollectRecords: PropTypes.func,
  getCollectRecordsForUIDisplay: PropTypes.func,
  getFishBelt: PropTypes.func,
  getManagementRegimes: PropTypes.func,
  getProjects: PropTypes.func,
  getSites: PropTypes.func,
  getSiteRecordsForUIDisplay: PropTypes.func,
  getUserProfile: PropTypes.func,
  saveFishBelt: PropTypes.func,
  deleteFishBelt: PropTypes.func,
})

export default DatabaseSwitchboard
export { databaseSwitchboardPropTypes }
