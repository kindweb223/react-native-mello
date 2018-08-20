import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import LinearGradient from 'react-native-linear-gradient'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
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

class TermsAndConditionsScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  onContinue = () => {

  }

  render () {
    const { userEmail } = this.props

    return (
      <View style={styles.container}>
        <Gradient />

        {this.state.loading && (
          <LoadingScreen />
        )}

        <View style={styles.modalContainer}>
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.innerContainer}>
              <TouchableOpacity onPress={() => this.onContinue()} style={styles.buttonView}>
                <Text style={styles.btnContinue}>Continue</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        <View style={styles.headerView}>
          <TouchableOpacity onPress={() => Actions.pop()} style={styles.btnBack}>
            <Feather name="arrow-left" size={25} color={'#fff'} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Terms & Conditions</Text>
          <View />
        </View>
      </View>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  onContinue: (data) => dispatch(onContinue(data)),
})

export default connect(
  null,
  mapDispatchToProps
)(TermsAndConditionsScreen)