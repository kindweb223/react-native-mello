import React from 'react'
import PropTypes from 'prop-types'
import FacePile from 'react-native-face-pile'

const AvatarPileComponent = ({ maxCount, avatars }) => (
  <FacePile numFaces={maxCount} faces={avatars} circleSize={19} />
)

AvatarPileComponent.defaultProps = {
  maxCont: 3,
  avatars: [
    {
      id: 0,
      imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
      id: 1,
      imageUrl: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    {
      id: 2,
      imageUrl: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    {
      id: 3,
      imageUrl: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
    {
      id: 4,
      imageUrl: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    {
      id: 5,
      imageUrl: 'https://randomuser.me/api/portraits/men/4.jpg'
    },
  ]
}

AvatarPileComponent.propTypes = {
  avatars: PropTypes.arrayOf(PropTypes.any),
  maxCount: PropTypes.number
}

export default AvatarPileComponent
