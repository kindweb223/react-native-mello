import React from 'react'
import PropTypes from 'prop-types'
import FacePile from './FacePile'

const AvatarPileComponent = ({ avatars }) => (
  <FacePile faces={avatars} />
)

AvatarPileComponent.defaultProps = {
  avatars: []
}

AvatarPileComponent.propTypes = {
  avatars: PropTypes.arrayOf(PropTypes.any),
}

export default AvatarPileComponent
