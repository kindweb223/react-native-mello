import React from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import COLORS from '../../service/colors'
import styles from './styles'
import Analytics from '../../lib/firebase'
import { updateProfile } from '../../redux/user/actions'
import FastImage from 'react-native-fast-image';

const LOGO = require('../../../assets/images/Login/icon_60pt.png')

class TermsAndConditionsConfirmScreen extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    Analytics.setCurrentScreen('TermsAndConditionsConfirmScreen')
  }

  onContinue = () => {
    const { userInfo } = this.props.user

    const data = {
      tandcAccepted: true
    }
    this.props.updateProfile(userInfo.id, data)

    Actions.HomeScreen()
  }

  render () {
    const { user: { userInfo } } = this.props
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeView}>
          <View style={styles.navbarView}>
            <Image source={LOGO} />
          </View>

          <View style={styles.subContainer}>
            <View style={styles.avatarView}>
              {userInfo && (
                <FastImage
                  style={styles.avatar}
                  source={{ uri: userInfo.imageUrl }}
                />
              )}                
            </View>

            <Text style={styles.title}>You are almost set, {userInfo ? userInfo.firstName : ''}!</Text>

            <View style={styles.tcView}>
              <Text
                suppressHighlighting={true}
                style={styles.tcText}
              >
                Tap Continue to accept 
              </Text>
              <TouchableOpacity onPress={() => Actions.TermsAndConditionsScreen()}>
                <Text style={[styles.tcText, { color: COLORS.PURPLE }]}> Terms & Conditions</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => this.onContinue()} activeOpacity={0.8}>
              <View style={styles.buttonView}>
                <Text style={styles.buttonText}>Continue</Text>
              </View>
            </TouchableOpacity>

          </View>
        </SafeAreaView>
      </View>
    )
  }
}

const mapStateToProps = ({ user }) => ({
  user
})

const mapDispatchToProps = dispatch => ({
  updateProfile: (userId, data) => dispatch(updateProfile(userId, data)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TermsAndConditionsConfirmScreen)
