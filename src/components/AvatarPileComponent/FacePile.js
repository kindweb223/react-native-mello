import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet, Animated } from 'react-native'
import UserAvatar from 'react-native-user-avatar'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  overflow: {
    backgroundColor: '#b6c0ca',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 18
  },
  overflowLabel: {
    color: '#fff',
    fontSize: 14,
    letterSpacing: -1,
    marginLeft: 3,
    fontWeight: 'bold'
  }
})

class Circle extends PureComponent {
  static propTypes = {
    imageStyle: PropTypes.objectOf(PropTypes.any),
    circleSize: PropTypes.number.isRequired,
    face: PropTypes.objectOf(PropTypes.any).isRequired,
    offset: PropTypes.number.isRequired
  }
  static defaultProps = {
    imageStyle: {},
  }

  render () {
    const { circleSize, face, offset } = this.props
    const marginRight = circleSize * offset - 6

    return (
      <Animated.View
        style={{ marginRight: -marginRight }}
      >
        <UserAvatar
          size="35"
          name={face.userName}
          color="#000"
          textColor="#fff"
          src={face.imageUrl}
        />
      </Animated.View>
    )
  }
}

Circle.propTypes = {
  imageStyle: PropTypes.objectOf(PropTypes.any).isRequired,
  circleSize: PropTypes.number.isRequired,
  face: PropTypes.objectOf(PropTypes.any).isRequired,
  offset: PropTypes.number.isRequired
}

export function renderFacePile (faces = [], numFaces) {
  const entities = faces
  if (!entities.length) return {
    facesToRender: [],
    overflow: 0
  }

  const facesToRender = entities.slice(0, numFaces)
  const overflow = entities.length - facesToRender.length

  return {
    facesToRender,
    overflow
  }
}

export default class FacePile extends PureComponent {
  static propTypes = {
    faces: PropTypes.arrayOf(
      PropTypes.shape({
        imageUrl: PropTypes.string
      })
    ).isRequired,
    circleSize: PropTypes.number,
    hideOverflow: PropTypes.bool,
    containerStyle: PropTypes.instanceOf(StyleSheet),
    circleStyle: PropTypes.instanceOf(StyleSheet),
    imageStyle: PropTypes.instanceOf(StyleSheet),
    overflowStyle: PropTypes.instanceOf(StyleSheet),
    overflowLabelStyle: PropTypes.instanceOf(StyleSheet),
    render: PropTypes.func,
    numFaces: PropTypes.number,
    offset: PropTypes.number,
    isOwner: PropTypes.bool
  }

  static defaultProps = {
    circleSize: 20,
    numFaces: 4,
    offset: 1,
    hideOverflow: false,
    isOwner: true
  }

  _renderOverflowCircle = overflow => {
    const {
      circleStyle,
      overflowStyle,
      overflowLabelStyle,
      circleSize,
      offset,
    } = this.props
    
    const innerCircleSize = circleSize * 1.8
    const marginLeft = (circleSize * offset) - circleSize / 1.6

    return (
      <View
        style={[
          styles.circle,
          circleStyle
        ]}
      >
        <View
          style={[
            styles.overflow,
            {
              width: innerCircleSize,
              height: innerCircleSize,
              borderRadius: circleSize,
              marginLeft: marginLeft
            },
            overflowStyle
          ]}
        >
          <Text
            style={[
              styles.overflowLabel,
              {
                fontSize: circleSize * 0.7
              },
              overflowLabelStyle
            ]}
          >
            +{overflow}
          </Text>
        </View>
      </View>
    )
  }

  _renderEmptyOverflowCircle = () => {
    const {
      circleStyle,
      overflowStyle,
      circleSize,
      offset,
    } = this.props
    
    const innerCircleSize = 35
    const marginLeft = (circleSize * offset) - circleSize / 1.6

    return (
      <View
        style={[
          styles.circle,
          circleStyle
        ]}
      >
        <View
          style={[
            styles.overflow,
            {
              width: innerCircleSize,
              height: innerCircleSize,
              borderRadius: circleSize,
              marginLeft: marginLeft,
              backgroundColor: '#4A00CD'
            },
            overflowStyle
          ]}
        >
          <Text
            style={[
              styles.overflowLabel,
              {
                fontSize: 25,
                fontWeight: 'normal',
                color: '#fff'
              }
            ]}
          >
            +
          </Text>
        </View>
      </View>
    )
  }

  _renderFace = (face) => {
    const { circleStyle, circleSize, offset } = this.props

    return (
      <Circle
        key={face.id}
        face={face}
        circleStyle={circleStyle}
        circleSize={circleSize}
        offset={offset}
      />
    )
  }

  render () {
    const { faces, numFaces, hideOverflow, containerStyle } = this.props

    if (faces.length === 0) 
      return null

    const { facesToRender, overflow } = renderFacePile(faces, numFaces)

    return (
      <View style={[styles.container, containerStyle]}>
        {!hideOverflow && (
          overflow > 0 ? this._renderOverflowCircle(overflow) : this._renderEmptyOverflowCircle()
        )}
        {Array.isArray(facesToRender) && facesToRender.map(this._renderFace)}
      </View>
    )
  }
}

