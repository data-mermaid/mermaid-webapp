import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { hoverState } from '../../../../library/styling/mediaQueries'
import { ButtonThatLooksLikeLink } from '../../buttons'
import theme from '../../../../theme'

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

const PaginationButtonStyles = css`
  border: none;
  cursor: pointer;
  padding: ${theme.spacing.xsmall};
  &:disabled {
    cursor: not-allowed;
    color: ${theme.color.primaryDisabledColor};
  }
  &:not([disabled], .paginationCurrentPage) {
    ${hoverState(css`
      background: ${theme.color.secondaryHover};
    `)}
  }
`

const PageNumberButtons = styled(ButtonThatLooksLikeLink)`
  ${PaginationButtonStyles}
  &.paginationCurrentPage {
    background-color: ${theme.color.primaryColor};
    color: ${theme.color.white};
  }
`

const PaginationLinkButton = styled(ButtonThatLooksLikeLink)`
  ${PaginationButtonStyles}
`

// eslint-disable-next-line react/prop-types
const PageButton = ({ pageIndex, currentPage, pageChangeHandler }) => {
  const pageLabel = pageIndex + 1
  const isCurrentPage = currentPage === pageLabel

  return (
    <PageNumberButtons
      className={isCurrentPage ? 'paginationCurrentPage' : undefined}
      aria-current={isCurrentPage}
      onClick={() => pageChangeHandler(pageLabel)}
      key={`pagination-button-${pageIndex}`}
    >
      {pageLabel}
    </PageNumberButtons>
  )
}

const PaginationForCopy = ({ totalRows, currentPage, pageChangeHandler }) => {
  const noOfPages = Math.ceil(totalRows / 5)

  const [pageButtons, setPageButtons] = useState([])

  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoNext, setCanGoNext] = useState(true)

  const onNextPage = () => pageChangeHandler(currentPage + 1)
  const onPrevPage = () => pageChangeHandler(currentPage - 1)

  useEffect(() => {
    if (noOfPages === currentPage) {
      setCanGoNext(false)
    } else {
      setCanGoNext(true)
    }
    if (currentPage === 1) {
      setCanGoBack(false)
    } else {
      setCanGoBack(true)
    }
  }, [noOfPages, currentPage])

  useEffect(() => {
    const pageButtonPropsThatChangeLess = { currentPage, pageChangeHandler }

    const getNotTooManyButtons = () => {
      const buttons = []

      for (let page = 1; page <= noOfPages; page += 1) {
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

      const lastPage = noOfPages
      const currentPageIndex = currentPage - 1

      const populateMiddleButtons = () => {
        if (currentPage === 3) {
          middleButtons.push(<PageButton {...pageButtonPropsThatChangeLess} pageIndex={1} />)
        }
        if (currentPage > 3) {
          middleButtons.push(
            <PageButton {...pageButtonPropsThatChangeLess} pageIndex={currentPageIndex - 2} />,
            <PageButton {...pageButtonPropsThatChangeLess} pageIndex={currentPageIndex - 1} />,
          )
        }
        if (currentPage !== 1 && currentPage !== lastPage) {
          middleButtons.push(
            <PageButton {...pageButtonPropsThatChangeLess} pageIndex={currentPageIndex} />,
          )
        }
        if (currentPage < lastPage - 1) {
          middleButtons.push(
            <PageButton {...pageButtonPropsThatChangeLess} pageIndex={currentPageIndex + 1} />,
          )
        }
        if (currentPage < lastPage - 2) {
          middleButtons.push(
            <PageButton {...pageButtonPropsThatChangeLess} pageIndex={currentPageIndex + 2} />,
          )
        }
      }

      const manageMiddleButtonEllipses = () => {
        if (currentPage > 4) {
          middleButtons.unshift(<span>...</span>)
        }
        if (currentPage < lastPage - 3) {
          middleButtons.push(<span>...</span>)
        }
      }

      populateMiddleButtons()
      manageMiddleButtonEllipses()

      return (
        <>
          <PageButton {...pageButtonPropsThatChangeLess} pageLabel="1" pageIndex={0} />
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

    if (noOfPages > 8) {
      setPageButtons(getTooManyButtons())
    } else {
      setPageButtons(getNotTooManyButtons())
    }
  }, [currentPage, noOfPages, pageChangeHandler])

  return (
    <PaginationWrapper data-testid="page-control">
      <PaginationLinkButton onClick={onPrevPage} disabled={!canGoBack}>
        Back
      </PaginationLinkButton>
      {pageButtons}
      <PaginationLinkButton onClick={onNextPage} disabled={!canGoNext}>
        Next
      </PaginationLinkButton>
    </PaginationWrapper>
  )
}

PaginationForCopy.propTypes = {
  totalRows: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  pageChangeHandler: PropTypes.func.isRequired,
}

export default PaginationForCopy
