import React from 'react'

import language from '../language'

export const getErrorMessageHtmlListThatMayHaveSyncStatusCodeErrors = (error) => {
  // we want to handle actual error objects as that is useful and conventional
  if (error instanceof Error) {
    return (
      <ul>
        <li>{error.message}</li>
      </ul>
    )
  }

  // If the error has some other type,
  // its probably an object with a bunch of properties with values as errors
  // (which the api returns sync error info with for 40x status_codes specifically, but not other status codes)
  try {
    const errorMessageListItems = Object.entries(error.statusCodeReasons).map(([key, value]) => (
      <li key={key}>{`${key}: ${value}`}</li>
    ))

    return <ul>{errorMessageListItems}</ul>
  } catch {
    return (
      <ul>
        <li>{language.error.generic}</li>
      </ul>
    )
  }
}
