import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { getSortIndicatorContent, Th } from './table'

const ASCENDING = ' ▲'
const DESCENDING = ' ▼'

describe('getSortIndicatorContent', () => {
  test('renders nothing for a column that cannot be sorted', () => {
    expect(getSortIndicatorContent({ $sortedIndex: -1, $isSortingEnabled: false })).toBe('')
  })

  test('renders a hint for a sortable column that is not currently sorted', () => {
    expect(getSortIndicatorContent({ $sortedIndex: -1, $isSortingEnabled: true })).toBe(ASCENDING)
  })

  test('renders an up arrow when sorted ascending', () => {
    expect(getSortIndicatorContent({ $sortedIndex: 0, $isSortedDescending: false })).toBe(ASCENDING)
  })

  test('renders a down arrow when sorted descending', () => {
    expect(getSortIndicatorContent({ $sortedIndex: 0, $isSortedDescending: true })).toBe(DESCENDING)
  })

  test('appends a one-based position number when multiple columns are sorted', () => {
    expect(
      getSortIndicatorContent({
        $sortedIndex: 1,
        $isSortedDescending: true,
        $isMultiSortColumn: true,
      }),
    ).toBe(`${DESCENDING} 2`)
  })

  test('renders nothing for a Th that passes no sort props at all', () => {
    expect(getSortIndicatorContent({})).toBe('')
    expect(getSortIndicatorContent()).toBe('')
  })
})

// styled-components injects real CSS into jsdom, so reading it back is the only way to assert
// on a pseudo-element - `content` is not reachable from the DOM or from getComputedStyle here.
const getStyleRules = () =>
  Array.from(document.styleSheets).flatMap((sheet) => Array.from(sheet.cssRules ?? []))

const getSortIndicatorRule = (thProps, headerName, children) => {
  render(
    <table>
      <thead>
        <tr>
          <Th {...thProps}>{children ?? headerName}</Th>
        </tr>
      </thead>
    </table>,
  )

  const classNames = screen.getByRole('columnheader', { name: headerName }).className.split(' ')

  return getStyleRules().find((rule) =>
    classNames.some((className) => className && rule.cssText.startsWith(`.${className}::after`)),
  )
}

describe('Th sort indicator styling', () => {
  // The indicator used to live behind a `> span::after` selector, so any table that rendered its
  // header text bare silently lost the arrow. It now hangs off the Th itself - see M2076.
  test('puts the indicator on the Th, so a bare header still gets an arrow', () => {
    const bareHeader = getSortIndicatorRule({ $sortedIndex: 0, $isSortedDescending: false }, 'Site')

    expect(bareHeader.cssText).toContain(`content: '${ASCENDING}'`)
  })

  test('renders a single arrow when a sorted column is also flagged as sortable', () => {
    const wrappedHeader = getSortIndicatorRule(
      { $sortedIndex: 0, $isSortedDescending: true, $isSortingEnabled: true },
      'Method',
      <span>Method</span>,
    )

    expect(wrappedHeader.cssText).toContain(`content: '${DESCENDING}'`)
    expect(getStyleRules().some((rule) => rule.cssText.includes('> span'))).toBe(false)
  })

  test('mutes the hint on a sortable column that is not currently sorted', () => {
    const sortedHeader = getSortIndicatorRule(
      { $sortedIndex: 0, $isSortedDescending: false },
      'Name',
    )
    const hintHeader = getSortIndicatorRule({ $sortedIndex: -1, $isSortingEnabled: true }, 'Email')

    expect(hintHeader.cssText).toContain(`content: '${ASCENDING}'`)
    expect(hintHeader.style.color).not.toBe(sortedHeader.style.color)
  })

  test('renders no indicator on a Th that is not part of a sortable table', () => {
    const plainHeader = getSortIndicatorRule({}, 'Observations')

    expect(plainHeader.cssText).toContain("content: ''")
  })
})
