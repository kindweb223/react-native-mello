import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

class App extends React.Component {
  render () {
    return (
      <View style={styles.container}>
        <Text>Test</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})

export default App
