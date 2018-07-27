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
import { isEmpty } from 'lodash'
import FeedNavbarSettingComponent from '../../components/FeedNavbarSettingComponent'
import AvatarPileComponent from '../../components/AvatarPileComponent'
import styles from './styles'

class FeedNavigationBar extends React.Component {
  backToDashboard = () => {
    Actions.pop()
  }

  checkOwner = (data) =>{
    if (data.invitees.length === 1 && data.owner.id === data.invitees[0].userProfile.id) {
      return true
    }
    return false
  }

  render () {
    const { mode, title, data } = this.props

    let avatars = []
    if (!isEmpty(data)) {
      const isOwner = this.checkOwner(data)

      if (isOwner) {
        avatars = [
          {
            id: 1,
            imageUrl: data.owner.imageUrl,
            userName: `${data.owner.firstName} ${data.owner.lastName}`
          }
        ]
      } else {
        data.invitees.forEach((item, key) => {
          avatars = [
            ...avatars,
            {
              id: key,
              imageUrl: item.userProfile.imageUrl,
              userName: `${item.userProfile.firstName} ${item.userProfile.lastName}`
            }
          ]
        })
      }
    }

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
                  </TouchableOpacity>
                  <AvatarPileComponent avatars={avatars} />
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
                <TouchableOpacity onPress={this.backToDashboard}>
                  <Ionicons name="ios-arrow-back" style={styles.backIcon} />
                </TouchableOpacity>
              </View>
              <View style={styles.avatarView}>
                <AvatarPileComponent avatars={avatars} />
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
  title: '',
  data: {}
}

FeedNavigationBar.propTypes = {
  mode: PropTypes.string,
  title: PropTypes.string,
  data: PropTypes.objectOf(PropTypes.any)
}

export default FeedNavigationBar
