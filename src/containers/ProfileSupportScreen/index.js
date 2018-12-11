import React from 'react'
import {
  View,
  Text, 
  TouchableOpacity,
  FlatList
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import SafariView from "react-native-safari-view"
import _ from 'lodash'
import { userSignOut, deleteProfilePhoto } from '../../redux/user/actions'
import COLORS from '../../service/colors'
import styles from './styles'
import Analytics from '../../lib/firebase'

const SUPPORT_ITEMS = [
  'FAQs',
  'Open Issues',
  'Contact Us'
]

class ProfileSupportScreen extends React.Component {
  static renderLeftButton(props) {
    return (
      <TouchableOpacity 
        style={styles.buttonWrapper}
        activeOpacity={0.6}
        onPress={() => Actions.pop()}
      >
        <Ionicons name="ios-arrow-back" size={32} color={COLORS.PURPLE} />
      </TouchableOpacity>
    );
  }

  static renderTitle(props) {
    return (
      <Text style={styles.textTitle}>Support</Text>
    );
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    Analytics.setCurrentScreen('ProfileSupportScren')
  }

  handleSupportItem = (index) => {
    switch(index) {
      case 0:
        return
      case 1:
        const url = 'https://trello.com/b/xqBylYZO/mello'
        SafariView.isAvailable()
          .then(SafariView.show({
            url: url,
            tintColor: COLORS.PURPLE
          }))
          .catch(error => {
            // Fallback WebView code for iOS 8 and earlier
            Linking.canOpenURL(url)
              .then(supported => {
                if (!supported) {
                  console.log('Can\'t handle url: ' + url);
                } else {
                  return Linking.openURL(url);
                }
              })
              .catch(error => console.error('An error occurred', error));
          });
        return
      case 2:
        return
      default:
        return
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <FlatList
          data={SUPPORT_ITEMS}
          keyExtractor={item => item}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => this.handleSupportItem(index)}
              activeOpacity={0.8}
              style={styles.itemView}
            >
              <View style={styles.supportItem}>
                <Text style={styles.title}>
                  { item }
                </Text>
                <Ionicons name="ios-arrow-forward" color={COLORS.DARK_GREY} size={20} />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    )
  }
}

ProfileSupportScreen.defaultProps = {
  onClose: () => {},
  userSignOut: () => {},
}

ProfileSupportScreen.propTypes = {
  onClose: PropTypes.func,
  userSignOut: PropTypes.func
}

const mapDispatchToProps =  dispatch => ({
  userSignOut: () => dispatch(userSignOut()),
  deleteProfilePhoto: (userId) => dispatch(deleteProfilePhoto(userId))
})

const mapStateToProps = ({ user }) => ({
  user
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileSupportScreen)
