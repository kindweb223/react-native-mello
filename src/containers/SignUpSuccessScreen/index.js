import React from 'react'
import {
  View,
  Text,
  Alert,
  Image
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import LoadingScreen from '../LoadingScreen'
import { confirmAccount, getUserSession } from '../../redux/user/actions'
import COLORS from '../../service/colors'
import styles from './styles'
const SUCCESS_ICON = require('../../../assets/images/Success/adamStatic3.png')

class SignUpSuccessScreen extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
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
            <Text style={styles.title}>Success!</Text>
            <Text style={styles.subTitle}>Welcome to Feedo!</Text>
          </View>
        </View>
      </View>
    )
  }
}

export default SignUpSuccessScreen
