import PropTypes from 'prop-types'

import BenthicAttributesMixin from './BenthicAttributesMixin'
import CollectRecordsMixin from './CollectRecordsMixin'
import DatabaseSwitchboardState from './DatabaseSwitchboardState'
import ManagementRegimesMixin from './ManagementRegimesMixin'
import ChoicesMixin from './ChoicesMixin'
import ProjectsMixin from './ProjectsMixin'
import SitesMixin from './SitesMixin'
import FishNameMixin from './FishNamesMixin'
import SubmittedRecordsMixin from './SubmittedRecordsMixin'
import ProjectHealthMixin from './ProjectHealthMixin'
import GfcrMixin from './GfcrMixin'
import ImageClassificationMixin from './ImageClassificationMixin'
class DatabaseSwitchboard extends ProjectHealthMixin(
  BenthicAttributesMixin(
    FishNameMixin(
      SubmittedRecordsMixin(
        SitesMixin(
          ProjectsMixin(
            ChoicesMixin(
              ManagementRegimesMixin(
                CollectRecordsMixin(GfcrMixin(ImageClassificationMixin(DatabaseSwitchboardState))),
              ),
            ),
          ),
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
  saveManagementRegime: PropTypes.func,
  getProjects: PropTypes.func,
  getProject: PropTypes.func,
  getProjectTags: PropTypes.func,
  getProjectProfiles: PropTypes.func,
  getUserProfile: PropTypes.func,
  addUser: PropTypes.func,
  transferSampleUnits: PropTypes.func,
  removeUser: PropTypes.func,
  getSitesWithoutOfflineDeleted: PropTypes.func,
  getSite: PropTypes.func,
  getSiteRecordsForUIDisplay: PropTypes.func,
  saveSite: PropTypes.func,
  getSubmittedRecords: PropTypes.func,
  getSubmittedSampleUnitRecord: PropTypes.func,
  getSubmittedRecordsForUIDisplay: PropTypes.func,
  moveToCollect: PropTypes.func,
  exportSubmittedRecords: PropTypes.func,
  saveFishBelt: PropTypes.func,
  deleteSampleUnit: PropTypes.func,
  validateSampleUnit: PropTypes.func,
  saveSampleUnit: PropTypes.func,
  getAnnotationsForImage: PropTypes.func,
  saveAnnotationsForImage: PropTypes.func,
})

export default DatabaseSwitchboard
export { databaseSwitchboardPropTypes }
