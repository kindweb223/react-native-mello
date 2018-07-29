import React from 'react'
import {
  View,
  TouchableOpacity,
} from 'react-native'

import Entypo from 'react-native-vector-icons/Entypo'
import Octicons from 'react-native-vector-icons/Octicons'
import styles from './styles'

class FeedNavbarSettingComponent extends React.Component {
  render() {
    return (
      <View style={styles.settingView}>
        <TouchableOpacity style={styles.zapButton}>
          <View style={styles.zapButtonView}>
            <Octicons name="zap" style={styles.zapIcon} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={styles.button}>
            <Entypo name="dots-three-horizontal" style={styles.settingIcon} />
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

export default FeedNavbarSettingComponent
