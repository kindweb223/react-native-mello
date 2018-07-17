import React from 'react'
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native'
import PropTypes from 'prop-types'
import { MaterialCommunityIcons } from '@expo/vector-icons';

import COLORS from '../../service/colors'
import styles from './styles'


class NewFeedScreen extends React.Component {
  onClose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  onCreate() {
  }

  render () {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity 
          style={styles.backgroundContainer}
          activeOpacity={1}
          onPress={this.onClose.bind(this)}
        />
        <View style={styles.contentContainer}>
          <View style={styles.topContainer}>
            <TouchableOpacity 
              style={styles.closeContainer}
              activeOpacity={0.6}
              onPress={this.onClose.bind(this)}
            >
              <MaterialCommunityIcons name="close" size={32} color={COLORS.PURPLE} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.createContainer}
              activeOpacity={0.6}
              onPress={this.onCreate.bind(this)}
            >
              <Text style={styles.textButton}>Create</Text>
            </TouchableOpacity>

          </View>
        </View>
        <TouchableOpacity 
          style={styles.backgroundContainer}
          activeOpacity={1}
          onPress={this.onClose.bind(this)}
        />
      </SafeAreaView>
    )
  }
}


NewFeedScreen.defaultProps = {
  onClose: () => {},
  onCreate: () => {},
}


NewFeedScreen.propTypes = {
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
}


export default NewFeedScreen
