import React from 'react'
import PropTypes from 'prop-types'
import FacePile from 'react-native-face-pile'

const AvatarPileComponent = ({ maxCount, avatars }) => (
  <FacePile numFaces={maxCount} faces={avatars} circleSize={19} />
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
