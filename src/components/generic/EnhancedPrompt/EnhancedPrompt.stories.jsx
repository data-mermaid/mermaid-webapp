import React, { useState } from 'react'

import EnhancedPrompt from './EnhancedPrompt'

export default {
  title: 'EnhancedPrompt',
  component: EnhancedPrompt,
}

/**
 * Enhanced React Router Prompt component which adds an event listener for browser navigation `beforeunload` event.
 * NOTE: at present this provides a usage example but does not demonstrate navigating away from the page with react router.
 */
export const Basic = () => {
  const [formDirty, setFormDirty] = useState(false)
  const [value, setValue] = useState('')

  return (
    <>
      <input
        type="text"
        value={value}
        placeholder="enter a value"
        onChange={(e) => {
          setValue(e.currentTarget.value)
          if (e.currentTarget.value !== '') {
            setFormDirty(true)
          }
        }}
      />
      <EnhancedPrompt shouldPromptTrigger={formDirty} />
    </>
  )
}
