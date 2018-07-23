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
import { Actions } from 'react-native-router-flux'
import FeedNavbarSettingComponent from '../../components/FeedNavbarSettingComponent'
import AvatarPileComponent from '../../components/AvatarPileComponent'
import styles from './styles'

class FeedNavigationBar extends React.Component {
  backToDashboard = () => {
    Actions.pop()
  }

  render () {
    const { mode, title } = this.props

    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        {Platform.OS === 'android' && (
          <View style={styles.statusBarUnderlay} />
        )}

        {mode === 'normal'
          ? [
              <View key="1" style={styles.navView}>
                <View style={styles.backView}>
                  <TouchableOpacity onPress={this.backToDashboard} style={styles.backButton}>
                    <Ionicons name="ios-arrow-back" style={styles.backIcon} />
                    {/* <Text style={styles.backTitle}>My feedos</Text> */}
                  </TouchableOpacity>
                  <AvatarPileComponent />
                </View>
              </View>,
              <View key="2" style={styles.titleView}>
                <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
                <View>
                  <FeedNavbarSettingComponent />
                </View>
              </View>
            ]
          : <View style={styles.miniNavView}>
              <View>
                <TouchableOpacity onPress={this.backToDashboard} style={styles.backButton}>
                  <Ionicons name="ios-arrow-back" style={styles.backIcon} />
                  {/* <Text style={styles.backTitle}>My feedos</Text> */}
                </TouchableOpacity>
              </View>
              <View style={styles.avatarView}>
                <AvatarPileComponent />
                <FeedNavbarSettingComponent />
              </View>
            </View>
        }
      </View>
    )
  }
}

FeedNavigationBar.defaultProps = {
  mode: 'normal',
  title: ''
}

FeedNavigationBar.propTypes = {
  mode: PropTypes.string,
  title: PropTypes.string
}

export default FeedNavigationBar
