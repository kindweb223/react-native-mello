import React from 'react'
import { View, Text, TouchableOpacity, Animated } from 'react-native'
import PropTypes from 'prop-types'
import Ionicons from 'react-native-vector-icons/Ionicons'
import styles from './styles'


class ClipboardToasterComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnimate: new Animated.Value(0),
    }
  }

  componentDidMount() {
    Animated.timing(
      this.state.fadeAnimate, {
        toValue: 1,
        duration: 500
      }
    ).start()
  }

  render() {
    const { title, description } = this.props
    const { fadeAnimate } = this.state
    return (
      <Animated.View style={[styles.container, { opacity: fadeAnimate }]}>
        <TouchableOpacity
          style={styles.mainContainer}
          activeOpacity={0.6}
          onPress={() => this.props.onPress()}
        >
          <Ionicons name="md-add" size={28} color={'#FFFFFF'} />
          <View style={styles.textsContainer}>
            <Text style={styles.textTitle} numberOfLines={1}>{title}</Text>
            <Text style={styles.textDescription} numberOfLines={1}>{description}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    )
  }
}


ClipboardToasterComponent.defaultProps = {
  title: 'Create new card from',
  description: '',
  onPress: () => {},
}


ClipboardToasterComponent.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  onPress: PropTypes.func,
}


export default ClipboardToasterComponent