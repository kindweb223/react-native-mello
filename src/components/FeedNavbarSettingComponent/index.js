import React from 'react'
import {
  View,
  TouchableOpacity,
  Platform,
} from 'react-native'

import Entypo from 'react-native-vector-icons/Entypo'
import Octicons from 'react-native-vector-icons/Octicons'
import styles from './styles'

class FeedNavbarSettingComponent extends React.Component {
  render() {
    return (
      <View style={styles.settingView}>
        <TouchableOpacity onPress={() => this.props.handleSetting()}>
          <View style={styles.button}>
            <Entypo name={Platform.OS === 'ios' ? "dots-three-horizontal" : "dots-three-vertical"} style={styles.settingIcon} />
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

export default FeedNavbarSettingComponent
