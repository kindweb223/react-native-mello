import React from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  AsyncStorage
} from 'react-native'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import PropTypes from 'prop-types'
import FastImage from "react-native-fast-image"
import Swiper from 'react-native-swiper'

import LoadingScreen from '../LoadingScreen'
import TextRollingComponent from '../../components/TextRollingComponent'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import COLORS from '../../service/colors'
import styles from './styles'

const FIRST_IMAGE= require('../../../assets/images/LoginSlider/first.png')
const SECOND_IMAGE= require('../../../assets/images/LoginSlider/second.png')

const BACK_COLORS = [
  'rgb(247, 224, 226)',
  'rgb(234, 247, 253)',
  'rgb(247, 224, 226)',
  'rgb(234, 247, 253)',
  'rgb(247, 224, 226)'
]

class SwipeFirstScreen extends React.Component {
  render() {
    return (
      <View style={styles.swipeContainer}>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>Welcome to Feedo -</Text>
          <Text style={styles.titleText}>your favourite little app</Text>
          <View style={styles.lastTextView}>
            <Text style={styles.titleText}>to collect </Text>
            <TextRollingComponent />
          </View>
        </View>
        <View style={styles.sliderFirstImagView}>
          <Image source={FIRST_IMAGE} />
        </View>
        <View style={styles.videoLInkView}>
          <Text style={styles.linkText}>
            All about Feedo in 90 seconds 
          </Text>
          <MaterialCommunityIcons name='play' size={20} color={COLORS.PURPLE} />
        </View>
      </View>
    )
  }
}

class SwipeSecondScreen extends React.Component {
  render() {
    return (
      <View style={styles.swipeContainer}>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>Create smart and beautiful collections</Text>
        </View>
        <View style={styles.sliderSecondImagView}>
          <Image source={SECOND_IMAGE} />
        </View>
      </View>
    )
  }
}

class LoginStartScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      postion: 0
    }
  }

  render () {
    const { position } = this.state

    return (
      <View style={[styles.container, { backgroundColor: BACK_COLORS[position] }]}>
        <SafeAreaView style={styles.safeView}>
          <Swiper
            loop={false}
            index={position}
            paginationStyle={{ bottom: 0 }}
            dotStyle={styles.dotStyle}
            activeDotStyle={styles.dotStyle}
            activeDotColor={COLORS.PURPLE}
            dotColor={COLORS.MEDIUM_GREY}
            onIndexChanged={(index) => this.setState({ position: index })}
          >
            <SwipeFirstScreen />
            <SwipeSecondScreen />
            <SwipeFirstScreen />
            <SwipeSecondScreen />
            <SwipeFirstScreen />
          </Swiper>

          <View style={styles.bottomContainer}>
            <TouchableOpacity onPress={() => this.onSignUp()} activeOpacity={0.8}>
              <View style={styles.buttonView}>
                <Text style={styles.buttonText}>Sign up</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.signinView}>
              <Text style={styles.signinText}>Already have an account? Sign in.</Text>
            </View>
          </View>
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
