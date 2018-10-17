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
import * as COMMON_FUNC from '../../service/commonFunc'
import COLORS from '../../service/colors'
import styles from './styles'

const BACK_COLORS = [
  'rgb(247, 224, 226)',
  'rgb(234, 247, 253)',
  '#f00',
  '#ff0',
  '#0ff'
]

class SwipeFirstScreen extends React.Component {
  render() {
    return (
      <View style={styles.swipeContainer}>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>Welcome to Feedo - your favourite little app to collect </Text>
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
            <Text>BBBBB</Text>
            <Text>CCCCC</Text>
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
