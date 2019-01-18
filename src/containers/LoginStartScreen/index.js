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

const LOGO = require('../../../assets/images/Login/logoMelloIcon-Tutorial.png')
const LOGO_TEXT = require('../../../assets/images/Login/logoMello-Tutorial.png')
const TEMP_IMG = require('../../../assets/images/Login/tutorialTempImg.png')
const GOOGLE_ICON = require('../../../assets/images/Login/iconMediumGoogle.png')
const MAIL_ICON = require('../../../assets/images/Login/iconMediumEmailGrey.png')

import LOTTIE_COLLECT from '../../../assets/lottie/showcase-collect.json'
import LOTTIE_REVIEW from '../../../assets/lottie/showcase-review.json'
import LOTTIE_SHARE from '../../../assets/lottie/showcase-share.json'

class LoginStartScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      position: 0
    }
  }

  componentDidMount() {
    Analytics.setCurrentScreen('TutorialScreen')
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.prevPage === 'login') {
      this.onSkip()
    }
  }

  onLogin = () => {
    Actions.LoginScreen()
  }

  onSignUp = () => {
    Actions.SignUpScreen()
  }

  onMomentumScrollEnd = (e, state, context) => {
    this.lottieFirst.reset()
    this.lottieSecond.reset()
    this.lottieThird.reset()
    if (context.state.index === 1) {
      this.lottieFirst.play()
    } else if (context.state.index === 2) {
      this.lottieSecond.play()
    } else if (context.state.index === 3) {
      this.lottieThird.play()
    }

    this.setState({ position: context.state.index })
  }

  renderLogoView() {
    return (
      <View style={styles.logoViewContainer}>
        <View style={styles.logoView}>
          <Image style={styles.logo} source={LOGO_TEXT} />
        </View>
        <Text style={styles.subText}>A place to put things that matter to you.</Text>
      </View>
    )
  }

  renderLottieView(title, lottieUrl, index) {
    return (
      <View style={styles.swipeContainer}>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
        <View style={styles.lottieView}>
          {index === 1 && (
            <LottieView
              ref={animation => this.lottieFirst = animation}
              source={lottieUrl}
              loop
              style={{ }}
            />
          )}
          {index === 2 && (
            <LottieView
              ref={animation => this.lottieSecond = animation}
              source={lottieUrl}
              loop
              style={{ }}
            />
          )}
          {index === 3 && (
            <LottieView
              ref={animation => this.lottieThird = animation}
              source={lottieUrl}
              loop
              style={{ }}
            />
          )}          
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
        <View style={styles.imageView}>
          <Image style={styles.navLogo} source={imageUrl} />
        </View>
      </View>
    )
  }

  renderSignupView() {
    return (
      <View style={styles.logoViewContainer}>
        <View style={styles.signupFormView}>
          <View style={styles.signupTextView}>
            <Text style={styles.subText}>Sign up</Text>
          </View>
          <TouchableOpacity onPress={() => this.onSignUp()} activeOpacity={0.8}>
            <View style={styles.buttonView}>
              <Image source={GOOGLE_ICON} />
              <Text style={styles.buttonText}>Sign up with Google</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.onSignUp()} activeOpacity={0.8}>
            <View style={styles.buttonView}>
              <Image source={MAIL_ICON} />
              <Text style={styles.buttonText}>Sign up with e-mail</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.signinView}>
            <Text
              onPress={() => this.onLogin()}
              suppressHighlighting={true}
              style={styles.signinText}
            >
              Already have an account? <Text style={{ color: COLORS.PURPLE }}> Sign in.</Text>
            </Text>
          </View>
        </View>
      </View>
    )
  }

  onSkip() {
    this.setState({ position: 6 })
  }

  render () {
    const { position } = this.state

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeView}>
          <View style={styles.navbarView}>
            {position > 0 && (
              <Image source={LOGO} />
            )}
          </View>

          <Swiper
            loop={false}
            index={position}
            paginationStyle={{ bottom: 10 }}
            dotStyle={styles.dotStyle}
            activeDotStyle={styles.dotStyle}
            activeDotColor={COLORS.DARK_GREY}
            dotColor="#fff"
            onMomentumScrollEnd={this.onMomentumScrollEnd}
            onScrollBeginDrag={this.onScrollBeginDrag}
            onIndexChanged={this.onIndexChanged}
          >           
            {this.renderLogoView()}
            {this.renderLottieView('Save important content from the web.', LOTTIE_COLLECT, 1)}
            {this.renderLottieView('... or from your camera.', LOTTIE_REVIEW, 2)}
            {this.renderLottieView('... or just straight out of you brain.', LOTTIE_SHARE, 3)}
            {this.renderImageView('... from instagram, Photos, Dropbox, YouTube, Pinterest, Slack... You get the idea.', TEMP_IMG)}
            {this.renderImageView('Collaborate with your teammates and close friends.', TEMP_IMG)}
            {this.renderSignupView()}
          </Swiper>

          {(position !== 0 && position !== 6) && (
            <View style={styles.skipButtonView}>
              <TouchableOpacity onPress={() => this.onSkip()} activeOpacity={0.8}>
                <View style={styles.skipButton}>
                  <Text style={styles.skipButtonText}>Skip</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>

        {this.state.loading && (
          <LoadingScreen />
        )}
      </View>
    )
  }
}

LoginStartScreen.defaultProps = {
  prevPage: 'start'
}

LoginStartScreen.propTypes = {
  userLookup: PropTypes.func.isRequired,
  prevPage: PropTypes.string
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
