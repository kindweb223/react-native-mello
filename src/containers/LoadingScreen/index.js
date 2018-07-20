import React from 'react'
import {
  SafeAreaView,
  ActivityIndicator,
  View,
} from 'react-native'
import PropTypes from 'prop-types'

import styles from './styles'
import COLORS from '../../service/colors'


export default class LoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render () {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator 
          animating
          size="large"
          color={COLORS.PURPLE}
        />
      </SafeAreaView>
    )
  }
}