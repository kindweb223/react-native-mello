import React from 'react'
import {
  View,
  Text, 
  TouchableOpacity,
  FlatList,
  Platform,
  Linking
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import SafariView from "react-native-safari-view"
import InAppBrowser from 'react-native-inappbrowser-reborn'
import Intercom from 'react-native-intercom'
import _ from 'lodash'
import { userSignOut, deleteProfilePhoto } from '../../redux/user/actions'
import COLORS from '../../service/colors'
import styles from './styles'
import Analytics from '../../lib/firebase'
import { TRELLO_URL, FAQS_URL } from '../../service/api'

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

  onCallIntercom = () => {
    Intercom.logEvent('viewed_screen', { extra: 'metadata' });
    Intercom.displayConversationsList();
  }

  handleSupportItem = async(index) => {
    switch(index) {
      case 0:
        this.openURL(FAQS_URL);
        return
      case 1:
        this.openURL(TRELLO_URL);
        return
      case 2:
        this.onCallIntercom();
        return
      default:
        return
    }
  }

  openURL = async(url) => {
    if (Platform.OS === 'ios') {
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
    } else {
      // Android
      try {
        await InAppBrowser.isAvailable()
        InAppBrowser.open(url, {
          toolbarColor: COLORS.PURPLE,
        }).then((result) => {
          console.log(result);
        })
      } catch (error) {
        console.log(error);
      }
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
