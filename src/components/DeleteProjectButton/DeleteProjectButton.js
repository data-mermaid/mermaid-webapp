import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import { ButtonCaution, ButtonSecondary } from '../generic/buttons'
import Modal, { RightFooter } from '../generic/Modal/Modal'
import {
  DeleteProjectButtonCautionWrapper,
  WarningText,
} from '../pages/collectRecordFormPages/CollectingFormPage.Styles'
import LoadingModal from '../LoadingModal/LoadingModal'
import useCurrentProjectPath from '../../library/useCurrentProjectPath'
import language from '../../language'
import { IconDeleteForever } from '../icons'

const DeleteProjectButton = ({
  currentPage,
  errorData,
  isLoading,
  hasSampleUnits,
  isOpen,
  modalText,
  deleteProject,
  onDismiss,
  openModal,
}) => {
  const currentProjectPath = useCurrentProjectPath()

  const mainContentPageTwo = (
    <>
      <p>{modalText.confirmDeleteText1}</p>
      <ul>
        {errorData.map((error) => (
          <li key={error.id}>
            <Link to={`${currentProjectPath}/submitted/${error.protocol}/${error.id}`}>
              {error.sampleUnitLabel}
            </Link>
          </li>
        ))}
      </ul>
      <p>{modalText.confirmDeleteText2}</p>
    </>
  )

  const footerContentPageOne = (
    <RightFooter>
      <ButtonSecondary onClick={onDismiss}>{modalText.no}</ButtonSecondary>
      <ButtonCaution disabled={isLoading} onClick={deleteProject}>
        {modalText.yes}
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
      {currentPage === 1 && modalText.prompt}
      {currentPage === 2 && mainContentPageTwo}
    </>
  )

  const footerContent = (
    <>
      {currentPage === 1 && footerContentPageOne}
      {currentPage === 2 && footerContentPageTwo}
    </>
  )

  return (
    <>
      <DeleteProjectButtonCautionWrapper>
        <ButtonCaution onClick={openModal} disabled={hasSampleUnits}>
          <IconDeleteForever />
          {modalText.title}
        </ButtonCaution>
      </DeleteProjectButtonCautionWrapper>
      {hasSampleUnits ? (
        <WarningText>{language.deleteProject('Project').hasSampleUnits}</WarningText>
      ) : null}
      <Modal
        title={modalText.title}
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
      id: PropTypes.string,
      site: PropTypes.string,
      sampleUnitLabel: PropTypes.string,
    }),
  ),
  isLoading: PropTypes.bool.isRequired,
  hasSampleUnits: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  modalText: PropTypes.shape({
    title: PropTypes.string,
    prompt: PropTypes.string,
    yes: PropTypes.string,
    no: PropTypes.string,
    confirmDeleteText1: PropTypes.string,
    confirmDeleteText2: PropTypes.string,
  }).isRequired,
  deleteProject: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
}

DeleteProjectButton.defaultProps = {
  currentPage: 1,
  errorData: [],
}

export default DeleteProjectButton
