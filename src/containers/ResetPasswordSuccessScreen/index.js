import React from 'react'
import {
  View,
  Text
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import styles from './styles'

class ResetPasswordSuccessScreen extends React.Component {
  componentWillMount() {
    setTimeout(() => {
      Actions.LoginStartScreen()
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
    )
  }
}

export default ResetPasswordSuccessScreen
