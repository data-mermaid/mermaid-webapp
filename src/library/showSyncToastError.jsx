import { toast } from 'react-toastify'
import React from 'react'

import { getErrorMessageHtmlListThatMayHaveSyncStatusCodeErrors } from './getErrorMessageHtmlListThatMayHaveSyncStatusCodeErrors'
import { getToastArguments } from './getToastArguments'

export const showSyncToastError = ({ error, toastTitle, testId }) => {
  const errorLang = getErrorMessageHtmlListThatMayHaveSyncStatusCodeErrors(error)

  toast.error(
    ...getToastArguments(
      <div data-testid={testId}>
        {toastTitle}
        <br />
        {errorLang}
      </div>,
    ),
  )
}
