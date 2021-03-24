import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { LinkButton } from '../../buttons'

const CustomButton = styled.button(
  (props) =>
    css`
      padding: 0 ${props.theme.spacing.small};
      margin: 0 ${props.theme.spacing.xsmall};
      border: none;
      background-color: ${props.currentPage
        ? props.theme.color.primaryColor
        : 'transparent'};
    `,
)

// eslint-disable-next-line react/prop-types
const PageButton = ({ pageIndex, currentPageIndex, onGoToPage }) => {
  const pageLabel = pageIndex + 1

  return (
    <CustomButton
      currentPage={currentPageIndex === pageIndex}
      onClick={() => onGoToPage(pageIndex)}
      key={`pagination-button-${pageIndex}`}
    >
      {pageLabel}
    </CustomButton>
  )
}

/**
 * Pagination control - for user to select which page is shown
 */

const PageSelector = ({
  currentPageIndex,
  nextDisabled,
  onGoToPage,
  onNextClick,
  onPreviousClick,
  pageCount,
  previousDisabled,
}) => {
  const [pageButtons, setPageButtons] = useState([])

  useEffect(() => {
    const pageButtonPropsThatChangeLess = { currentPageIndex, onGoToPage }

    const getNotTooManyButtons = () => {
      const buttons = []

      for (let page = 1; page <= pageCount; page += 1) {
        const buttonProps = {
          ...pageButtonPropsThatChangeLess,
          pageIndex: page - 1,
          key: `pagination-button-${page}`,
        }

        buttons.push(<PageButton {...buttonProps} />)
      }

      return buttons
    }
    const getTooManyButtons = () => {
      const middleButtons = []

      const lastPage = pageCount
      const currentlySelectedPage = currentPageIndex + 1

      const populateMiddleButtons = () => {
        if (currentlySelectedPage === 3) {
          middleButtons.push(
            <PageButton {...pageButtonPropsThatChangeLess} pageIndex={1} />,
          )
        }
        if (currentlySelectedPage > 3) {
          middleButtons.push(
            <PageButton
              {...pageButtonPropsThatChangeLess}
              pageIndex={currentPageIndex - 2}
            />,
            <PageButton
              {...pageButtonPropsThatChangeLess}
              pageIndex={currentPageIndex - 1}
            />,
          )
        }
        if (currentlySelectedPage !== 1 && currentlySelectedPage !== lastPage) {
          middleButtons.push(
            <PageButton
              {...pageButtonPropsThatChangeLess}
              pageIndex={currentPageIndex}
            />,
          )
        }
        if (currentlySelectedPage < lastPage - 1) {
          middleButtons.push(
            <PageButton
              {...pageButtonPropsThatChangeLess}
              pageIndex={currentPageIndex + 1}
            />,
          )
        }
        if (currentlySelectedPage < lastPage - 2) {
          middleButtons.push(
            <PageButton
              {...pageButtonPropsThatChangeLess}
              pageIndex={currentPageIndex + 2}
            />,
          )
        }
      }

      const manageMiddleButtonEllipses = () => {
        if (currentlySelectedPage > 4) {
          middleButtons.unshift(<span>...</span>)
        }
        if (currentlySelectedPage < lastPage - 3) {
          middleButtons.push(<span>...</span>)
        }
      }

      populateMiddleButtons()
      manageMiddleButtonEllipses()

      return (
        <>
          <PageButton
            {...pageButtonPropsThatChangeLess}
            pageLabel="1"
            pageIndex={0}
          />
          {middleButtons.map((button, index) => ({
            ...button,
            key: `middle-button-${index}`,
          }))}
          <PageButton
            {...pageButtonPropsThatChangeLess}
            pageLabel={lastPage}
            pageIndex={lastPage - 1}
          />
        </>
      )
    }

    if (pageCount > 8) {
      setPageButtons(getTooManyButtons())
    } else {
      setPageButtons(getNotTooManyButtons())
    }
  }, [pageCount, currentPageIndex, onGoToPage])

  return (
    <div data-testid="page-control">
      <LinkButton onClick={onPreviousClick} disabled={previousDisabled}>
        « Previous
      </LinkButton>
      {pageButtons}
      <LinkButton onClick={onNextClick} disabled={nextDisabled}>
        Next »
      </LinkButton>
    </div>
  )
}

PageSelector.propTypes = {
  nextDisabled: PropTypes.bool.isRequired,
  onGoToPage: PropTypes.func.isRequired,
  onNextClick: PropTypes.func.isRequired,
  onPreviousClick: PropTypes.func.isRequired,
  previousDisabled: PropTypes.bool.isRequired,
  currentPageIndex: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
}

export default PageSelector
