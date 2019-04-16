import React from 'react'
import PropTypes from 'prop-types'
import FacePile from './FacePile'

const AvatarPileComponent = ({ avatars, numFaces, size, showPlus, showStroke }) => (
  <FacePile faces={avatars} circleSize={size} numFaces={numFaces} showPlus={showPlus} showStroke={showStroke} />
)

AvatarPileComponent.defaultProps = {
  numFaces: 3,
  size: 35,
  showPlus: true,
  avatars: []
}

AvatarPileComponent.propTypes = {
  numFaces: PropTypes.number,
  size: PropTypes.number,
  showPlus: PropTypes.bool,
  avatars: PropTypes.arrayOf(PropTypes.any),
}

export default AvatarPileComponent
