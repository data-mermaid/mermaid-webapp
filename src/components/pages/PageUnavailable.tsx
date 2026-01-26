import React from 'react'
import styles from './PageUnavailable.module.scss'

interface PageUnavailableProps {
  mainText?: string
  subText?: string
  align?: 'start' | 'end' | 'center' | 'justify'
  children?: React.ReactNode
  testId?: string
}

const PageUnavailable = ({
  mainText = 'No Data',
  subText,
  align = 'start',
  children,
  testId = 'page-unavailable-main-text',
}: PageUnavailableProps) => {
  if (children) {
    return (
      <div className={styles['unavailable-container']} data-testid={testId}>
        {children}
      </div>
    )
  }

  return (
    <div className={styles[`unavailable-container--${align}`]} data-testid={testId}>
      {mainText && <h3>{mainText}</h3>}
      {subText && <p>{subText}</p>}
    </div>
  )
}

export default PageUnavailable
