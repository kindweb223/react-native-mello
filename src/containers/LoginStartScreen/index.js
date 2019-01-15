import React from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import PropTypes from 'prop-types'
import Swiper from 'react-native-swiper'
import Video from 'react-native-video'
import LottieView from 'lottie-react-native'

import LoadingScreen from '../LoadingScreen'
import COLORS from '../../service/colors'
import styles from './styles'
import Analytics from '../../lib/firebase'

const LOGO = require('../../../assets/images/Login/icon_40pt.png')
import LOTTIE_COLLECT from '../../../assets/lottie/showcase-collect.json'
import LOTTIE_REVIEW from '../../../assets/lottie/showcase-review.json'
import LOTTIE_SHARE from '../../../assets/lottie/showcase-share.json'

class SwipeLogoScreen extends React.Component {
  render() {
    return (
      <View style={[styles.swipeContainer, { flex: 1 }]}>
        <View style={styles.logoView}>
          <Text style={styles.logoText}>mello</Text>
          <Image style={styles.logo} source={LOGO} />
        </View>
        <View>
          <Text style={styles.logoSubText}>A place to put things</Text>
          <Text style={styles.logoSubText}>that matter to you</Text>
        </View>
      </View>
    )
  }
}

class LoginStartScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      position: 0,
      screenIndex: 0
    }
  }

  componentDidMount() {
    Analytics.setCurrentScreen('LoginStartScreen')
  }

  onLogin = () => {
    Actions.LoginScreen()
  }

  onSignUp = () => {
    Actions.SignUpScreen()
  }

  onMomentumScrollEnd = (e, state, context) => {
    this.setState({ position: context.state.index })
  }

  renderLottieView(title, lottieUrl) {
    return (
      <View style={styles.swipeContainer}>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
        <View style={styles.lottieView}>
          <LottieView
            source={lottieUrl}
            autoPlay
            loop
          />
        </View>
      </View>
    )
  }

  renderImageView(title, imageUrl) {
    return (
      <View style={styles.swipeContainer}>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
        <View style={styles.lottieView}>
          <Image style={styles.navLogo} source={imageUrl} />
        </View>
      </View>
    )
  }

  render () {
    const { position } = this.state

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeView}>
          {position > 0 && (
            <View style={styles.navbarView}>
              <Image style={styles.navLogo} source={LOGO} />
            </View>
          )}

          <Swiper
            loop={false}
            index={position}
            paginationStyle={{ bottom: 20 }}
            dotStyle={styles.dotStyle}
            activeDotStyle={styles.dotStyle}
            activeDotColor={COLORS.MEDIUM_GREY}
            dotColor="#fff"
            onMomentumScrollEnd={this.onMomentumScrollEnd}
          >           
            <SwipeLogoScreen />
            {this.renderLottieView('Save important content from the web.', LOTTIE_COLLECT)}
            {this.renderLottieView('... or from your camera', LOTTIE_REVIEW)}
            {this.renderLottieView('... or just straight out of you brain', LOTTIE_SHARE)}
            {this.renderImageView('... from instagram, Photos, Dropbox, YouTube, Pinterest, Slack... You get the idea', LOGO)}
            {this.renderImageView('Collaborate with your teammates and close friends', LOGO)}
          </Swiper>

          {position > 0 && (
            <View style={styles.skipButtonView}>
              <TouchableOpacity onPress={() => this.onSkip()} activeOpacity={0.8}>
                <View style={styles.skipButton}>
                  <Text style={styles.skipButtonText}>Skip</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* <View style={styles.bottomContainer}>
            <TouchableOpacity onPress={() => this.onSignUp()} activeOpacity={0.8}>
              <View style={styles.buttonView}>
                <Text style={styles.buttonText}>Sign up</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.signinView}>
              <Text
                onPress={() => this.onLogin()}
                suppressHighlighting={true}
                style={styles.signinText}
              >
                Already have an account? Sign in.
              </Text>
            </View>
          </View> */}
        </SafeAreaView>

        {this.state.loading && (
          <LoadingScreen />
        )}
      </View>
    )
  }
}

LoginStartScreen.propTypes = {
  userLookup: PropTypes.func.isRequired
}

const mapStateToProps = ({ user }) => ({
  user
})

const mapDispatchToProps = dispatch => ({
  userLookup: (data) => dispatch(userLookup(data)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginStartScreen)
