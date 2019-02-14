import React from 'react'
import {
  View,
  Text,
  Image
} from 'react-native'

import { Actions } from 'react-native-router-flux'
import styles from './styles'
import Analytics from '../../lib/firebase'

const SUCCESS_ICON = require('../../../assets/images/Success/adamStatic3.png')

class SignUpSuccessScreen extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    Analytics.setCurrentScreen('SignUpSuccessScreen')

    setTimeout(() => {
      Actions.HomeScreen()
    }, 4000)
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.body}>
          <View style={styles.successView}>
            <Image source={SUCCESS_ICON} />
          </View>

          <View style={styles.titleView}>
            <Text style={styles.title}>👍 Success!</Text>
            <Text style={styles.subTitle}>Welcome to Mello!</Text>
            <Image source={BUTTON} />
          </View>
        </View>
      </View>
    )
  }
}

export default SignUpSuccessScreen
