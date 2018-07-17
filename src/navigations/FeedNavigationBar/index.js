import React from 'react'
import {
  View,
  Text,
  Platform,
  StatusBar,
  TouchableOpacity
} from 'react-native'

import PropTypes from 'prop-types'
import { Ionicons } from 'react-native-vector-icons'
import FeedNavbarSettingComponent from '../../components/FeedNavbarSettingComponent'
import styles from './styles'

class FeedNavigationBar extends React.Component {
  render () {
    const { mode } = this.props

    return (
      <View style={mode === 'normal' ? styles.container : styles.miniContainer}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        {Platform.OS === 'android' && (
          <View style={styles.statusBarUnderlay} />
        )}

        {mode === 'normal'
          ? <View style={styles.subContainer}>
              <View style={styles.navView}>
                <TouchableOpacity>
                  <View style={styles.backView}>
                    <Ionicons name="ios-arrow-back" style={styles.backIcon} />
                    <Text style={styles.backTitle}>My Feedos</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.titleView}>
                <Text style={styles.title}>Feed title</Text>
                <FeedNavbarSettingComponent />
              </View>
            </View>
          : <View style={styles.subContainer}>
              <View style={styles.navView}> 
                <View style={styles.backView}>
                  <Ionicons name="ios-arrow-back" style={styles.backIcon} />
                  <Text style={styles.backTitle}>My Feedos</Text>
                </View>
                <FeedNavbarSettingComponent />
              </View>
            </View>
        }
      </View>
    )
  }
}

FeedNavigationBar.defaultProps = {
  mode: 'normal'
}

FeedNavigationBar.propTypes = {
  mode: PropTypes.string
}

export default FeedNavigationBar
