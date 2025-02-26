import React from 'react'

import InlineMessage from './InlineMessage'
import { IconBell } from '../../icons'

export default {
  title: 'InlineMessage',
  component: InlineMessage,
}

export const allMessages = () => (
  <>
    <InlineMessage type="warning">This is a warning message</InlineMessage>
    <InlineMessage type="error">
      <IconBell /> This is an error message with an icon and <a href="#top">with a link</a>
    </InlineMessage>
    <InlineMessage type="info">
      <IconBell /> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
      reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
      occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
      laborum. This is a info message
    </InlineMessage>
    <InlineMessage type="not-a-real-class">
      This is a message with not a real type. <br />
      <a href="#bottom">A link on a new line‽</a>
    </InlineMessage>
  </>
)
