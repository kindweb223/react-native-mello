import React from 'react'
import {
  View,
  Text,
  Alert
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import Feather from 'react-native-vector-icons/Feather'
import LinearGradient from 'react-native-linear-gradient'
import LoadingScreen from '../LoadingScreen'
import { confirmAccount, getUserSession } from '../../redux/user/actions'
import COLORS from '../../service/colors'
import styles from './styles'

const Gradient = () => {
  return(
    <LinearGradient
      colors={[COLORS.PURPLE, COLORS.RED]}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 0.0 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      }}
    />
  )
}

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
            <Gradient />
            <Feather name="check" size={60} color={'#fff'} />
          </View>

          <View style={styles.titleView}>
            <Text style={styles.title}>Success!</Text>
            <Text style={styles.subTitle}>Password successfully saved</Text>
          </View>
        </View>
      </View>
    )
  }
}

export default ResetPasswordSuccessScreen
