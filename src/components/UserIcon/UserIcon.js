import PropTypes from 'prop-types'
import React, { useLayoutEffect, useState } from 'react'

import { UserProfilePicture, FallbackUserIcon, UserCircle } from './UserIcon.styles'

export const UserIcon = ({
  firstName = undefined,
  lastName = undefined,
  userImageUrl = undefined,
  className = undefined,
  dark = false,
}) => {
  const [hasImageError, setHasImageError] = useState(false)

  const currentUserFirstInitial = firstName?.charAt(0).toUpperCase()
  const currentUserLastInitial = lastName?.charAt(0).toUpperCase()
  const isInitialsButtonViewable = currentUserFirstInitial || currentUserLastInitial
  const isProfileImageButtonViewable = userImageUrl && !hasImageError

  useLayoutEffect(
    function resetImageErrorWhenUserPictureChanges() {
      // we clear the error before (re)rendering the image tag (which may or may not trigger an error)
      setHasImageError(false)
    },
    [userImageUrl],
  )

  const handleImageError = () => {
    setHasImageError(true)
  }

  const profilePicture = isProfileImageButtonViewable ? (
    <UserProfilePicture
      src={userImageUrl}
      alt="User picture"
      onError={handleImageError}
      className={className}
    />
  ) : null

  const circleWithInitials =
    isInitialsButtonViewable && !isProfileImageButtonViewable ? (
      <UserCircle className={className} $dark={dark}>
        {currentUserFirstInitial}
        {currentUserLastInitial}
      </UserCircle>
    ) : null

  return (
    profilePicture || circleWithInitials || <FallbackUserIcon className={className} $dark={dark} />
  )
}

UserIcon.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  userImageUrl: PropTypes.string,
  className: PropTypes.string,
  dark: PropTypes.bool,
}
