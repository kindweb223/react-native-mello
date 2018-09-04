import React from 'react'
import { View, Text, TouchableOpacity, Animated } from 'react-native'
import Modal from 'react-native-modal'
import PropTypes from 'prop-types'
import styles from './styles'

class ToasterComponent extends React.Component {
  state = {
    fadeAnimate: new Animated.Value(0)
  }

  componentDidMount() {
    Animated.timing(
      this.state.fadeAnimate,
      {
        toValue: 1,
        duration: 500
      }
    ).start()
  }

  render() {
    const { title, buttonTitle, isVisible } = this.props
    const { fadeAnimate } = this.state

    if (isVisible) {
      return (
        <Animated.View style={[styles.container, { opacity: fadeAnimate }]}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={() => this.props.onPressButton()}>
            <View style={styles.buttonView}>
              <Text style={styles.button}>{buttonTitle}</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )
    } else {
      return null
    }
  }
}

ToasterComponent.defaultProps = {
  onPressButton: () => {},
  title: '',
  buttonTitle: 'undo',
  isVisible: false
}

ToasterComponent.propTypes = {
  title: PropTypes.string,
  buttonTitle: PropTypes.string,
  onPressButton: PropTypes.func,
  isVisible: PropTypes.bool
}

export default ToasterComponent