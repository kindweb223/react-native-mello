import React from 'react'
import PropTypes from 'prop-types'
import FacePile from './FacePile'

const AvatarPileComponent = ({ maxCount, avatars }) => (
  <FacePile numFaces={maxCount} faces={avatars} />
)

AvatarPileComponent.defaultProps = {
  maxCount: 4,
  avatars: []
}

AvatarPileComponent.propTypes = {
  avatars: PropTypes.arrayOf(PropTypes.any),
  maxCount: PropTypes.number
}

export default AvatarPileComponent
