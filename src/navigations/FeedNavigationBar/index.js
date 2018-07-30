import React from 'react'
import {
  View,
  Text,
  Platform,
  StatusBar,
  TouchableOpacity
} from 'react-native'

import PropTypes from 'prop-types'
import FeedNavbarSettingComponent from '../../components/FeedNavbarSettingComponent'
import styles from './styles'

class FeedNavigationBar extends React.Component {
  render () {
    const { title } = this.props

    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        {Platform.OS === 'android' && (
          <View style={styles.statusBarUnderlay} />
        )}

        <View key="2" style={styles.titleView}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
          <View>
            <FeedNavbarSettingComponent />
          </View>
        </View>
      </View>
    )
  }
}

FeedNavigationBar.defaultProps = {
  title: '',
}

FeedNavigationBar.propTypes = {
  title: PropTypes.string,
}

export default FeedNavigationBar
