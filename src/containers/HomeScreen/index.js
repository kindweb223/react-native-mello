import React from 'react'
import {
  SafeAreaView,
  View,
  Text
} from 'react-native'
import styles from './styles'

class HomeScreen extends React.Component {
  render () {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Test</Text>
        <Text>Test</Text>
        <Text>Test</Text>
      </SafeAreaView>
    )
  }
}

export default HomeScreen
