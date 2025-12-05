import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ButtonCaution, ButtonSecondary } from '../generic/buttons'
import Modal, { RightFooter } from '../generic/Modal'
import {
  DeleteProjectButtonCautionWrapper,
  WarningText,
} from '../pages/collectRecordFormPages/CollectingFormPage.Styles'
import LoadingModal from '../LoadingModal/LoadingModal'
import useCurrentProjectPath from '../../library/useCurrentProjectPath'

const DeleteProjectButton = ({
  currentPage = 1,
  errorData = [],
  isLoading,
  hasSampleUnits,
  hasOtherUsers,
  isOpen,
  projectName,
  deleteProject,
  onDismiss,
  openModal,
}) => {
  const { t } = useTranslation()
  const resolvedProjectName = projectName || t('projects.project')

  const currentProjectPath = useCurrentProjectPath()

  const mainContentPageTwo = (
    <>
      <p>
        {t('projects.cannot_delete', {
          projectName: resolvedProjectName,
        })}
      </p>
      <ul>
        {errorData.map((error) => (
          <li key={error.id}>
            <Link to={`${currentProjectPath}/submitted/${error.protocol}/${error.id}`}>
              {error.sampleUnitLabel}
            </Link>
          </li>
        ))}
      </ul>
      <p>
        {t('projects.remove_before_delete', {
          projectName: resolvedProjectName,
        })}
      </p>
    </>
  )

  const footerContentPageOne = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>{t('buttons.cancel')}</ButtonSecondary>
      <ButtonCaution disabled={isLoading} onClick={deleteProject}>
        {t('projects.confirm_delete', { projectName: resolvedProjectName })}
      </ButtonCaution>
    </RightFooter>
  )

  const footerContentPageTwo = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>Close</ButtonSecondary>
    </RightFooter>
  )

  const mainContent = (
    <>
      {currentPage === 1
        ? t('projects.user_confirm_delete', { projectName: resolvedProjectName })
        : null}
      {currentPage === 2 ? mainContentPageTwo : null}
    </>
  )

  const footerContent = (
    <>
      {currentPage === 1 ? footerContentPageOne : null}
      {currentPage === 2 ? footerContentPageTwo : null}
    </>
  )

  return (
    <>
      <DeleteProjectButtonCautionWrapper>
        <ButtonCaution type="button" onClick={openModal} disabled={hasSampleUnits || hasOtherUsers}>
          {t('projects.delete')}
        </ButtonCaution>
      </DeleteProjectButtonCautionWrapper>
      {hasSampleUnits ? (
        <WarningText>{t('projects.delete_sample_units_notice')}</WarningText>
      ) : null}
      {hasOtherUsers ? <WarningText>{t('projects.delete_other_users_notice')}</WarningText> : null}
      <Modal
        title={t('projects.delete')}
        isOpen={isOpen}
        onDismiss={onDismiss}
        mainContent={mainContent}
        footerContent={footerContent}
      />
      {isLoading && <LoadingModal />}
    </>
  )
}

DeleteProjectButton.propTypes = {
  currentPage: PropTypes.number,
  errorData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      protocol: PropTypes.string,
      site: PropTypes.string,
      sampleUnitLabel: PropTypes.string,
    }),
  ),
  isLoading: PropTypes.bool.isRequired,
  hasSampleUnits: PropTypes.bool.isRequired,
  hasOtherUsers: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  projectName: PropTypes.string,
  deleteProject: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
}

export default DeleteProjectButton
