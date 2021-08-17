import PropTypes from 'prop-types'

import CollectRecordsMixin from './CollectRecordsMixin'
import DatabaseSwitchboardState from './DatabaseSwitchboardState'
import ManagementRegimesMixin from './ManagementRegimesMixin'
import UserProfileMixin from './UserProfileMixin'
import ChoicesMixin from './ChoicesMixin'
import ProjectsMixin from './ProjectsMixin'
import SitesMixin from './SitesMixin'
import FishNameMixin from './FishNamesMixin'
import SubmittedRecordsMixin from './SubmittedRecordsMixin'

class DatabaseSwitchboard extends FishNameMixin(
  SubmittedRecordsMixin(
    SitesMixin(
      ProjectsMixin(
        ChoicesMixin(
          ManagementRegimesMixin(
            CollectRecordsMixin(UserProfileMixin(DatabaseSwitchboardState)),
          ),
        ),
      ),
    ),
  ),
) {}

const databaseSwitchboardPropTypes = PropTypes.shape({
  getChoices: PropTypes.func,
  getCollectRecord: PropTypes.func,
  getCollectRecordsWithOfflineDeleted: PropTypes.func,
  getCollectRecordsWithoutOfflineDeleted: PropTypes.func,
  getCollectRecordsForUIDisplay: PropTypes.func,
  getFishBelt: PropTypes.func,
  getManagementRegimes: PropTypes.func,
  getManagementRegime: PropTypes.func,
  getManagementRegimeRecordsForUiDisplay: PropTypes.func,
  getProjects: PropTypes.func,
  getProject: PropTypes.func,
  getProjectTags: PropTypes.func,
  getProjectProfiles: PropTypes.func,
  getSites: PropTypes.func,
  getSite: PropTypes.func,
  getSiteRecordsForUIDisplay: PropTypes.func,
  getUserProfile: PropTypes.func,
  getSubmittedRecords: PropTypes.func,
  getSubmittedFishBeltTransectRecords: PropTypes.func,
  getSubmittedFishBeltTransectRecord: PropTypes.func,
  getSubmittedRecordsForUIDisplay: PropTypes.func,
  saveFishBelt: PropTypes.func,
  deleteFishBelt: PropTypes.func,
})

export default DatabaseSwitchboard
export { databaseSwitchboardPropTypes }
