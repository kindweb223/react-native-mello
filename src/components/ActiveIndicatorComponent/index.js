import React from 'react'
import {
  View,
  ActivityIndicator
} from 'react-native'
import COLORS from '../../service/colors'
import styles from './styles'

const ActiveIndicatorComponent = () => (
  <View style={styles.container}>
    <ActivityIndicator 
        animating
        size="large"
        color={COLORS.PURPLE}
      />
  </View>
)

export default ActiveIndicatorComponent
