import React from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native'

import { images } from '../../themes';
import styles from './styles';

class TapRemoveComponent extends React.Component {
  render() {
    const { onPress } = this.props
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Showing liked only
        </Text>
        <TouchableOpacity style={styles.closeContainer} onPress={onPress}>
          <Image source={images.closeWhite} style={styles.closeIcon} />
        </TouchableOpacity>
      </View>
    )
  }
}

TapRemoveComponent.propTypes = {
  onPress: PropTypes.func
}

export default TapRemoveComponent