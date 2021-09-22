import PropTypes from 'prop-types'

import CollectRecordsMixin from './CollectRecordsMixin'
import DatabaseSwitchboardState from './DatabaseSwitchboardState'
import ManagementRegimesMixin from './ManagementRegimesMixin'
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
          ManagementRegimesMixin(CollectRecordsMixin(DatabaseSwitchboardState)),
        ),
      ),
    ),
  ),
) {}

const databaseSwitchboardPropTypes = PropTypes.shape({
  getChoices: PropTypes.func,
  getCollectRecord: PropTypes.func,
  getCollectRecordsWithoutOfflineDeleted: PropTypes.func,
  getCollectRecordsForUIDisplay: PropTypes.func,
  getManagementRegimesWithoutOfflineDeleted: PropTypes.func,
  getManagementRegime: PropTypes.func,
  getManagementRegimeRecordsForUiDisplay: PropTypes.func,
  getProjects: PropTypes.func,
  getProject: PropTypes.func,
  getProjectTags: PropTypes.func,
  getProjectProfiles: PropTypes.func,
  getUserProfile: PropTypes.func,
  addUser: PropTypes.func,
  getSitesWithoutOfflineDeleted: PropTypes.func,
  getSite: PropTypes.func,
  getSiteRecordsForUIDisplay: PropTypes.func,
  getSubmittedRecords: PropTypes.func,
  getSubmittedFishBeltTransectRecords: PropTypes.func,
  getSubmittedFishBeltTransectRecord: PropTypes.func,
  getSubmittedRecordsForUIDisplay: PropTypes.func,
  saveFishBelt: PropTypes.func,
  deleteFishBelt: PropTypes.func,
})

export default DatabaseSwitchboard
export { databaseSwitchboardPropTypes }
