import React from 'react'
import {
  View,
  Text,
  Image
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import styles from './styles'
import Analytics from '../../lib/firebase'

const SUCCESS_ICON = require('../../../assets/images/Success/adamStatic3.png')

class ResetPasswordSuccessScreen extends React.Component {
  componentWillMount() {
    Analytics.setCurrentScreen('ResetPasswordSuccessScreen')

    setTimeout(() => {
      Actions.LoginScreen()
    }, 2000)
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.body}>
          <View style={styles.successView}>
            <Image source={SUCCESS_ICON} />
          </View>

          <View style={styles.titleView}>
            <Text style={styles.title}>Success!</Text>
            <Text style={styles.subTitle}>Your password has been changed</Text>
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = ({ user }) => ({
  user
})

export default connect(mapStateToProps, null)(ResetPasswordSuccessScreen)